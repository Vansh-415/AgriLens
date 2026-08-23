# ============================================================
# AgriLens Backend — Personalized Treatment & Advisory Engine
# ============================================================

from typing import Dict, Any, List, Optional


DISEASE_KNOWLEDGE_BASE: Dict[str, Dict[str, Any]] = {
    "Bacterial Blight": {
        "scientific_name": "Xanthomonas citri pv. malvacearum",
        "severity": "Moderate to High",
        "description": "Bacterial Blight causes angular water-soaked leaf spots, vein browning, and boll rot on cotton plants.",
        "emergency_action": "Immediately prune severely blighted leaves/twigs and burn them to prevent bacterial slime dissemination during rain.",
        "chemical_control": {
            "active_ingredient": "Copper Oxychloride 50% WP + Streptomycin Sulphate (9:1)",
            "product_name": "Blitox 50 + Streptocycline",
            "dosage_per_acre": "500 g Blitox + 6 g Streptocycline",
            "water_per_acre_litres": 200,
            "application_interval_days": 10,
            "pre_harvest_interval_days": 15
        },
        "biological_organic": {
            "remedy": "Foliar spray of Pseudomonas fluorescens (10 g/L) or Neem Seed Kernel Extract (NSKE 5%).",
            "description": "Biocontrol agents suppress bacterial colony expansion naturally without chemical residue."
        },
        "cultural_preventative": [
            "Use certified disease-free seeds or delinted seeds treated with Carboxin/Thiram.",
            "Avoid overhead sprinkler irrigation to prevent bacterial splash propagation.",
            "Practice crop rotation with non-host crops like wheat or maize for 2 cycles."
        ],
        "weather_safety_rule": "Do not apply spray if rainfall is forecasted within 4 hours. High humidity (>80%) accelerates bacterial multiplication."
    },
    "Curl Virus": {
        "scientific_name": "Cotton Leaf Curl Virus (CLCuV)",
        "severity": "High to Severe",
        "description": "Cotton Leaf Curl Virus leads to upward or downward leaf curling, vein thickening, and enations (leaf-like outgrowths) under leaves.",
        "emergency_action": "Eradicate vector whiteflies immediately. Uproot and destroy stunted or severely infected virus reservoir plants.",
        "chemical_control": {
            "active_ingredient": "Asetamiprid 20% SP or Diafenthiuron 50% WP (Vector Control)",
            "product_name": "Ekka 20% SP / Polo 50% WP",
            "dosage_per_acre": "100 g Acetamiprid OR 250 g Diafenthiuron",
            "water_per_acre_litres": 200,
            "application_interval_days": 12,
            "pre_harvest_interval_days": 20
        },
        "biological_organic": {
            "remedy": "Install yellow sticky traps (15-20 traps/acre) and spray Verticillium lecanii (5 g/L).",
            "description": "Yellow sticky traps attract and trap adult whitefly vectors, breaking the viral transmission cycle."
        },
        "cultural_preventative": [
            "Destroy weed hosts such as Abutilon indicum and Parthenium near field borders.",
            "Plant vector barrier crops like sorghum or pearl millet (3-4 border rows).",
            "Grow CLCuV-tolerant hybrid cotton cultivars recommended for your region."
        ],
        "weather_safety_rule": "Whitefly populations surge during hot, dry spells. Monitor vector counts daily during dry weather."
    },
    "Healthy Leaf": {
        "scientific_name": "N/A (Healthy Crop)",
        "severity": "None",
        "description": "Your cotton leaves show healthy green pigmentation, normal venation, and zero visual disease symptoms.",
        "emergency_action": "No emergency action required. Maintain standard irrigation and crop monitoring.",
        "chemical_control": {
            "active_ingredient": "N/A (No chemical treatment required)",
            "product_name": "N/A",
            "dosage_per_acre": "0",
            "water_per_acre_litres": 0,
            "application_interval_days": 0,
            "pre_harvest_interval_days": 0
        },
        "biological_organic": {
            "remedy": "Apply liquid bio-fertilizers (Azotobacter & PSB @ 500 mL/acre) to sustain soil microbial health.",
            "description": "Promotes root architecture and natural plant immunity."
        },
        "cultural_preventative": [
            "Maintain balanced NPK fertilizer ratio (120:60:60 kg/ha for irrigated cotton).",
            "Monitor fields weekly using AgriLens to catch early disease onset before spread.",
            "Ensure adequate field drainage during monsoon periods."
        ],
        "weather_safety_rule": "Keep field channels clear to avoid waterlogging after heavy rainfall."
    },
    "Herbicide Growth Damage": {
        "scientific_name": "Phytotoxicity / Chemical Drift Injury",
        "severity": "Moderate to High",
        "description": "Occurs due to accidental drift of non-selective herbicides (like 2,4-D or Glyphosate) causing leaf distortion, cupping, or bleaching.",
        "emergency_action": "Flush soil immediately with copious irrigation to leach residual chemical and apply bio-stimulant foliar spray.",
        "chemical_control": {
            "active_ingredient": "Foliar Bio-stimulant + Micronutrient Mixture (Zinc & Iron)",
            "product_name": "Isabion / Humic Acid 12% + Chelated Zinc",
            "dosage_per_acre": "400 mL Humic Acid + 200 g Chelated Zinc",
            "water_per_acre_litres": 200,
            "application_interval_days": 7,
            "pre_harvest_interval_days": 0
        },
        "biological_organic": {
            "remedy": "Spray Panchagavya 3% or Seaweed Extract (2 mL/L) to relieve chemical stress.",
            "description": "Rich in natural auxins and amino acids that stimulate fresh vegetative shoot recovery."
        },
        "cultural_preventative": [
            "Use hooded sprayers when applying herbicides near cotton fields.",
            "Never use herbicide spray pumps for insecticide/fungicide applications without thorough decontamination.",
            "Avoid spraying non-selective weedicides on windy days (>10 km/h wind speed)."
        ],
        "weather_safety_rule": "High ambient temperatures accelerate herbicide volatilization. Never spray during peak afternoon heat."
    },
    "Leaf Hopper Jassids": {
        "scientific_name": "Amrasca biguttula biguttula",
        "severity": "Moderate to High",
        "description": "Jassids suck sap from leaf undersides, causing yellowing of leaf margins (hopperburn), downward curling, and leaf browning.",
        "emergency_action": "Inspect lower leaf surfaces. If population exceeds 2-3 nymphs/leaf, initiate systemic insecticide treatment.",
        "chemical_control": {
            "active_ingredient": "Flonicamid 50% WG or Thiamethoxam 25% WG",
            "product_name": "Ulala 50% WG / Cruz 25% WG",
            "dosage_per_acre": "60 g Flonicamid OR 40 g Thiamethoxam",
            "water_per_acre_litres": 200,
            "application_interval_days": 14,
            "pre_harvest_interval_days": 21
        },
        "biological_organic": {
            "remedy": "Foliar spray of 5% Neem Oil + 1 mL liquid soap/L or Beauveria bassiana (5 g/L).",
            "description": "Neem oil acts as an antifeedant and insect growth regulator against jassid nymphs."
        },
        "cultural_preventative": [
            "Conserve natural predators such as ladybird beetles and green lacewings.",
            "Avoid excessive nitrogenous fertilizer application which renders leaves soft and succulent to pests.",
            "Intercrop with cowpea or soybean to encourage beneficial predatory insects."
        ],
        "weather_safety_rule": "Intermittent rain followed by cloudy warm weather promotes rapid jassid nymph hatching."
    },
    "Leaf Redding": {
        "scientific_name": "Physiological Red Leaf / Magnesium Deficiency",
        "severity": "Low to Moderate",
        "description": "Leaves turn reddened/purple between veins while veins remain green. Caused by Magnesium deficiency, low night temperatures, or root stress during boll formation.",
        "emergency_action": "Apply immediate foliar spray of Magnesium Sulphate (MgSO4) combined with Urea to restore chlorophyll synthesis.",
        "chemical_control": {
            "active_ingredient": "Magnesium Sulphate (MgSO4 9.5%) + Soluble NPK (19:19:19)",
            "product_name": "MgSO4 Ag-grade + 19:19:19 Water Soluble",
            "dosage_per_acre": "1.0 kg MgSO4 + 1.0 kg 19:19:19",
            "water_per_acre_litres": 200,
            "application_interval_days": 10,
            "pre_harvest_interval_days": 0
        },
        "biological_organic": {
            "remedy": "Apply well-decomposed Farmyard Manure (FYM @ 2 tonnes/acre) enriched with bio-fertilizers.",
            "description": "Improves cation exchange capacity and long-term magnesium bioavailability in soil."
        },
        "cultural_preventative": [
            "Ensure adequate soil moisture during peak boll development phase.",
            "Perform soil testing before sowing to correct base soil pH and secondary nutrient reserves.",
            "Avoid sudden irrigation delays after a prolonged dry spell."
        ],
        "weather_safety_rule": "Cold night temperatures (<15°C) impair magnesium translocation. Apply foliar sprays during sunny mornings."
    },
    "Leaf Variegation": {
        "scientific_name": "Chimerical / Genetic Variegation / Viral Mosaicking",
        "severity": "Low",
        "description": "Causes distinct yellow/white patches or irregular mosaic patterns on leaves due to genetic chimera or mild viral infection.",
        "emergency_action": "Monitor affected plants. If only isolated leaves display variegation, no immediate emergency treatment is needed.",
        "chemical_control": {
            "active_ingredient": "Micronutrient Spray Mixture (Zinc, Manganese, Boron)",
            "product_name": "Multi-Micronutrient Foliar Fertilizer",
            "dosage_per_acre": "500 g Micronutrient Mixture",
            "water_per_acre_litres": 200,
            "application_interval_days": 15,
            "pre_harvest_interval_days": 0
        },
        "biological_organic": {
            "remedy": "Spray Bio-Nutrient Extract (Vermicompost Wash @ 50 mL/L water).",
            "description": "Provides natural trace minerals and growth hormones to support tissue development."
        },
        "cultural_preventative": [
            "Do not select seeds from variegated plants for future multiplication.",
            "Keep fields free of sap-sucking pests to prevent secondary viral spread.",
            "Provide balanced irrigation and micro-nutrient nutrition."
        ],
        "weather_safety_rule": "Variegation symptoms are most prominent in bright sunlight. Ensure adequate crop canopy shade."
    }
}


