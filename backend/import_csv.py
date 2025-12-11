import csv
from database import SessionLocal, Base, engine
from models import Patient, ServiceWeekly, Staff, StaffSchedule

# create tables if not exist
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# 1️⃣ patients.csv
with open("dataset/patients.csv", newline='', encoding="utf-8") as file:
    reader = csv.DictReader(file)
    for row in reader:
        db.add(Patient(
            patient_id=row["patient_id"],
            name=row["name"],
            age=int(row["age"]),
            arrival_date=row["arrival_date"],
            departure_date=row["departure_date"],
            service=row["service"],
            satisfaction=float(row["satisfaction"])
        ))

# 2️⃣ hospital_service_weekly.csv
with open("dataset/services_weekly.csv", newline='', encoding="utf-8") as file:
    reader = csv.DictReader(file)
    for row in reader:
        db.add(ServiceWeekly(
            week=int(row["week"]),
            month=int(row["month"]),
            service=row["service"],
            available_beds=int(row["available_beds"]),
            patients_request=int(row["patients_request"]),
            patients_admitted=int(row["patients_admitted"]),
            patients_refused=int(row["patients_refused"]),
            patient_satisfaction=float(row["patient_satisfaction"]),
            staff_morale=float(row["staff_morale"]),
            event=row["event"]
        ))

# 3️⃣ hospital_staff.csv
with open("dataset/staff.csv", newline='', encoding="utf-8") as file:
    reader = csv.DictReader(file)
    for row in reader:
        db.add(Staff(
            staff_id=row["staff_id"],
            staff_name=row["staff_name"],
            role=row["role"],
            service=row["service"]
        ))

# 4️⃣ hospital_staff_schedule.csv
with open("dataset/staff_schedule.csv", newline='', encoding="utf-8") as file:
    reader = csv.DictReader(file)
    for row in reader:
        db.add(StaffSchedule(
            week=int(row["week"]),
            staff_id=row["staff_id"],
            staff_name=row["staff_name"],
            role=row["role"],
            service=row["service"],
            present=int(row["present"])
        ))

db.commit()
db.close()
print("Import complete!")
