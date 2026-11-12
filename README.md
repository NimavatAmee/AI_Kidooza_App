# AI Kids Companion (Kidooza)

A safe, voice-first animated AI learning companion for children aged 3–5.

## Project Structure Divided by Parts

```
AI_Kidooza_App/
├── mobile/      # Part 1: React Native (Expo) - Kids Companion App & 2D Dino Prototype
├── app/         # Part 2: Backend API (Express/Node), Shared Core & Web Companion
├── admin/       # Part 3: Next.js Admin Dashboard & Operational Analytics
├── .gitignore
└── README.md
```

## Part 1 (Current Active Phase): Mobile 2D Dino Prototype

### Features
* **2D Animated Dino Character:** Child-friendly vector character with native 60 FPS transitions.
* **Preschool-Safe Animation States:**
  * `IDLE`: Gentle breathing and periodic eye blinking.
  * `LISTENING`: Head tilted attentively towards the child.
  * `THINKING`: Head tilted up with wandering pupils.
  * `TALKING`: Animated mouth opening and closing synced with simulated speech.
  * `HAPPY`: Cheerful bouncing jump.
  * `SURPRISED`: Wide eyes and excited reaction.
  * `SLEEPING`: Closed eyes with floating animated "Zzz".
* **Interactive Testing UI:** On-screen buttons to immediately trigger and test any state.
* **Child Safety Foundation:** Zero raw audio or transcripts stored.

### How to Run on Mobile / Android
1. Navigate to the mobile folder:
   ```bash
   cd mobile
   ```
2. Start the Expo development server:
   ```bash
   npx expo start
   ```
3. Scan the QR code using the **Expo Go** app on your physical Android phone (or press `a` to run on an attached Android emulator/device via adb).
