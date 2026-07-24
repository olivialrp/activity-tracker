# Real-Time Event Tracker — Modular Monolith Architecture

## 1. Architectural Style: Modular Monolith
This application runs as a single deployed server, but internal logic is strictly separated into autonomous domain modules.

### Core Modules:
1. `src/modules/ingestion/`: Receives HTTP REST payloads, validates schemas, and publishes events to Kafka. **No database access.**
2. `src/modules/processing/`: Consumes messages from Kafka, enriches the data, and writes to PostgreSQL via Drizzle ORM.
3. `src/modules/analytics/`: Serves aggregated read-only metrics to external dashboards. **Read-only database access.**

## 2. Strict Boundary Rules
- Modules must NEVER import internal files directly from another module.
- Cross-module communication must happen strictly through Kafka events or shared contracts defined in `src/common/`.

## 3. Cloud & DevOps Infrastructure
- **Local Cloud Emulation:** LocalStack (simulates AWS S3/SQS locally via Docker).
- **Production Hosting:** Render PaaS (zero credit card required).
- **CI/CD:** GitHub Actions (automated TypeScript compilation, Vitest tests, and Drizzle migrations).