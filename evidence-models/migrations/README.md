# Evidence Model Migrations

Schema version migration scripts for evidence model JSON schemas.

## Conventions

- Migration scripts are named `v<N>-to-v<N+1>.ts` (e.g., `v1-to-v2.ts`)
- Each script transforms existing records in `memory/` to conform to the new schema version
- Run migrations via `bun evidence-models/migrations/v<N>-to-v<N+1>.ts`
- After migration, increment the `$version` field in affected schema files

## Current Schema Versions

Most evidence model schemas are at **v1**. A few have received additive-only minor bumps
(e.g. `risk-assessment-record.json` v1.1.0, `emergency-*-record.json` v1.1.0, `psm-loto-record.json`
v1.1.0) for new optional fields — per the "When to Create a Migration" rule below, these did
not require a migration script. No breaking (rename/type-change/new-required/removed-field/
`$ref`-target-change) migrations have been required yet.

## When to Create a Migration

1. A field is **renamed** across evidence model schemas
2. A field's **type changes** (e.g., `string` → `enum`)
3. A field is **added to `required`** array
4. A field is **removed** from the schema
5. A **`$ref` target path changes**

Simple additions (new optional fields) do NOT require a migration — existing records remain valid.
