from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from auth import get_current_user
from database import SessionLocal
from models import Patient, ServiceWeekly
from typing import List

router = APIRouter()


@router.get("/summary")
def kpis_summary(current=Depends(get_current_user)):
    # Only admin should access global KPIs
    if current["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    db: Session = SessionLocal()
    try:
        total_patients = db.query(func.count(Patient.patient_id)).scalar() or 0
        admitted = db.query(func.coalesce(func.sum(ServiceWeekly.patients_admitted), 0)).scalar() or 0
        refused = db.query(func.coalesce(func.sum(ServiceWeekly.patients_refused), 0)).scalar() or 0
        avg_satisfaction = db.query(func.avg(Patient.satisfaction)).scalar() or 0.0
        avg_staff_morale = db.query(func.avg(ServiceWeekly.staff_morale)).scalar() or 0.0

        return {
            "total_patients": int(total_patients),
            "patients_admitted": int(admitted),
            "patients_refused": int(refused),
            "avg_satisfaction": float(avg_satisfaction) if avg_satisfaction else 0.0,
            "avg_staff_morale": float(avg_staff_morale) if avg_staff_morale else 0.0,
        }
    finally:
        db.close()


@router.get("/by_service")
def kpis_by_service(current=Depends(get_current_user)):
    # Admin sees all services; staff sees only their service
    if current["role"] not in ["admin", "staff"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    db: Session = SessionLocal()
    try:
        q = db.query(
            ServiceWeekly.service,
            func.coalesce(func.sum(ServiceWeekly.patients_admitted), 0).label("admitted"),
            func.coalesce(func.sum(ServiceWeekly.patients_refused), 0).label("refused"),
            func.coalesce(func.avg(ServiceWeekly.available_beds), 0).label("avg_beds"),
        ).group_by(ServiceWeekly.service)

        if current["role"] == "staff":
            staff_service = getattr(current["user"], "service", None)
            if not staff_service:
                return []
            q = q.filter(ServiceWeekly.service == staff_service)

        results = q.all()
        return [{"service": r[0], "admitted": int(r[1]), "refused": int(r[2]), "avg_beds": float(r[3] or 0)} for r in results]
    finally:
        db.close()


@router.get("/weekly_raw")
def kpis_weekly_raw(current=Depends(get_current_user)):
    # Return raw weekly ServiceWeekly rows (admin) or for staff their service only
    if current["role"] not in ["admin", "staff"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    db: Session = SessionLocal()
    try:
        if current["role"] == "admin":
            rows = db.query(ServiceWeekly).order_by(ServiceWeekly.month, ServiceWeekly.week).all()
        else:
            staff_service = getattr(current["user"], "service", None)
            if not staff_service:
                return []
            rows = db.query(ServiceWeekly).filter(ServiceWeekly.service == staff_service).order_by(ServiceWeekly.month, ServiceWeekly.week).all()
        # Convert ORM objects to dicts
        def row_to_dict(r: ServiceWeekly):
            return {
                "week": r.week,
                "month": r.month,
                "service": r.service,
                "available_beds": r.available_beds,
                "patients_request": r.patients_request,
                "patients_admitted": r.patients_admitted,
                "patients_refused": r.patients_refused,
                "patient_satisfaction": float(r.patient_satisfaction) if r.patient_satisfaction is not None else None,
                "staff_morale": float(r.staff_morale) if r.staff_morale is not None else None,
                "event": r.event,
            }

        return [row_to_dict(r) for r in rows]
    finally:
        db.close()


@router.get("/trends")
def kpis_trends(current=Depends(get_current_user)):
    # Return aggregated time series (by month-week) for charts
    if current["role"] not in ["admin", "staff"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    db: Session = SessionLocal()
    try:
        q = db.query(
            ServiceWeekly.month,
            ServiceWeekly.week,
            func.coalesce(func.sum(ServiceWeekly.patients_admitted), 0).label("admitted"),
            func.coalesce(func.sum(ServiceWeekly.patients_refused), 0).label("refused"),
            func.coalesce(func.avg(ServiceWeekly.patient_satisfaction), 0).label("avg_satisfaction"),
            func.coalesce(func.avg(ServiceWeekly.staff_morale), 0).label("avg_morale"),
        ).group_by(ServiceWeekly.month, ServiceWeekly.week).order_by(ServiceWeekly.month, ServiceWeekly.week)

        if current["role"] == "staff":
            staff_service = getattr(current["user"], "service", None)
            if not staff_service:
                return []
            q = q.filter(ServiceWeekly.service == staff_service)

        rows = q.all()
        return [
            {
                "month": r[0],
                "week": r[1],
                "admitted": int(r[2]),
                "refused": int(r[3]),
                "avg_satisfaction": float(r[4] or 0),
                "avg_morale": float(r[5] or 0),
            }
            for r in rows
        ]
    finally:
        db.close()
