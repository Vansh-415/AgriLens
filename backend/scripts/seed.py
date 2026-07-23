# ============================================================
# AgriLens Backend — Database Seed Script
# ============================================================

import asyncio
import sys
import os

# Add the backend directory to the Python path so we can import app modules
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
from app.utils.logger import get_logger
from app.utils.security import hash_password

logger = get_logger("seed")


# ============================================================
# Seed Data Definitions
# ============================================================

def get_cotton_crop() -> dict:
    return create_crop_document(
        name="Cotton",
        scientific_name="Gossypium",
        description="Cotton is a soft, fluffy staple fiber.",
        is_active=True,
    )

def get_cotton_treatments() -> dict:
    """Create treatments grouped by disease reference."""
    return {
        "bacterial_blight": [
            create_treatment_document(
                name="Copper Oxychloride 50 WP",
                description="Foliar spray to control bacterial infection.",
                type="chemical",
                dosage="2.5g per liter of water",
                frequency="Spray at 15-day intervals",
                precautions="Wear protective gear; do not spray before rain."
            ),
            create_treatment_document(
                name="Streptomycin Sulphate",
                description="Antibiotic treatment for severe bacterial blight.",
                type="chemical",
                dosage="100 ppm",
                frequency="2 sprays at 15-day intervals during early infection",
                precautions="Avoid overuse to prevent antibiotic resistance."
            )
        ],
        "leaf_curl_virus": [
            create_treatment_document(
                name="Imidacloprid 17.8 SL",
                description="Controls whiteflies which act as vectors for the virus.",
                type="chemical",
                dosage="0.5 ml per liter of water",
                frequency="Apply when whitefly population reaches Economic Threshold Level (ETL).",
                precautions="Harmful to bees; do not apply during active foraging periods."
            ),
            create_treatment_document(
                name="Neem Oil Extract",
                description="Organic control for whiteflies.",
                type="organic",
                dosage="5 ml per liter of water",
                frequency="Spray every 7-10 days",
                precautions="Apply during early morning or late evening."
            )
        ],
        "fusarium_wilt": [
            create_treatment_document(
                name="Trichoderma viride",
                description="Bio-fungicide soil treatment.",
                type="biological",
                dosage="2.5 kg per hectare mixed with 50 kg farmyard manure",
                frequency="Apply to soil before sowing",
                precautions="Store in a cool place away from direct sunlight."
            ),
            create_treatment_document(
                name="Carbendazim 50 WP",
                description="Fungicide seed treatment.",
                type="chemical",
                dosage="2g per kg of seeds",
                frequency="Seed treatment before sowing",
                precautions="Highly toxic; ensure proper disposal of containers."
            )
        ]
    }

def get_cotton_diseases(crop_id: str, treatment_map: dict) -> list[dict]:
    return [
        create_disease_document(
            crop_id=crop_id,
            name="Bacterial Blight",
            scientific_name="Xanthomonas citri subsp. malvacearum",
            description="A serious bacterial disease causing angular leaf spots.",
            symptoms=["Angular water-soaked spots", "Black arm on stems"],
            treatment_ids=[t["_id"] for t in treatment_map["bacterial_blight"]],
            prevention=["Use resistant varieties", "Crop rotation"],
            severity="high",
        ),
        create_disease_document(
            crop_id=crop_id,
            name="Leaf Curl Virus",
            scientific_name="Cotton Leaf Curl Virus (CLCuV)",
            description="Viral disease transmitted by whiteflies.",
            symptoms=["Upward or downward curling of leaves", "Leaf enations"],
            treatment_ids=[t["_id"] for t in treatment_map["leaf_curl_virus"]],
            prevention=["Control whiteflies", "Use CLCuV-resistant varieties"],
            severity="critical",
        ),
        create_disease_document(
            crop_id=crop_id,
            name="Fusarium Wilt",
            scientific_name="Fusarium oxysporum",
            description="Soil-borne fungal disease.",
            symptoms=["Yellowing/wilting of leaves", "Brown vascular tissue"],
            treatment_ids=[t["_id"] for t in treatment_map["fusarium_wilt"]],
            prevention=["Improve soil drainage", "Long crop rotations"],
            severity="high",
        ),
        create_disease_document(
            crop_id=crop_id,
            name="Healthy",
            scientific_name="N/A",
            description="Healthy cotton plant.",
            symptoms=[],
            treatment_ids=[],
            prevention=["IPM practices", "Adequate nutrition"],
            severity="low",
        ),
    ]

def get_ai_model_registry_entry(crop_id: str) -> dict:
    return create_ai_model_registry_document(
        crop_id=crop_id,
        model_name="cotton_disease_mobilenetv2",
        model_path="ai_models/cotton/model.keras",
        version="0.0.0",
        accuracy=None,
        input_size=224,
        classes=["bacterial_blight", "leaf_curl_virus", "fusarium_wilt", "healthy"],
        is_active=False,
    )

def get_default_admin() -> dict:
    return create_user_document(
        email=settings.DEFAULT_ADMIN_EMAIL,
        full_name="AgriLens Admin",
        password_hash=hash_password(settings.DEFAULT_ADMIN_PASSWORD),
        role="admin",
    )


# ============================================================
# Main Seed Function
# ============================================================

async def seed_database():
    logger.info("Starting database seed...")
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]

    try:
        await client.admin.command("ping")
        logger.info("[OK] MongoDB connection established")

        # Step 1: Clear data
        await db[CROPS_COLLECTION].delete_many({})
        await db[DISEASES_COLLECTION].delete_many({})
        await db[TREATMENTS_COLLECTION].delete_many({})
        await db[AI_REGISTRY_COLLECTION].delete_many({})

        # Step 2: Crop
        cotton = get_cotton_crop()
        await db[CROPS_COLLECTION].insert_one(cotton)
        cotton_id = cotton["_id"]

        # Step 3: Treatments
        treatment_map = get_cotton_treatments()
        all_treatments = []
        for t_list in treatment_map.values():
            all_treatments.extend(t_list)
        
        await db[TREATMENTS_COLLECTION].insert_many(all_treatments)
        logger.info(f"[OK] Seeded {len(all_treatments)} treatments")

        # Step 4: Diseases
        diseases = get_cotton_diseases(cotton_id, treatment_map)
        await db[DISEASES_COLLECTION].insert_many(diseases)
        logger.info(f"[OK] Seeded {len(diseases)} diseases")

        # Step 5: AI Registry
        ai_entry = get_ai_model_registry_entry(cotton_id)
        await db[AI_REGISTRY_COLLECTION].insert_one(ai_entry)

        # Step 6: Admin
        existing_admin = await db[USERS_COLLECTION].find_one({"email": settings.DEFAULT_ADMIN_EMAIL.lower()})
        if not existing_admin:
            admin = get_default_admin()
            await db[USERS_COLLECTION].insert_one(admin)

        await db[USERS_COLLECTION].create_index("email", unique=True)

        logger.info("SEED COMPLETE")

    except Exception as e:
        logger.error(f"Seed failed: {e}")
        raise
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
