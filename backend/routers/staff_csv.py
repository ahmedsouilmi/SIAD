from fastapi import APIRouter, Depends, HTTPException
from auth import get_current_user
import csv
from typing import List
import os

router = APIRouter()

DATASET_DIR = os.path.join(os.path.dirname(__file__), '../dataset')

@router.get("/staff_schedule_csv")
def get_staff_schedule(current=Depends(get_current_user)):
    staff_id = getattr(current["user"], "staff_id", None)
    if not staff_id:
        raise HTTPException(status_code=403, detail="Not a staff user")
    staff_name = current.get("staff_name") or getattr(current["user"], "staff_name", None)
    path = os.path.join(DATASET_DIR, 'staff_schedule.csv')
    with open(path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        rows = [row for row in reader if row['staff_id'] == staff_id]
        # Some datasets may have mismatched staff_id values; fall back to staff_name match.
        if not rows and staff_name:
            csvfile.seek(0)
            reader = csv.DictReader(csvfile)
            rows = [row for row in reader if row.get('staff_name') == staff_name]
        return rows

# Explicit "my schedule" endpoint for CSV schedule data (kept separate from DB-backed /staff_schedule)
@router.get("/staff_schedule_csv/me")
def get_my_staff_schedule(current=Depends(get_current_user)):
    staff_id = getattr(current["user"], "staff_id", None)
    if not staff_id:
        raise HTTPException(status_code=403, detail="Not a staff user")
    staff_name = current.get("staff_name") or getattr(current["user"], "staff_name", None)
    path = os.path.join(DATASET_DIR, "staff_schedule.csv")
    with open(path, newline="") as csvfile:
        reader = csv.DictReader(csvfile)
        rows = [row for row in reader if row["staff_id"] == staff_id]
        if not rows and staff_name:
            csvfile.seek(0)
            reader = csv.DictReader(csvfile)
            rows = [row for row in reader if row.get("staff_name") == staff_name]
        return rows

@router.get("/services_weekly")
def get_services_weekly(current=Depends(get_current_user)):
    service = current.get("service") or getattr(current["user"], "service", None)
    if not service:
        raise HTTPException(status_code=403, detail="No service assigned")
    path = os.path.join(DATASET_DIR, 'services_weekly.csv')
    with open(path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        return [row for row in reader if row['service'] == service]

@router.get("/staff_info")
def get_staff_info(current=Depends(get_current_user)):
    staff_id = getattr(current["user"], "staff_id", None)
    if not staff_id:
        raise HTTPException(status_code=403, detail="Not a staff user")
    path = os.path.join(DATASET_DIR, 'staff.csv')
    with open(path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if row['staff_id'] == staff_id:
                return row
    raise HTTPException(status_code=404, detail="Staff not found")
