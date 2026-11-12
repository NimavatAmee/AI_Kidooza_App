# AI Kids Companion (Kidooza)

A safe, voice-first animated AI learning companion for children aged 3–5.

## Project Structure Divided by Parts

```
AI_Kidooza_App/
├── mobile/      # Part 1: React Native (Expo) - Kids Companion App & 2D Characters
├── backend/     # Part 2: Node.js + Express API, PostgreSQL/Prisma & Child Safety Engine
├── admin/       # Part 3: Next.js Admin Dashboard & Operational Analytics
├── app/         # Shared Web Companion & Client Packages
├── .gitignore
└── README.md
```

## Part 1: Mobile App (`mobile/`)
* 2D Animated Companions: **Dino** (green baby dino with spine crests, snout, tail, and tooth), **Robo** (floating hover robot with LED eyes), and **Bunny** (floppy wiggling ears).
* Phase 2 Screens: Welcome, Parent Login, DPDP Parental Consent, Child Profile, Multilingual Selection (English, Hindi, Gujarati), Character Interaction Stage, and Parent Controls with math gate.
* Run: `cd mobile && npx expo start`

## Part 2: Backend API Service (`backend/`)
* Tech Stack: Node.js + Express.js + TypeScript + Prisma ORM + PostgreSQL
* Endpoints:
  * `POST /api/auth/login` (Parent login & verification)
  * `POST /api/auth/consent` (Verifiable parental consent per DPDP Act)
  * `POST /api/children` (Minimal child profile)
  * `GET /api/characters` (Dino, Robo, Bunny metadata)
  * `POST /api/conversations/start` & `/message` & `/end` (Safe session tracking)
  * `GET /health` (Health & compliance status)
* Run: `cd backend && npm run dev`
