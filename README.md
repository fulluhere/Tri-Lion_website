# Tri-Lion 🦁

**An Online Judge Platform for competitive programming and problem solving.**

Tri-Lion lets users solve programming problems by writing code in supported languages. Submissions are compiled and executed against hidden test cases inside a secure Docker sandbox, and automatically evaluated to produce a real-time verdict.

`React + Vite` · `Node.js + Express` · `MongoDB Atlas` · `Docker` · `Gemini AI`

---

## Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Database Design](#database-design)
5. [Backend – REST API & Submission Flow](#backend--rest-api--submission-flow)
6. [Code Execution Engine](#code-execution-engine)
7. [AI Integration – Google Gemini](#ai-integration--google-gemini)
8. [System Architecture](#system-architecture)
9. [Getting Started](#getting-started)
10. [License](#license)

---

## Overview

An **Online Judge** is a software system that allows users to solve programming problems by writing code in supported programming languages. The submitted code is compiled, executed against predefined test cases in a secure environment, and automatically evaluated.

### Submission Flow (Overview)

| Step | Actor | Action |
|------|-------|--------|
| 1 | User | Selects a problem from the library |
| 2 | User | Writes a solution in the Monaco Editor |
| 3 | User | Submits code to the platform |
| 4 | Backend API | Validates request & stores the submission |
| 5 | Execution Engine | Docker container compiles & runs the code |
| 6 | Judge | Runs all hidden test cases |
| 7 | Judge | Compares actual vs expected output |
| 8 | System | Returns verdict; updates score if Accepted |

## Key Features

- JWT-based Authentication (Register / Login)
- Problem Library with Search, Tags, and Difficulty Filters
- Monaco Code Editor with Multi-language Support (C++, Java, Python, JavaScript)
- Docker-based Secure Code Execution & Automated Judging
- Submission History with Runtime & Memory Statistics
- User Dashboard with Progress Tracking and Streaks
- Global Leaderboard
- AI-powered Hints, WA/TLE Analysis, Code Explanation, and Personalised Problem Recommendations
- Admin Dashboard for Problem and Test Case Management

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + Vite 5 | Single Page Application (SPA) with fast builds |
| State Mgmt | Redux Toolkit | Global state: auth, user data, submissions |
| Routing | React Router v6 | Client-side routing & protected routes |
| Styling | Tailwind / Bootstrap v3 | Utility-first CSS, responsive UI |
| HTTP Client | Axios | API calls with JWT interceptors |
| Backend | Node.js 20 + Express.js | RESTful API for auth, problems, submissions |
| Authentication | JWT + bcryptjs | Stateless auth + secure password hashing |
| Database | MongoDB Atlas + Mongoose | Users, problems, test cases, submissions |
| Caching | Redis | Leaderboard cache, sessions, rate-limiting |
| Queue | BullMQ + Redis | Async code execution job processing |
| Execution | Docker | Isolated sandbox with CPU/memory/time limits |
| AI Services | Google Gemini 1.5 Flash | Hints, WA analysis, recommendations |
| Version Control | Git + GitHub | Source code management & collaboration |
| CI/CD | GitHub Actions | Automated testing, build & deploy pipelines |
| Frontend Deploy | Vercel | CDN-served React build |
| Backend Deploy | AWS EC2(With PM2) | Host backend services & Docker judge |
| Containers | Docker + Docker Compose | Consistent environments across deployments |
| Monitoring | Prometheus + Grafana | Application health & system metrics |
| Logging | Winston + Morgan | Application & API request logging |

## Database Design

The system uses **MongoDB Atlas** as the primary database, organised into four main collections.

### User Collection

| Field | Type | Description |
|-------|------|-------------|
| userID | String | Unique user identifier |
| fullName | String | User's full name |
| email | String | Unique email address |
| password | String | Bcrypt-hashed password |
| score | Number | Total accumulated score |
| problemsSolved | Number | Count of accepted problems |

### Problem Collection

| Field | Type | Description |
|-------|------|-------------|
| problemID | String | Unique problem identifier |
| title | String | Problem title |
| statement | String | Full problem description (Markdown) |
| difficulty | String | Easy / Medium / Hard |
| topics | Array | Tags (e.g. DP, Graph, Greedy) |
| timeLimit | Number | Execution time limit (ms) |
| memoryLimit | Number | Memory limit (MB) |

### Test Case Collection

| Field | Type | Description |
|-------|------|-------------|
| testCaseID | String | Unique test case identifier |
| problemID | String | Reference to parent problem |
| input | String | Test case input data |
| output | String | Expected output |
| isHidden | Boolean | True = hidden; False = sample/visible |

### Submission Collection

| Field | Type | Description |
|-------|------|-------------|
| submissionID | String | Unique submission identifier |
| userID | String | Reference to submitting user |
| problemID | String | Reference to problem |
| language | String | Programming language used |
| code | String | Raw source code |
| verdict | String | AC / WA / TLE / MLE / RE / CE |
| runtime | Number | Execution time (ms) |
| memory | Number | Peak memory usage (MB) |
| aiReport | String | AI-generated feedback (optional) |

## Backend – REST API & Submission Flow

All protected endpoints require a valid JWT in the `Authorization` header.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|--------------|
| POST | `/api/auth/register` | Register a new user account |
| POST | `/api/auth/login` | Login and receive a JWT token |
| GET | `/api/problems` | List all coding problems (with filters) |
| GET | `/api/problems/:id` | Get full problem details |
| POST | `/api/submissions` | Submit code for automated judging |
| GET | `/api/submissions/:id` | Get submission status & verdict |
| POST | `/api/run` | Run code with custom test input |
| GET | `/api/leaderboard` | Fetch global leaderboard rankings |
| GET | `/api/users/:id` | Get user profile & statistics |
| POST | `/api/ai/hint` | Generate step-by-step AI coding hints |
| POST | `/api/ai/report` | Analyse WA/TLE submissions with AI |
| POST | `/api/ai/recommend` | Recommend problems based on progress |

### Submission Processing Flow

1. User submits code from the Monaco Editor in the frontend.
2. Backend validates the request and stores the submission in MongoDB.
3. The submission is queued for execution (BullMQ + Redis).
4. A Docker container is spawned; code is compiled and executed.
5. The program is run against all hidden test cases sequentially.
6. Verdict is determined: `AC`, `WA`, `TLE`, `MLE`, `RE`, or `CE`.
7. Result is persisted to the Submission collection.
8. If Accepted, user score and statistics are updated atomically.
9. Frontend polls / receives the final verdict and execution details.

## Code Execution Engine

Tri-Lion uses Docker to execute user-submitted code in a secure, isolated environment. Each submission runs inside a freshly created container with strict resource constraints to guarantee fairness and system stability.

### Supported Languages & Limits

| Language | Time Limit | Memory Limit | Compilation |
|----------|-----------|--------------|-------------|
| C++ | 2 seconds | 256 MB | `g++ -O2` |
| Python | 5 seconds | 256 MB | CPython 3.x |
| Java | 5 seconds | 512 MB | `javac` / JVM |
| JavaScript | 5 seconds | 256 MB | Node.js 20 |

### Security Measures

- Code runs in a completely isolated Docker container — no host access.
- Network / internet access is disabled during execution.
- CPU usage, memory, and wall-clock execution time are strictly capped.
- Each submission is executed in an independent, ephemeral container.
- Containers are automatically destroyed after execution completes.

### Verdict Reference

| Verdict | Code | Meaning |
|---------|------|---------|
| Accepted | AC | All test cases passed within limits |
| Wrong Answer | WA | Output does not match expected output |
| Time Limit Exceeded | TLE | Execution exceeded the allowed time |
| Memory Limit Exceeded | MLE | Memory usage exceeded the allowed limit |
| Runtime Error | RE | Program crashed or exited abnormally |
| Compilation Error | CE | Code failed to compile successfully |

## AI Integration – Google Gemini

Tri-Lion integrates **Google Gemini 1.5 Flash** to provide intelligent assistance to users. All AI requests are proxied through the backend to keep the API key secure and to enforce user authentication.

### AI Features

| Feature | Description |
|---------|--------------|
| AI Hints | Provides step-by-step hints to guide the user without revealing the complete solution. Note: using AI hints reduces the score awarded for that problem. |
| Submission Analysis | Analyses Wrong Answer (WA) and Time Limit Exceeded (TLE) submissions; identifies likely issues and suggests concrete improvements. |
| Problem Recommendations | Recommends problems tailored to the user's solved history, target difficulty level, and topics of interest. |

### Security

- Gemini API key is stored as a server-side environment variable — never exposed to the client.
- AI endpoints are protected; unauthenticated requests are rejected with 401.
- User code and problem data are sanitised before being included in prompts.

## System Architecture

Tri-Lion follows a classic three-tier architecture with an additional asynchronous execution layer for code judging.

| Tier | Component | Technology | Responsibility |
|------|-----------|-----------|-----------------|
| Client | React SPA | React 18 + Vite + Redux | Problem browsing, code editing, result display |
| API Layer | REST Backend | Node.js + Express.js | Auth, problem CRUD, submission intake, AI proxy |
| Data | Primary DB | MongoDB Atlas | Persistent storage for all entities |
| Data | Cache / Queue | Redis + BullMQ | Leaderboard cache, rate-limiting, job queue |
| Execution | Docker Judge | Docker containers | Isolated, resource-capped code execution |
| AI | Gemini API | Google Gemini 1.5 Flash | Hints, WA analysis, problem recommendations |
| Hosting | Frontend | Vercel | CDN-served React build |
| Hosting | Backend + Docker | AWS EC2 / Render / Railway | Node.js process + Docker daemon |

```
React Frontend (Vercel) → HTTPS / REST API → Node.js + Express Backend
                                                      │
                    ┌─────────────────────────────────┼─────────────────────────────────┐
                    │                                  │                                  │
              MongoDB Atlas                      Redis (Cache/Queue)               Docker (Execution)
              (Database)                                                          Gemini AI (AI Layer)
```

## Getting Started

```bash
# Clone the repository
git clone https://github.com/<your-username>/Tri-Lion.git
cd Tri-Lion

# Install dependencies (frontend)
cd client
npm install

# Install dependencies (backend)
cd ../server
npm install

# Set up environment variables
cp .env.example .env
# Fill in MongoDB URI, JWT secret, Gemini API key, Redis URL, etc.

# Run backend
npm run dev

# Run frontend (in a separate terminal)
cd ../client
npm run dev
```

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

*Tri-Lion is under active development. New features and infrastructure changes will be reflected in future updates to this README.*
