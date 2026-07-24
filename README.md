# Activity Tracker -- Modular Monolith API

[![CI Pipeline](https://github.com/olivialrp/activity-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/olivialrp/activity-tracker/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-5.0+-000000?logo=fastify&logoColor=white)](https://fastify.dev/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-PostgreSQL-C5F74F?logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![Live Demo](https://img.shields.io/badge/Demo-Live_on_Render-46E3B7?logo=render&logoColor=white)](https://activity-tracker-cyen.onrender.com/docs)

A high-performance, cloud-native backend event tracking and analytics API. Built from scratch to demonstrate enterprise-grade Modular Monolith architecture, asynchronous event-driven decoupling, strict runtime schema validation, and serverless edge persistence.

---

## Architecture and System Design

Unlike traditional CRUD applications that tightly couple HTTP routing directly to database operations, this project enforces strict domain boundaries to ensure horizontal scalability and maintainability.

```text
[ Client / Browser ]
        │
        ▼ (POST /events - JSON Payload)
┌────────────────────────────────────────────────────────┐
│ INGESTION MODULE                                       │
│ ├── Fastify AJV Route Schema Validation                │
│ └── Zod Strict Runtime Payload Verification            │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼ (Emits 'activity:received')
                 === IN-MEMORY EVENT BUS ===
                            │
        ┌───────────────────┴───────────────────┐
        ▼ (Async Background)                    ▼ (Instant HTTP Response)
┌──────────────────────────────┐        ┌──────────────────────────────┐
│ PROCESSING MODULE            │        │ HTTP CLIENT RESPONSE         │
│ ├── Event Bus Listener       │        │ ├── Status: 202 Accepted     │
│ └── Drizzle ORM Write Engine │        │ └── Zero DB Latency Blocking │
└──────────────┬───────────────┘        └──────────────────────────────┘
               │
               ▼ (TCP / SSL)
┌──────────────────────────────┐
│ NEON SERVERLESS POSTGRESQL   │
│ └── AWS US East (Virginia)   │
└──────────────┬───────────────┘
               │
               ▼ (GET /analytics/summary)
┌──────────────────────────────┐
│ ANALYTICS MODULE             │
│ ├── Read-Only Aggregations   │
│ └── SQL GroupBy Metrics      │
└──────────────────────────────┘

## Core Architectural Highlights
Domain Decoupling: The codebase is separated into independent ingestion, processing, and analytics modules. Domains do not import each other's services directly, preventing dependency spaghetti and allowing seamless future migration to microservices.

Asynchronous Event-Driven Ingestion: To handle massive traffic spikes without degrading user experience, the HTTP ingestion layer validates payloads and publishes them to an in-memory Node.js EventEmitter bus. The API immediately releases the client connection with an HTTP 202 Accepted, while background workers execute database insertions asynchronously.

Multi-Layered Security and Defense: Every incoming request passes through a two-stage validation firewall. Fastify's native compiler verifies structural JSON formatting, while Zod enforces strict runtime domain rules and data types before processing.

Serverless Edge Persistence: Utilizes Drizzle ORM connected over secure WebSockets/SSL to Neon Serverless PostgreSQL, enabling zero-cold-start queries and automatic cloud scaling.

## Technology Stack
Runtime and Language: Node.js (v20+) and TypeScript. Strict type safety across the entire end-to-end data pipeline.

Web Framework: Fastify. Up to 2x faster than Express with built-in schema serialization.

Database and ORM: Neon PostgreSQL and Drizzle ORM. Serverless SQL execution with zero-overhead TypeScript schema inference.

Validation Engine: Zod and AJV. Standardized domain error handling and malformed payload rejection.

Documentation: OpenAPI 3.0 and Swagger UI. Auto-generated interactive API explorer embedded directly into the server.

Testing and CI/CD: Vitest and GitHub Actions. In-memory HTTP contract testing executed automatically on every push.

Cloud Hosting: Render. Automated Dockerless edge container deployments linked to main branch CI.

## Live Demo and API Documentation
The API is fully deployed and connected to a live production cloud database. You can test endpoints interactively directly from your browser without installing Postman.
https://activity-tracker-cyen.onrender.com/docs



### Key Endpoints
GET /health: System health check and architectural metadata confirmation. Returns 200 OK.

POST /events: Ingests a new activity event. Queues to event bus and returns instantly. Returns 202 Accepted.

GET /events: Retrieves a paginated list of the most recent raw activity events. Returns 200 OK.

GET /analytics/summary: Returns aggregated metrics grouped by eventType (total counts). Returns 200 OK.

## Local Development and Setup
Step 1: Clone the Repository
git clone [https://github.com/olivialrp/activity-tracker.git](https://github.com/olivialrp/activity-tracker.git)
cd activity-tracker
npm install

Step 2: Configure Environment Variables
Create a .env file in the root directory and add your PostgreSQL connection string:
PORT=3000
DATABASE_URL="postgresql://username:password@ep-xxxx-xxxx.us-east-1.aws.neon.tech/neondb?sslmode=require"

Step 3: Push Database Schema
Generate and apply your Drizzle ORM migrations to your Postgres database:
npx drizzle-kit push

Step 4: Start the Development Server
Boot the server using tsx for hot-reloading TypeScript execution:
npm run dev

The server will start at http://localhost:3000. Access local interactive docs at http://localhost:3000/docs.

## Testing and Quality Assurance
This project includes an integration and contract test suite powered by Vitest. Tests spin up an isolated Fastify instance in memory to verify HTTP routing rules, AJV schema enforcement, Zod rejection formatting, and asynchronous event bus triggering.

To execute the automated test suite locally:
npm test

The CI/CD pipeline automatically runs type-checking via tsc --noEmit and the Vitest suite via GitHub Actions on every commit to prevent regression in production.

