# ============================================================
# AgriLens Backend — Database Seed Script
# ============================================================
# Seeds full 7-class cotton pathology and treatment catalogs
# into MongoDB Atlas from the official knowledge registry.
# ============================================================

import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from motor.motor_asyncio import AsyncIOMotorClient
import certifi

from app.config import settings
from app.models.crop import create_crop_document, COLLECTION_NAME as CROPS_COLLECTION
from app.models.disease import create_disease_document, COLLECTION_NAME as DISEASES_COLLECTION
from app.models.treatment import create_treatment_document, COLLECTION_NAME as TREATMENTS_COLLECTION
from app.models.ai_model_registry import (
    create_ai_model_registry_document,
    COLLECTION_NAME as AI_REGISTRY_COLLECTION,
)
from app.models.user import create_user_document, COLLECTION_NAME as USERS_COLLECTION
from app.services.treatment_advisory_service import DISEASE_KNOWLEDGE_BASE
from app.utils.logger import get_logger
from app.utils.security import hash_password

logger = get_logger("seed")


def get_cotton_crop() -> dict:
    return create_crop_document(
        name="Cotton",
        scientific_name="Gossypium hirsutum",
        description="Cotton is a soft, fluffy staple fiber and premier commercial cash crop.",
        is_active=True,
    )


def generate_full_catalog(crop_id: str):
    """
    Builds treatment documents and disease documents for all 7 cotton pathology classes.
    """
    treatments = []
    diseases = []

    severity_mapping = {
        "Bacterial Blight": "high",
        "Curl Virus": "critical",
        "Healthy Leaf": "low",
        "Herbicide Growth Damage": "moderate",
        "Leaf Hopper Jassids": "high",
        "Leaf Redding": "moderate",
        "Leaf Variegation": "moderate"
    }

    for dis_name, info in DISEASE_KNOWLEDGE_BASE.items():
        treatment_ids = []

        # Chemical Treatment
        chem = info.get("chemical_control")
        if chem:
            chem_doc = create_treatment_document(
                name=chem["product_name"],
                description=f"Active Ingredient: {chem['active_ingredient']}. Standard application for {dis_name}.",
                type="chemical",
                dosage=chem["dosage_per_acre"],
                frequency=f"Spray every {chem['application_interval_days']} days as needed",
                precautions=info.get("weather_safety_rule", "Wear personal protective equipment (PPE). Avoid spraying during high heat or imminent rain.")
            )
            treatments.append(chem_doc)
            treatment_ids.append(chem_doc["_id"])

        # Biological / Organic Treatment
        bio = info.get("biological_organic")
        if bio:
            bio_doc = create_treatment_document(
                name=f"Bio-Remedy: {bio['remedy']}",
                description=bio["description"],
                type="biological",
                dosage="Standard field preparation / foliar bio-suspension",
                frequency="Apply weekly or early morning for maximum microbial viability",
                precautions="Store in cool dry conditions; avoid direct solar UV."
            )
            treatments.append(bio_doc)
            treatment_ids.append(bio_doc["_id"])

        # Create Disease Document
        symptoms = [
            info["description"],
            f"Emergency Protocol: {info['emergency_action']}"
        ]
        prevention = info.get("cultural_preventative", [])

        disease_doc = create_disease_document(
            crop_id=crop_id,
            name=dis_name,
            scientific_name=info["scientific_name"],
            description=info["description"],
            symptoms=symptoms,
            treatment_ids=treatment_ids,
            prevention=prevention,
            severity=severity_mapping.get(dis_name, "moderate"),
        )
        diseases.append(disease_doc)

    return treatments, diseases


def get_ai_model_registry_entry(crop_id: str) -> dict:
    return create_ai_model_registry_document(
        crop_id=crop_id,
        model_name="agrilens_efficientnetv2_vision_ensemble",
        model_path="ai/models/best_model.keras",
        version="1.0.0",
        accuracy=0.9533,
        input_size=240,
        classes=list(DISEASE_KNOWLEDGE_BASE.keys()),
        is_active=True,
    )


def get_default_admin() -> dict:
    return create_user_document(
        email=settings.DEFAULT_ADMIN_EMAIL,
        full_name="AgriLens Admin",
        password_hash=hash_password(settings.DEFAULT_ADMIN_PASSWORD),
        role="admin",
    )


async def seed_database():
    logger.info("Starting complete 7-Class database seed...")
    client = AsyncIOMotorClient(settings.MONGODB_URL, tlsCAFile=certifi.where())
    db = client[settings.DATABASE_NAME]

    try:
        await client.admin.command("ping")
        logger.info("[OK] MongoDB connection verified")

        # Step 1: Clear old dummy catalogs
        await db[CROPS_COLLECTION].delete_many({})
        await db[DISEASES_COLLECTION].delete_many({})
        await db[TREATMENTS_COLLECTION].delete_many({})
        await db[AI_REGISTRY_COLLECTION].delete_many({})

        # Step 2: Seed Cotton Crop
        cotton = get_cotton_crop()
        await db[CROPS_COLLECTION].insert_one(cotton)
        cotton_id = cotton["_id"]
        logger.info(f"[OK] Seeded Cotton Crop: {cotton_id}")

        # Step 3: Seed 7-Class Treatments & Diseases
        treatments, diseases = generate_full_catalog(cotton_id)
        if treatments:
            await db[TREATMENTS_COLLECTION].insert_many(treatments)
            logger.info(f"[OK] Seeded {len(treatments)} treatments")

        if diseases:
            await db[DISEASES_COLLECTION].insert_many(diseases)
            logger.info(f"[OK] Seeded {len(diseases)} diseases (All 7 Cotton Pathology Classes)")

        # Step 4: Seed AI Registry
        ai_entry = get_ai_model_registry_entry(cotton_id)
        await db[AI_REGISTRY_COLLECTION].insert_one(ai_entry)
        logger.info("[OK] Seeded AI Registry Model")

        # Step 5: Seed or Update Admin User
        admin_email = settings.DEFAULT_ADMIN_EMAIL.lower()
        existing_admin = await db[USERS_COLLECTION].find_one({"email": admin_email})
        if not existing_admin:
            admin = get_default_admin()
            await db[USERS_COLLECTION].insert_one(admin)
            logger.info(f"[OK] Created default admin user: {admin_email}")
        else:
            await db[USERS_COLLECTION].update_one(
                {"email": admin_email},
                {"$set": {"password_hash": hash_password(settings.DEFAULT_ADMIN_PASSWORD), "role": "admin"}}
            )
            logger.info(f"[OK] Updated default admin credentials: {admin_email}")

        await db[USERS_COLLECTION].create_index("email", unique=True)
        logger.info("[OK] MongoDB 7-Class Pathology Seed Finished Successfully!")

    except Exception as e:
        logger.error(f"Seed failed: {e}")
        raise
    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(seed_database())
