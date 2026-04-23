#!/usr/bin/env python3
"""Build normalized technology page data from the source Excel workbooks."""

from __future__ import annotations

import argparse
import json
import re
from collections import defaultdict
from dataclasses import dataclass
from datetime import date, datetime
from pathlib import Path
from statistics import mean
from typing import Any

from openpyxl import load_workbook


@dataclass(frozen=True)
class TechnologySpec:
    key: str
    slug: str
    name: str
    short_name: str
    color: str
    aliases: tuple[str, ...]


TECH_SPECS: tuple[TechnologySpec, ...] = (
    TechnologySpec(
        key="descriptive-ai",
        slug="descriptive-ai",
        name="Descriptive AI",
        short_name="Descriptive AI",
        color="#f59e0b",
        aliases=("descriptive ai",),
    ),
    TechnologySpec(
        key="agentic-generative-ai",
        slug="agentic-gen-ai",
        name="Agentic & Generative AI",
        short_name="Agentic & Generative AI",
        color="#f97316",
        aliases=("agentic gen ai", "agenticgenai", "generative ai", "agentic ai"),
    ),
    TechnologySpec(
        key="blockchain-decentralized-systems",
        slug="blockchain-decentralized-systems",
        name="Blockchain & Decentralized Systems",
        short_name="Blockchain & Decentralized Systems",
        color="#fbbf24",
        aliases=("blockchain", "blockchain decentralized systems"),
    ),
    TechnologySpec(
        key="robotics-automation",
        slug="robotics-automation",
        name="Robotics & Automation",
        short_name="Robotics & Automation",
        color="#fb923c",
        aliases=("robotics", "robotics automation"),
    ),
    TechnologySpec(
        key="quantum-computing",
        slug="quantum-computing",
        name="Quantum Computing",
        short_name="Quantum Computing",
        color="#fde68a",
        aliases=("quantum", "quantum computing"),
    ),
)

TECH_BY_KEY = {item.key: item for item in TECH_SPECS}

INDUSTRY_LOOKUP = {
    "energy": ("energy", "Energy"),
    "materials": ("materials", "Materials"),
    "industrials": ("industrials", "Industrials"),
    "consumergoods": ("consumer-goods", "Consumer Goods"),
    "healthcare": ("health-care", "Health Care"),
    "financialsservices": ("financial-services", "Financial Services"),
    "financialservices": ("financial-services", "Financial Services"),
    "informationtechnology": ("information-technology", "Information Technology"),
    "communicationservicescreative": (
        "communication-creative-services",
        "Communication & Creative Services",
    ),
    "realestate": ("real-estate", "Real Estate"),
    "automotivetransport": ("automotive-transport", "Automotive & Transport"),
    "it": ("information-technology", "Information Technology"),
    "financials": ("financial-services", "Financial Services"),
    "financial": ("financial-services", "Financial Services"),
    "automotive": ("automotive-transport", "Automotive & Transport"),
}

RESEARCH_POINT_YEARS = (2020, 2021, 2022, 2023, 2024, 2025)


def normalize_text(value: str | None) -> str:
    if not value:
        return ""
    return re.sub(r"[^a-z0-9]+", "", value.lower())


def parse_number(value: Any) -> float:
    if value is None:
        return 0.0
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        trimmed = value.strip()
        if not trimmed:
            return 0.0
        try:
            return float(trimmed.replace(",", ""))
        except ValueError:
            return 0.0
    return 0.0


def parse_year(value: Any) -> int | None:
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.year
    if isinstance(value, date):
        return value.year
    if isinstance(value, (int, float)):
        year = int(value)
        return year if 1900 <= year <= 2100 else None
    return None


def get_tech_key(raw_value: Any) -> str | None:
    if not isinstance(raw_value, str):
        return None
    candidate = normalize_text(raw_value)
    if not candidate:
        return None

    for spec in TECH_SPECS:
        alias_candidates = (spec.name, spec.short_name, *spec.aliases)
        for alias in alias_candidates:
            alias_norm = normalize_text(alias)
            if alias_norm and (alias_norm in candidate or candidate in alias_norm):
                return spec.key

    return None


