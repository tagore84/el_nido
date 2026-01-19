#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
from pathlib import Path
from typing import Any, Dict

import yaml


def load_catalog(path: Path) -> Dict[str, Any]:
    data = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError("El YAML de entrada debe ser un mapping/dict en la raíz.")

    # Valida estructura básica
    for k, v in data.items():
        if not isinstance(k, str):
            raise ValueError(f"Clave no válida (no string): {k!r}")
        if not isinstance(v, dict):
            raise ValueError(f"Valor no válido para {k} (debe ser dict): {v!r}")
        if "name" not in v or "icon" not in v:
            raise ValueError(f"Faltan campos en {k}. Requiere: name, icon.")
        if not isinstance(v["name"], str) or not isinstance(v["icon"], str):
            raise ValueError(f"Campos inválidos en {k}. name e icon deben ser string.")
    return data


def infer_title_from_keys(keys) -> str:
    """
    Intenta inferir título desde 'stock_<categoria>_...'
    -> devuelve la categoria capitalizada (con algunos casos comunes).
    """
    # Busca el primer key con patrón stock_xxx_
    for k in keys:
        if k.startswith("stock_") and k.count("_") >= 2:
            cat = k.split("_", 2)[1]  # stock | categoria | resto
            # Mapeo opcional "bonito"
            mapping = {
                "lacteos": "Lácteos",
                "carne": "Carne",
                "verduras": "Verduras",
                "despensa": "Despensa",
                "charcuteria": "Charcutería",
            }
            return mapping.get(cat, cat.replace("-", " ").replace("_", " ").capitalize())
    return "Stock"


def build_card_yaml(catalog: Dict[str, Any], title: str) -> Dict[str, Any]:
    cards = [{"type": "custom:mushroom-title-card", "title": title}]

    # Orden estable: tal como aparece en el YAML (PyYAML respeta orden en Python 3.7+)
    for stock_id, meta in catalog.items():
        entity_id = f"input_boolean.{stock_id}"
        name = meta["name"]
        icon = meta["icon"]

        cards.append(
            {
                "type": "custom:mushroom-template-card",
                "entity": entity_id,
                "primary": name,
                "secondary": (
                    "{{ 'Hay' if is_state('"
                    + entity_id
                    + "','on') else 'Falta' }}"
                ),
                "icon": icon,
                "icon_color": (
                    "{{ 'green' if is_state('"
                    + entity_id
                    + "','on') else 'red' }}"
                ),
                "tap_action": {"action": "toggle"},
                "hold_action": {"action": "more-info"},
            }
        )

    return {
        "type": "custom:stack-in-card",
        "mode": "vertical",
        "cards": cards,
    }


def dump_lovelace_yaml(obj: Dict[str, Any]) -> str:
    # default_flow_style=False => YAML legible; sort_keys=False => mantiene orden
    return yaml.safe_dump(obj, allow_unicode=True, sort_keys=False, default_flow_style=False)


def main():
    parser = argparse.ArgumentParser(
        description="Genera YAML Lovelace (stack-in-card + mushroom-template-card) desde un catálogo YAML."
    )
    parser.add_argument("input", type=Path, help="Ruta al YAML de entrada (catálogo stock_*)")
    parser.add_argument(
        "--title",
        type=str,
        default=None,
        help="Título de la tarjeta (si no se indica, se infiere desde las claves stock_<categoria>_...)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=None,
        help="Ruta del archivo de salida. Si no se indica, imprime por stdout.",
    )

    args = parser.parse_args()

    catalog = load_catalog(args.input)
    title = args.title or infer_title_from_keys(catalog.keys())
    card = build_card_yaml(catalog, title)
    out = dump_lovelace_yaml(card)

    if args.output:
        args.output.write_text(out, encoding="utf-8")
    else:
        print(out)


if __name__ == "__main__":
    main()