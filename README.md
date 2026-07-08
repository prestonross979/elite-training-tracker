# Elite Gym Tracker

A mobile-first Expo React Native workout tracker built for Preston's hypertrophy plan.

## Features

- Exact Monday-Sunday workout split
- Editable training phase
- Offline local saving with AsyncStorage
- Set-by-set weight and rep logging
- Progression calculator per exercise
- Bodyweight log
- Coach prompt generator for ChatGPT

## How to run on iPhone

1. Install **Expo Go** from the App Store.
2. Install Node.js LTS on your computer.
3. Open this folder in VS Code or Terminal.
4. Run:

```bash
npm install
npm start
```

5. A QR code will appear.
6. Open Expo Go on your iPhone and scan the QR code.

Your app will open on your phone.

## Important

Your workout data saves locally on your phone inside Expo Go. Later, this can be upgraded to SQLite, cloud sync, charts, PR history, and direct ChatGPT API coaching.