def tech_keys_in_text(raw_value: Any) -> list[str]:
    if not isinstance(raw_value, str):
        return []
    candidate = normalize_text(raw_value)
    if not candidate:
        return []

    keys: list[str] = []
    for spec in TECH_SPECS:
        alias_candidates = (spec.name, spec.short_name, *spec.aliases)
        if any(normalize_text(alias) in candidate for alias in alias_candidates if alias):
            keys.append(spec.key)
    return keys


def get_industry(raw_value: Any) -> tuple[str, str] | None:
    if not isinstance(raw_value, str):
        return None
    normalized = normalize_text(raw_value)
    if not normalized:
        return None
    return INDUSTRY_LOOKUP.get(normalized)


def to_title_from_quote(quote: str) -> str:
    cleaned = quote.strip().strip('"').strip()
    if not cleaned:
        return "Use Case Signal"
    first_sentence = cleaned.split(".")[0].strip()
    if len(first_sentence) > 66:
        first_sentence = f"{first_sentence[:63].rstrip()}..."
    return first_sentence


def pct_change(previous: float, current: float) -> float:
    if previous <= 0:
        return 0.0
    return ((current - previous) / previous) * 100


def build_data(heatmatrix_path: Path, content_path: Path) -> dict[str, Any]:
    wb_heat = load_workbook(heatmatrix_path, data_only=True)
    wb_content = load_workbook(content_path, data_only=True)

    definitions: dict[str, str] = {}
    ws_definitions = wb_content["Definitions"]
    current_tech: str | None = None
    for row in range(1, ws_definitions.max_row + 1):
        cell_value = ws_definitions.cell(row, 1).value
        if not isinstance(cell_value, str):
            continue
        text = cell_value.strip()
        if normalize_text(text).startswith("2industries"):
            break
        if text.lower().startswith("definition:") and current_tech:
            definitions[current_tech] = text.replace("Definition:", "", 1).strip()
            continue
        maybe_tech = get_tech_key(text)
        if maybe_tech:
            current_tech = maybe_tech
            continue

    heat_scores: dict[str, list[dict[str, Any]]] = defaultdict(list)
    ws_heatmatrix = wb_heat["Heatmatrix"]
    heat_tech_keys = {
        column: get_tech_key(ws_heatmatrix.cell(2, column).value)
        for column in range(2, 7)
    }
    for row in range(3, 13):
        industry = get_industry(ws_heatmatrix.cell(row, 1).value)
        if not industry:
            continue
        industry_slug, industry_name = industry
        for column in range(2, 7):
            tech_key = heat_tech_keys.get(column)
            if not tech_key:
                continue
            score = parse_number(ws_heatmatrix.cell(row, column).value)
            heat_scores[tech_key].append(
                {
                    "industrySlug": industry_slug,
                    "industryName": industry_name,
                    "score": round(score, 2),
                }
            )

    radar_by_tech: dict[str, list[dict[str, Any]]] = defaultdict(list)
    ws_radar = wb_heat["Graph radar"]
    for row in range(4, ws_radar.max_row + 1):
        tech_key = get_tech_key(ws_radar.cell(row, 2).value)
        industry = get_industry(ws_radar.cell(row, 1).value)
        if not tech_key or not industry:
            continue
        industry_slug, industry_name = industry
        radar_by_tech[tech_key].append(
            {
                "industrySlug": industry_slug,
                "industryName": industry_name,
                "innovationIntensity": round(parse_number(ws_radar.cell(row, 3).value), 2),
                "innovationMomentum": round(parse_number(ws_radar.cell(row, 4).value), 2),
                "startupActivity": round(parse_number(ws_radar.cell(row, 5).value), 2),
                "marketValidation": round(parse_number(ws_radar.cell(row, 6).value), 2),
                "professionalsPerception": round(parse_number(ws_radar.cell(row, 7).value), 2),
            }
        )

    survey_by_tech: dict[str, dict[str, Any]] = {}
    ws_survey = wb_heat["Survey"]
    for spec in TECH_SPECS:
        survey_by_tech[spec.key] = {
            "impactScores": [],
            "timelineScores": [],
            "impactCounts": [0.0, 0.0, 0.0, 0.0, 0.0],
        }

    for row in range(2, 52):
        tech_key = get_tech_key(ws_survey.cell(row, 2).value)
        if not tech_key:
            continue
        item = survey_by_tech[tech_key]
        impact_score = ws_survey.cell(row, 12).value
        timeline_score = ws_survey.cell(row, 13).value
        if isinstance(impact_score, (int, float)):
            item["impactScores"].append(float(impact_score))
        if isinstance(timeline_score, (int, float)):
            item["timelineScores"].append(float(timeline_score))
        for offset in range(5):
            item["impactCounts"][offset] += parse_number(ws_survey.cell(row, 3 + offset).value)

    impact_ranking = []
    for spec in TECH_SPECS:
        counts = survey_by_tech[spec.key]["impactCounts"]
        total = sum(counts)
        if total <= 0:
            continue
        weighted_score = sum((index + 1) * counts[index] for index in range(5)) / total
        impact_ranking.append(
            {
                "technologyKey": spec.key,
                "technologySlug": spec.slug,
                "label": spec.name,
                "score": round(weighted_score, 2),
            }
        )
    impact_ranking.sort(key=lambda item: item["score"], reverse=True)

    full_table_aggregates: dict[str, dict[str, float]] = {}
    ws_full = wb_heat["FULL TABLE and WEIGHTS"]
    for spec in TECH_SPECS:
        full_table_aggregates[spec.key] = {
            "unicornFundingUsd": 0.0,
            "unicornCount": 0.0,
            "nativeUnicornCount": 0.0,
            "emergingUnicornCount": 0.0,
            "startupCount2025": 0.0,
            "patents2024": 0.0,
            "patents2025": 0.0,
            "scholar2024": 0.0,
            "scholar2025": 0.0,
        }

    for row in range(2, 52):
        tech_key = get_tech_key(ws_full.cell(row, 2).value)
        if not tech_key:
            continue
        aggregate = full_table_aggregates[tech_key]
        aggregate["unicornFundingUsd"] += parse_number(ws_full.cell(row, 3).value)
        aggregate["unicornCount"] += parse_number(ws_full.cell(row, 5).value)
        aggregate["nativeUnicornCount"] += parse_number(ws_full.cell(row, 7).value)
        aggregate["emergingUnicornCount"] += parse_number(ws_full.cell(row, 9).value)
        aggregate["startupCount2025"] += parse_number(ws_full.cell(row, 11).value)
        aggregate["patents2025"] += parse_number(ws_full.cell(row, 13).value)
        aggregate["scholar2025"] += parse_number(ws_full.cell(row, 15).value)
        aggregate["patents2024"] += parse_number(ws_full.cell(row, 17).value)
        aggregate["scholar2024"] += parse_number(ws_full.cell(row, 18).value)

    use_cases_by_tech: dict[str, list[dict[str, str]]] = defaultdict(list)
    ws_survey_verbatim = wb_content["Survey Verbatim"]
    for row in range(2, ws_survey_verbatim.max_row + 1):
        quote = ws_survey_verbatim.cell(row, 4).value
        if not isinstance(quote, str) or not quote.strip():
            continue
        mapped_techs = tech_keys_in_text(ws_survey_verbatim.cell(row, 2).value)
        if not mapped_techs:
            continue
        industry_label = ws_survey_verbatim.cell(row, 1).value if isinstance(ws_survey_verbatim.cell(row, 1).value, str) else "Cross-industry"
        industry = get_industry(industry_label)
        industry_name = industry[1] if industry else industry_label.strip()
        experience = ws_survey_verbatim.cell(row, 3).value
        experience_label = experience.strip() if isinstance(experience, str) and experience.strip() else "n/a"
        card = {
            "title": to_title_from_quote(quote),
            "description": quote.strip().strip('"'),
            "signal": f"{industry_name} \u00b7 {experience_label}",
        }
        for tech_key in mapped_techs:
            use_cases_by_tech[tech_key].append(card)

    chair_comments: dict[str, dict[str, str]] = {}
    quote_use_cases_by_tech: dict[str, list[dict[str, str]]] = defaultdict(list)
    ws_quotes = wb_content["Quotes"]
    for row in range(2, ws_quotes.max_row + 1):
        mapped_techs = tech_keys_in_text(ws_quotes.cell(row, 3).value)
        if not mapped_techs:
            continue
        quote = ws_quotes.cell(row, 4).value
        if not isinstance(quote, str) or not quote.strip():
            continue
        translation = ws_quotes.cell(row, 5).value
        speaker = ws_quotes.cell(row, 1).value if isinstance(ws_quotes.cell(row, 1).value, str) else "Expert panel"
        industry_value = ws_quotes.cell(row, 2).value
        industry_text = industry_value.strip() if isinstance(industry_value, str) and industry_value.strip() else "Cross-industry"
        normalized_quote = translation.strip() if isinstance(translation, str) and translation.strip() else quote.strip()
        use_case_card = {
            "title": to_title_from_quote(normalized_quote),
            "description": normalized_quote,
            "signal": f"{industry_text} · {speaker}",
        }
        for tech_key in mapped_techs:
            if tech_key in chair_comments:
                quote_use_cases_by_tech[tech_key].append(use_case_card)
            else:
                chair_comments[tech_key] = {
                    "speaker": speaker,
                    "quote": normalized_quote,
                }

    scatter_points: dict[str, dict[tuple[str, str], dict[str, Any]]] = defaultdict(dict)

    def ingest_scatter(ws_name: str, tech_col: int, org_col: int, year_col: int, funding_col: int, category: str) -> None:
        ws = wb_content[ws_name]
        for row in range(2, ws.max_row + 1):
            tech_key = get_tech_key(ws.cell(row, tech_col).value)
            if not tech_key:
                continue
            organization = ws.cell(row, org_col).value
            if not isinstance(organization, str) or not organization.strip():
                continue
            founded_year = parse_year(ws.cell(row, year_col).value)
            funding_usd = parse_number(ws.cell(row, funding_col).value)
            if not founded_year or funding_usd <= 0:
                continue
            key = (organization.strip(), category)
            existing = scatter_points[tech_key].get(key)
            if existing and existing["fundingUsd"] >= funding_usd:
                continue
            scatter_points[tech_key][key] = {
                "name": organization.strip(),
                "foundedYear": founded_year,
                "fundingUsd": round(funding_usd, 2),
                "category": category,
            }

    ingest_scatter("Native Unicorns", tech_col=2, org_col=3, year_col=10, funding_col=12, category="Native")
    ingest_scatter("Unicorns - TECH", tech_col=1, org_col=2, year_col=8, funding_col=10, category="Unicorn")
    ingest_scatter(
        "Emerging Unicorns - TECH",
        tech_col=1,
        org_col=2,
        year_col=9,
        funding_col=11,
        category="Emerging",
    )

    patents_by_tech: dict[str, dict[int, float]] = defaultdict(dict)
    scholar_by_tech: dict[str, dict[int, float]] = defaultdict(dict)

    ws_patents_graph = wb_content["Patents evol Tech GRAPH"]
    tech_columns_patents = {
        column: get_tech_key(ws_patents_graph.cell(2, column).value) for column in range(2, 7)
    }
    for row in range(3, ws_patents_graph.max_row + 1):
        year = parse_year(ws_patents_graph.cell(row, 1).value)
        if not year:
            continue
        for column in range(2, 7):
            tech_key = tech_columns_patents.get(column)
            if not tech_key:
                continue
            patents_by_tech[tech_key][year] = round(parse_number(ws_patents_graph.cell(row, column).value), 2)

    ws_scholar_graph = wb_content["Scholar evol TECH graph"]
    tech_columns_scholar = {
        column: get_tech_key(ws_scholar_graph.cell(2, column).value) for column in range(2, 7)
    }
    for row in range(3, ws_scholar_graph.max_row + 1):
        year = parse_year(ws_scholar_graph.cell(row, 1).value)
        if not year:
            continue
        for column in range(2, 7):
            tech_key = tech_columns_scholar.get(column)
            if not tech_key:
                continue
            scholar_by_tech[tech_key][year] = round(parse_number(ws_scholar_graph.cell(row, column).value), 2)

    patents_series = []
    scholar_series = []
    for year in RESEARCH_POINT_YEARS:
        patents_entry: dict[str, Any] = {"year": str(year)}
        scholar_entry: dict[str, Any] = {"year": str(year)}
        for spec in TECH_SPECS:
            patents_entry[spec.slug] = patents_by_tech[spec.key].get(year, 0)
            scholar_entry[spec.slug] = scholar_by_tech[spec.key].get(year, 0)
        patents_series.append(patents_entry)
        scholar_series.append(scholar_entry)

    applicants_by_tech: dict[str, list[dict[str, Any]]] = defaultdict(list)
    ws_top_applicants = wb_content["Top Applicants 2025 - TECH"]
    for row in range(2, ws_top_applicants.max_row + 1):
        tech_key = get_tech_key(ws_top_applicants.cell(row, 1).value)
        applicant_name = ws_top_applicants.cell(row, 2).value
        if not tech_key or not isinstance(applicant_name, str) or not applicant_name.strip():
            continue
        status_raw = ws_top_applicants.cell(row, 4).value
        status = "none"
        if isinstance(status_raw, str):
            normalized = normalize_text(status_raw)
            if "newchallenger" in normalized:
                status = "new_challenger"
            elif "significantclimber" in normalized:
                status = "significant_climber"
            elif "significantdrop" in normalized:
                status = "significant_drop"
        applicants_by_tech[tech_key].append(
            {
                "name": applicant_name.strip(),
                "documentCount": int(parse_number(ws_top_applicants.cell(row, 3).value)),
                "status": status,
            }
        )

    for tech_key in applicants_by_tech:
        applicants_by_tech[tech_key].sort(key=lambda item: item["documentCount"], reverse=True)

    notes_by_tech: dict[str, str] = {}
    ws_notes = wb_content["Top Applicants 2025 note - TECH"]
    for row in range(2, ws_notes.max_row + 1):
        tech_key = get_tech_key(ws_notes.cell(row, 1).value)
        note = ws_notes.cell(row, 2).value
        if tech_key and isinstance(note, str) and note.strip():
            notes_by_tech[tech_key] = note.strip().replace("Note:", "").strip()

    technology_pages: list[dict[str, Any]] = []
    for spec in TECH_SPECS:
        industry_heat = heat_scores.get(spec.key, [])
        industry_radar_lookup = {entry["industrySlug"]: entry for entry in radar_by_tech.get(spec.key, [])}
        merged_industry_cards = []
        for heat_entry in industry_heat:
            radar_entry = industry_radar_lookup.get(heat_entry["industrySlug"])
            if not radar_entry:
                continue
            merged_industry_cards.append(
                {
                    "industrySlug": heat_entry["industrySlug"],
                    "industryName": heat_entry["industryName"],
                    "heatScore": heat_entry["score"],
                    "radar": {
                        "innovationIntensity": radar_entry["innovationIntensity"],
                        "innovationMomentum": radar_entry["innovationMomentum"],
                        "startupActivity": radar_entry["startupActivity"],
                        "marketValidation": radar_entry["marketValidation"],
                        "professionalsPerception": radar_entry["professionalsPerception"],
                    },
                }
            )

        avg_heat = round(mean(item["score"] for item in industry_heat), 1) if industry_heat else 0.0
        top_sector = max(industry_heat, key=lambda item: item["score"])["industryName"] if industry_heat else "n/a"
        cells_above_60 = len([item for item in industry_heat if item["score"] >= 60])

        impact_counts = survey_by_tech[spec.key]["impactCounts"]
        total_impact = sum(impact_counts)
        labels = [
            "No impact",
            "Minor impact",
            "Moderate impact",
            "Significant impact",
            "Very significant impact",
        ]
        impact_distribution = []
        for index, label in enumerate(labels):
            count = int(impact_counts[index])
            pct = round((count / total_impact) * 100, 1) if total_impact else 0.0
            impact_distribution.append({"label": label, "count": count, "percentage": pct})

        market = full_table_aggregates[spec.key]
        patents_delta = pct_change(market["patents2024"], market["patents2025"])
        scholar_delta = pct_change(market["scholar2024"], market["scholar2025"])

        comment = chair_comments.get(
            spec.key,
            {
                "speaker": "Research synthesis",
                "quote": "Chair comment not available in the source workbook.",
            },
        )

        primary_use_cases = use_cases_by_tech.get(spec.key, [])
        supplemental_use_cases = quote_use_cases_by_tech.get(spec.key, [])
        deduped_use_cases = []
        seen_descriptions: set[str] = set()
        for item in [*primary_use_cases, *supplemental_use_cases]:
            signature = normalize_text(item["description"])
            if not signature or signature in seen_descriptions:
                continue
            seen_descriptions.add(signature)
            deduped_use_cases.append(item)

        tech_use_cases = deduped_use_cases[:6]
        if not tech_use_cases:
            tech_use_cases = [
                {
                    "title": "No survey use case available",
                    "description": "No survey verbatim entries were tagged for this technology in the source workbook.",
                    "signal": "Source workbook",
                }
            ]

        points = list(scatter_points.get(spec.key, {}).values())
        points.sort(key=lambda item: item["fundingUsd"], reverse=True)

        technology_pages.append(
            {
                "id": spec.key,
                "slug": spec.slug,
                "name": spec.name,
                "shortName": spec.short_name,
                "themeColor": spec.color,
                "definition": definitions.get(spec.key, ""),
                "summary": f"{spec.name} records an average heat score of {avg_heat}/100 across the ten sectors in the 2026 matrix.",
                "overview": {
                    "summaryMetrics": {
                        "averageHeatScore": avg_heat,
                        "topExposureSector": top_sector,
                        "cellsAbove60": cells_above_60,
                    },
                    "industryRadarProfiles": merged_industry_cards,
                    "chairComment": comment,
                },
                "professionalsPerception": {
                    "impactRanking": impact_ranking,
                    "impactDistribution": impact_distribution,
                    "topUseCases": tech_use_cases[:6],
                },
                "marketValidation": {
                    "totals": {
                        "unicornFundingUsd": round(market["unicornFundingUsd"], 2),
                        "unicornCount": int(market["unicornCount"]),
                        "nativeUnicornCount": int(market["nativeUnicornCount"]),
                        "emergingUnicornCount": int(market["emergingUnicornCount"]),
                        "startupCount2025": int(market["startupCount2025"]),
                    },
                    "scatterPoints": points,
                },
                "researchInnovation": {
                    "patentsDeltaPct": round(patents_delta, 1),
                    "scholarDeltaPct": round(scholar_delta, 1),
                    "topApplicants2025": applicants_by_tech.get(spec.key, [])[:16],
                    "topApplicantsNote": notes_by_tech.get(spec.key, ""),
                },
            }
        )

    return {
        "generatedAt": datetime.now().isoformat(),
        "source": {
            "heatmatrixWorkbook": str(heatmatrix_path),
            "contentWorkbook": str(content_path),
        },
        "technologyOrder": [
            {
                "id": spec.key,
                "slug": spec.slug,
                "name": spec.name,
                "color": spec.color,
            }
            for spec in TECH_SPECS
        ],
        "researchSeries": {
            "patents": patents_series,
            "scholarWork": scholar_series,
        },
        "technologies": technology_pages,
    }


def main() -> None:
    project_root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(description="Build technology page data JSON from source workbooks.")
    parser.add_argument(
        "--heatmatrix",
        type=Path,
        default=Path.home() / "Downloads" / "Heatmatrix 2026 Deciles-2.xlsx",
        help="Path to Heatmatrix workbook",
    )
    parser.add_argument(
        "--content",
        type=Path,
        default=Path.home() / "Downloads" / "Matrix content table-5.xlsx",
        help="Path to matrix content workbook",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=project_root / "src" / "data" / "raw" / "technologyPages.json",
        help="Output JSON path",
    )
    args = parser.parse_args()

    payload = build_data(args.heatmatrix, args.content)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("w", encoding="utf-8") as file:
        json.dump(payload, file, indent=2, ensure_ascii=False)
        file.write("\n")
    print(f"Generated {args.output}")


if __name__ == "__main__":
    main()
