# Elite Gym Tracker

A research-backed workout tracking application built with **React Native, Expo, and TypeScript** that helps lifters make measurable progress through intelligent progressive overload.

Unlike traditional workout trackers that only record sets and reps, Elite Gym Tracker evaluates workout performance and provides actionable feedback on when to increase weight, maintain the current load, or adjust future training — across both a quick daily logger and a full structured training-program system.

---

## Screenshots

<table>
  <tr>
    <td align="center"><img src="screenshots/home.png" width="220" alt="Home screen with today's workout" /><br /><sub><b>Home</b></sub></td>
    <td align="center"><img src="screenshots/workout-session.png" width="220" alt="Active workout session with live progression feedback" /><br /><sub><b>Live Progression</b></sub></td>
    <td align="center"><img src="screenshots/exercise-swap.png" width="220" alt="Swapping to an alternative exercise" /><br /><sub><b>Exercise Swap</b></sub></td>
  </tr>
  <tr>
    <td align="center"><img src="screenshots/programs.png" width="220" alt="Programs tab with built-in training plans" /><br /><sub><b>Programs</b></sub></td>
    <td align="center"><img src="screenshots/history.png" width="220" alt="Workout history" /><br /><sub><b>History</b></sub></td>
    <td align="center"><img src="screenshots/weight.png" width="220" alt="Bodyweight log" /><br /><sub><b>Weight Log</b></sub></td>
  </tr>
</table>

<p align="center">
  <img src="screenshots/settings.png" width="220" alt="Training phase settings" /><br />
  <sub><b>Phase Settings</b></sub>
</p>

---

## Overview

Most workout applications function like digital notebooks.

They show users what they completed, but they do not clearly explain what they should do next.

Elite Gym Tracker was created to solve that problem.

The app uses progressive overload logic to evaluate each completed set and provide feedback based on the selected weight, completed repetitions, and target rep range — whether you're logging a quick freestyle session or working through a structured, multi-week training program.

The goal is to help users train more consistently, make better progression decisions, and avoid guessing when it is time to increase weight.

---

## Core Features

### Intelligent Progressive Overload

- Evaluates performance after every completed set
- Detects when the top of a target rep range is reached
- Recommends increasing weight for the next set
- Recommends increasing weight during the next workout
- Encourages users to match performance across all working sets
- Prevents unnecessary weight increases when targets are not met
- The same progression engine powers every workout in the app — the quick logger and every training program

### Training Programs

- Five built-in programs, including the featured **Elite Hybrid** plan (strength, hypertrophy, aerobic conditioning, and higher-intensity conditioning across a 7-day rotation)
- Also includes Push/Pull/Legs, Upper/Lower, Four-Day Hypertrophy, and Bro Split
- Selecting a plan creates your own editable copy — the built-in template is never modified
- Swap any exercise for a suggested alternative, remove exercises, or adjust sets and rep ranges
- The app remembers your active plan and automatically recommends the next workout day, skipping rest days in that recommendation while still letting you open one manually
- Backed by a library of 75+ exercises and 20+ cardio activities, organized by muscle group, movement pattern, and equipment

### Workout Sessions

- Start a workout directly from your active program's recommended (or manually selected) day
- Logged sets, reps, and cardio entries are saved as you go, so an in-progress workout survives closing the app
- Resume an in-progress session from the Programs tab, or get prompted to resume/discard before starting a different one
- A summary screen after completion shows exercises finished, sets logged, cardio completed, and the next recommended workout

### Cardio Tracking

- Log duration, distance, rounds, round duration, rest time, intensity, calories, or steps — only the fields relevant to the activity are shown
- Supports running, walking, boxing/heavy bag, jump rope, StairMaster, cycling, rowing, elliptical, sled work, and farmer carries
- Cardio choices on hybrid training days (e.g. heavy bag vs. StairMaster vs. a short run) are picked before starting the workout

### Set-by-Set Coaching

The app provides immediate feedback based on performance.

Examples include:

- Increase the weight for the next set
- Maintain the current weight
- Match the completed repetitions across the remaining sets
- Increase the weight during the next workout
- Stay at the current load until the target is achieved

### Workout Logging & History

- Record weight and repetitions for every set
- Track multiple sets per exercise, with per-exercise notes
- View exercise-specific progression feedback as you train
- Complete a workout day (from the quick logger or an active program) and it's saved to your history
- Track bodyweight separately from workout weight, on its own timeline

---

## Why I Built This

I built Elite Gym Tracker because many fitness applications are either overly complicated or do not provide useful progression guidance.

Logging a workout is helpful, but users still need to decide:

- When should I increase the weight?
- Should I increase weight after one successful set?
- Should I wait until every set reaches the top of the rep range?
- What should I do if my repetitions decrease?
- What weight should I use during the next workout?

Elite Gym Tracker is designed to answer those questions automatically.

This project combines my interest in fitness, artificial intelligence, mobile development, and practical problem-solving.

---

## Progressive Overload Logic

The current progression system evaluates each set independently while also considering the exercise as a whole.

### Earlier Working Sets

When a user reaches the top of the target rep range during an earlier set, the app can recommend increasing the weight for the following set.

Example:

```text
Good job. You reached the top of your target range.
Increase the weight by 5 lbs for the next set.
```

---

## Installation

1. Clone the repository.
2. `cd` into the project folder.
3. Install [Expo Go](https://expo.dev/go) on your iPhone or Android device.
4. Run:

```bash
npm install
npm start
```

5. A QR code will appear.
6. Open Expo Go on your iPhone and scan the QR code.

Your app will open on your phone.

## Important

Your workout data, active program, and in-progress workout sessions all save locally on your device — the app is fully offline-first. The Coach tab currently builds a prompt you can paste into ChatGPT; future upgrades may include SQLite, cloud sync, charts and PR history, and direct AI coach integration.
