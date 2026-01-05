from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from auth import get_current_user
from database import SessionLocal
from models import Recommendation, Staff

router = APIRouter()


class RecommendationOut(BaseModel):
    id: int

    week: int
    staff_id: str
    staff_name: str
    role: str
    current_service: str
    hours_worked: float
    recommended_service: str
    justification: str

    status: str
    decided_by: Optional[str] = None
    decided_at: Optional[datetime] = None

    class Config:
        orm_mode = True


ALLOWED_FIELDS = {
    "week",
    "staff_id",
    "staff_name",
    "role",
    "current_service",
    "hours_worked",
    "recommended_service",
    "justification",
}


def _recommendations_json_path() -> Optional[Path]:
    repo_root = Path(__file__).resolve().parents[2]
    candidates = [
        repo_root / "frontend" / "vite-project" / "recommendations_week_1_updated.json",
        repo_root / "backend" / "dataset" / "recommendations_week_1_updated.json",
        # Backward-compat fallback
        repo_root / "frontend" / "vite-project" / "recommendations_week_1.json",
        repo_root / "backend" / "dataset" / "recommendations_week_1.json",
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return None


def _recommendations_updated_json_path() -> Optional[Path]:
    repo_root = Path(__file__).resolve().parents[2]
    candidates = [
        repo_root / "frontend" / "vite-project" / "recommendations_week_1_updated.json",
        repo_root / "backend" / "dataset" / "recommendations_week_1_updated.json",
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return None


def _seed_week1_if_needed() -> None:
    db = SessionLocal()
    try:
        # Backfill: if recommendations already exist, try to align staff_id with hospital_staff
        # so staff can log in using IDs from hospital_staff and still receive recommendations.
        existing = db.query(Recommendation).filter(Recommendation.week == 1).all()
        if existing:
            # Prefer the corrected JSON mapping (staff_name -> staff_id) when available.
            updated_map: dict[str, str] = {}
            updated_json_path = _recommendations_updated_json_path()
            if updated_json_path is not None:
                try:
                    with updated_json_path.open("r", encoding="utf-8") as f:
                        payload = json.load(f)
                    recs = payload.get("recommendations")
                    if isinstance(recs, list):
                        for rec in recs:
                            if not isinstance(rec, dict):
                                continue
                            if rec.get("week") != 1:
                                continue
                            staff_name = str(rec.get("staff_name") or "").strip()
                            staff_id = str(rec.get("staff_id") or "").strip()
                            if staff_name and staff_id:
                                updated_map[staff_name] = staff_id
                except Exception:
                    updated_map = {}

            for rec in existing:
                if rec.staff_name and rec.staff_name in updated_map:
                    rec.staff_id = updated_map[rec.staff_name]
                    continue
                staff_match = db.query(Staff).filter(Staff.staff_id == rec.staff_id).first()
                if staff_match is None and rec.staff_name:
                    by_name = db.query(Staff).filter(Staff.staff_name == rec.staff_name).first()
                    if by_name is not None:
                        rec.staff_id = by_name.staff_id
            db.commit()
            return

        json_path = _recommendations_json_path()
        if json_path is None:
            return

        with json_path.open("r", encoding="utf-8") as f:
            payload = json.load(f)

        recs = payload.get("recommendations")
        if not isinstance(recs, list):
            return

        for rec in recs:
            if not isinstance(rec, dict):
                continue
            cleaned = {k: rec.get(k) for k in ALLOWED_FIELDS}
            if cleaned.get("week") != 1:
                continue
            staff_id = cleaned.get("staff_id")
            if not staff_id:
                continue

            # If this staff_id doesn't exist in hospital_staff, attempt to map by staff_name.
            staff_row = db.query(Staff).filter(Staff.staff_id == str(staff_id)).first()
            if staff_row is None and cleaned.get("staff_name"):
                by_name = db.query(Staff).filter(Staff.staff_name == str(cleaned.get("staff_name"))).first()
                if by_name is not None:
                    staff_id = by_name.staff_id

            db.add(
                Recommendation(
                    week=int(cleaned.get("week") or 1),
                    staff_id=str(staff_id),
                    staff_name=str(cleaned.get("staff_name") or ""),
                    role=str(cleaned.get("role") or ""),
                    current_service=str(cleaned.get("current_service") or ""),
                    hours_worked=float(cleaned.get("hours_worked") or 0.0),
                    recommended_service=str(cleaned.get("recommended_service") or ""),
                    justification=str(cleaned.get("justification") or ""),
                    status="PENDING",
                    decided_by=None,
                    decided_at=None,
                )
            )

        db.commit()
    finally:
        db.close()


@router.get("", response_model=List[RecommendationOut])
@router.get("/", response_model=List[RecommendationOut])
def list_recommendations(week: Optional[int] = None, current=Depends(get_current_user)):
    _seed_week1_if_needed()

    if current["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")

    db = SessionLocal()
    try:
        q = db.query(Recommendation)
        if week is not None:
            q = q.filter(Recommendation.week == week)
        return q.all()
    finally:
        db.close()


@router.get("", response_model=List[RecommendationOut])
def list_recommendations_noslash(week: Optional[int] = None, current=Depends(get_current_user)):
    return list_recommendations(week=week, current=current)


@router.post("/{rec_id}/approve", response_model=RecommendationOut)
def approve_recommendation(rec_id: int, current=Depends(get_current_user)):
    _seed_week1_if_needed()

    if current["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")

    db = SessionLocal()
    try:
        rec = db.query(Recommendation).filter(Recommendation.id == rec_id).first()
        if rec is None:
            raise HTTPException(status_code=404, detail="Recommendation not found")
        if rec.status != "PENDING":
            return rec
        rec.status = "APPROVED"
        rec.decided_by = current.get("username")
        rec.decided_at = datetime.utcnow()
        db.commit()
        db.refresh(rec)
        return rec
    finally:
        db.close()


@router.post("/{rec_id}/reject", response_model=RecommendationOut)
def reject_recommendation(rec_id: int, current=Depends(get_current_user)):
    _seed_week1_if_needed()

    if current["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")

    db = SessionLocal()
    try:
        rec = db.query(Recommendation).filter(Recommendation.id == rec_id).first()
        if rec is None:
            raise HTTPException(status_code=404, detail="Recommendation not found")
        if rec.status != "PENDING":
            return rec
        rec.status = "REJECTED"
        rec.decided_by = current.get("username")
        rec.decided_at = datetime.utcnow()
        db.commit()
        db.refresh(rec)
        return rec
    finally:
        db.close()


@router.get("/me", response_model=List[RecommendationOut])
def my_approved_recommendations(current=Depends(get_current_user)):
    _seed_week1_if_needed()

    if current["role"] != "staff":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")

    staff_id = current.get("username") or getattr(current.get("user"), "staff_id", None)
    if not staff_id:
        return []

    db = SessionLocal()
    try:
        return (
            db.query(Recommendation)
            .filter(Recommendation.staff_id == staff_id)
            .filter(Recommendation.status == "APPROVED")
            .all()
        )
    finally:
        db.close()
