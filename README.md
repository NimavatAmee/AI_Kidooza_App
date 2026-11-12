# AI Kids Companion (Kidooza)

A safe, voice-first animated AI learning companion for children aged 3–5.

## Clean 3-Part Architecture

```
AI_Kidooza_App/
├── mobile/      # 📱 Part 1: React Native (Expo) - Kids Companion App & 2D Characters
├── backend/     # ⚙️ Part 2: Node.js + Express API, Prisma Database & Child Safety Engine
├── admin/       # 💻 Part 3: Next.js Admin & Parent Analytics Dashboard (Phase 5)
├── .gitignore
└── README.md
```

## 📱 Mobile App (`mobile/`)
* **2D Animated Companions:** Dino (baby dinosaur with crests, snout, tail, and tooth), Robo (hovering robot with LED visor), and Bunny (floppy wiggling ears).
* **Screens:** Welcome, Parent Login, DPDP Parental Consent, Child Profile, Multilingual Selection (English, Hindi, Gujarati), Character Interaction Stage, and Parent Controls with math gate.
* **Run:**
  ```bash
  cd mobile
  npx expo start
  ```

## ⚙️ Backend API Service (`backend/`)
* **Tech Stack:** Node.js + Express.js + TypeScript + Prisma ORM + PostgreSQL
* **Safety:** Child safety guardrails intercepting sensitive PII and enforcing preschool-appropriate responses.
* **Core Endpoints:**
  * `POST /api/auth/login` (Parent login & verification)
  * `POST /api/auth/consent` (Verifiable parental consent per DPDP Act)
  * `POST /api/children` (Minimal child profile CRUD)
  * `GET /api/characters` (Dino, Robo, Bunny metadata)
  * `POST /api/conversations/start` & `/message` & `/end` (Safe session tracking)
  * `GET /health` (Health & compliance indicator)
* **Run:**
  ```bash
  cd backend
  npm run dev
  ```

## 💻 Admin Dashboard (`admin/`)
* Planned for Phase 5: Next.js operational dashboard for parental metrics, active users, session durations, and safety event tracking.