def generate_personalized_advisory(
    disease_name: str,
    land_acres: float = 1.0,
    farming_preference: str = "all"
) -> Dict[str, Any]:
    """
    Generates a personalized agronomic advisory report with acreage-calculated dosages.

    Args:
        disease_name: Predicted disease class name.
        land_acres: Total land area in acres (default: 1.0).
        farming_preference: 'chemical', 'organic', or 'all'.

    Returns:
        Dict containing structured personalized advisory.
    """
    acres = max(0.1, float(land_acres))
    kb = DISEASE_KNOWLEDGE_BASE.get(disease_name, DISEASE_KNOWLEDGE_BASE["Healthy Leaf"])

    chem = kb["chemical_control"]
    bio = kb["biological_organic"]

    # Acreage Dosage Calculations
    water_total_litres = int(chem["water_per_acre_litres"] * acres)

    # Parse numerical dosage for total field calculation
    dosage_str = chem["dosage_per_acre"]
    if disease_name == "Healthy Leaf":
        calculated_dosage_summary = "No chemical spray required. Crop canopy is healthy and disease-free."
    else:
        calculated_dosage_summary = f"{dosage_str} per acre (Total for {acres:.1f} acres: {water_total_litres} L water)"

    advisory = {
        "disease_name": disease_name,
        "scientific_name": kb["scientific_name"],
        "severity": kb["severity"],
        "description": kb["description"],
        "land_acres": acres,
        "emergency_action": kb["emergency_action"],
        "calculated_dosage": {
            "active_ingredient": chem["active_ingredient"],
            "product_name": chem["product_name"],
            "dosage_per_acre": chem["dosage_per_acre"],
            "water_per_acre_litres": chem["water_per_acre_litres"],
            "total_water_litres": water_total_litres,
            "dosage_summary": calculated_dosage_summary,
            "application_interval_days": chem["application_interval_days"],
            "pre_harvest_interval_days": chem["pre_harvest_interval_days"]
        },
        "biological_organic": {
            "remedy": bio["remedy"],
            "description": bio["description"]
        },
        "cultural_preventative": kb["cultural_preventative"],
        "weather_safety_rule": kb["weather_safety_rule"]
    }

    return advisory
