# Prompts Registry

This directory contains all the AI prompts used in El Nido.

## Structure

- `registry.json`: The central mapping of logical prompt names to specific file versions.
- `router/`: Prompts related to routing and classification.
- `whiteboard/`: Prompts related to whiteboard analysis and data extraction.
- `shared/`: Shared rules, contexts, or style guides.

## Guidelines

- **Always version prompts**: `name_v1.txt`, `name_v2.txt`.
- **Update registry**: When creating a new version, update `registry.json` to point to it.
- **Do not edit active prompts**: Create a new version instead.
