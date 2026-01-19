#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Generate Lovelace Mushroom cards from Home Assistant input_select helpers.

Input: YAML with keys like:
stock_carne_alitas_de_pollo:
  name: "Alitas de pollo"
  options:
    - "No hay"
    - "Hay"
    - "Congelado"
  initial: "No hay"
  icon: mdi:food-drumstick

Output: YAML stack-in-card with mushroom-template-card entries that:
- show state (secondary)
- color icon by state
- tap cycles through options by calling a Home Assistant script:
    script.stock_cycle_input_select

Rationale:
- Lovelace does not reliably evaluate Jinja templates in service data for tap actions.
- The cycling logic is implemented in Home Assistant (scripts.yaml) where templates are supported.
"""

from __future__ import annotations

import argparse
from pathlib import Path
from typing import Any, Dict, List

import yaml


def _yaml_load(path: Path) -> Dict[str, Any]:
    data = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"Expected a YAML mapping at top-level in {path}")
    return data


def _icon_color_template(entity_id: str) -> str:
    """
    Default 3-state coloring:
      Hay -> green
      Congelado -> blue
      else -> red
    """
    return (
        "{% set s = states('" + entity_id + "') %}\n"
        "{{ 'green' if s == 'Hay' else 'blue' if s == 'Congelado' else 'red' }}"
    )


def _secondary_template(entity_id: str) -> str:
    return (
        "{% set s = states('" + entity_id + "') %}\n"
        "{{ s if s not in ['unknown','unavailable',''] else 'Sin estado' }}"
    )


def generate_cards(
    helpers: Dict[str, Any],
    title: str,
    domain: str = "input_select",
    sort_keys: bool = True,
    cycle_script_service: str = "script.stock_cycle_input_select",
) -> Dict[str, Any]:
    keys = list(helpers.keys())
    if sort_keys:
        keys.sort()

    cards: List[Dict[str, Any]] = [
        {"type": "custom:mushroom-title-card", "title": title}
    ]

    for key in keys:
        conf = helpers.get(key, {})
        if not isinstance(conf, dict):
            continue

        entity_id = f"{domain}.{key}"
        primary = conf.get("name", key)
        icon = conf.get("icon", "mdi:checkbox-blank-outline")

        card: Dict[str, Any] = {
            "type": "custom:mushroom-template-card",
            "entity": entity_id,
            "primary": primary,
            "secondary": _secondary_template(entity_id),
            "icon": icon,
            "icon_color": _icon_color_template(entity_id),
            "tap_action": {
                "action": "call-service",
                "service": cycle_script_service,
                "data": {
                    "entity_id": entity_id,
                },
            },
            "hold_action": {"action": "more-info"},
        }

        cards.append(card)

    return {
        "type": "custom:stack-in-card",
        "mode": "vertical",
        "cards": cards,
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate Lovelace Mushroom cards from input_select helpers YAML."
    )
    parser.add_argument("--input", "-i", required=True, help="Path to helpers YAML file.")
    parser.add_argument("--title", "-t", required=True, help="Title card (e.g., Carne).")
    parser.add_argument("--output", "-o", required=True, help="Path to write the generated Lovelace YAML.")
    parser.add_argument("--no-sort", action="store_true", help="Preserve input order instead of sorting keys.")
    parser.add_argument(
        "--cycle-service",
        default="script.stock_cycle_input_select",
        help="Service to call on tap to cycle the input_select (default: script.stock_cycle_input_select).",
    )

    args = parser.parse_args()
    in_path = Path(args.input)
    out_path = Path(args.output)

    helpers = _yaml_load(in_path)

    lovelace = generate_cards(
        helpers=helpers,
        title=args.title,
        domain="input_select",
        sort_keys=not args.no_sort,
        cycle_script_service=args.cycle_service,
    )

    yaml_text = yaml.safe_dump(
        lovelace,
        allow_unicode=True,
        sort_keys=False,
        width=120,
        default_flow_style=False,
    )

    out_path.write_text(yaml_text, encoding="utf-8")
    print(f"Generated Lovelace YAML: {out_path}")


if __name__ == "__main__":
    main()