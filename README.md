# Nawy's Mars Expansion — Mobile Engineering Assignment

> **Estimated effort:** 8–12 hours

![Nawy Mars](assets/images/nawy-mars.png)


## Mission Briefing

After building one of Earth's leading real estate platforms, Nawy set its sights on the first Martian settlements — where thousands of residents need a transparent, trustworthy way to find safe housing under extreme conditions. The mobile team built this prototype quickly to demo the concept. It got the green light — but the codebase isn't ready for Mars yet.

You are joining the **Mobile Team** to get it there.

---

## 1 — What You're Given

| Resource | Description |
|----------|-------------|
| **Starter Codebase** | This Expo (React Native) project — built quickly and **not production-ready**. Expect structural issues, shortcuts, and decisions that do not scale. Refactoring is part of the job. |
| **Mock Data (JSON)** | `assets/data/properties.json` — local mock API responses simulating an Earth property feed. The data was written for Earth and carries over its limitations. |
| **UI Reference** | There is no separate design file. The existing app UI **is** the design reference. Run the app to see the current design. You are free to evolve or completely redesign it. |

### Running the Starter

```bash
npm install
npx expo start
```

Then either scan the QR code with the **Expo Go** app on your phone (free on the App Store / Play Store), press `i` / `a` for an iOS/Android simulator if you have one, or press `w` to run in the browser.

Requires Node 20 or newer (`.nvmrc` pins Node 24 for `nvm` users). No environment variables, simulators, or backend services are required — a phone with Expo Go, or just a browser, is enough.

```bash
npm test   # runs the (Earth-era) test suite
```

---

## Martian Habitat — Quick Reference

These are the environmental specs that matter when evaluating a Martian habitat. Use them to inform your data model decisions.

| Metric | Safe Range | Why It Matters |
|---|---|---|
| O₂ Level | 19.5 – 23.5 % | Below 19.5 % causes hypoxia; above 23.5 % is a fire risk |
| Cabin Pressure | 70 – 102 kPa | Below 70 kPa risks decompression sickness |
| Temperature | 18 – 24 °C | Deviation signals HVAC failure |
| Radiation Shielding | ≥ 90 % | Below 90 % exposes residents to unsafe cosmic radiation |
| Power Reserve | ≥ 4 hrs | Minimum battery backup to survive a dust storm blackout |
| CO₂ Scrubber | Active / Degraded / Failed | Life-critical — failure means evacuation |

---

## 2 — Known Problems

The starter codebase and mock data were carried over from Earth services with minimal adaptation. Before you can support Martian operations, the following categories of problems need to be addressed.

**You are not expected to fix all of them — but you are expected to identify them, choose which matter most for the Mars context, and act accordingly.**

### Code & Architecture

- All data loading is performed directly inside the route components with no service or repository layer.
- There is no loading state — the screen is blank while data is being fetched.
- There is no error state — failures are silently swallowed, leaving users with an empty screen.
- State is managed with scattered local `useState`; no state management pattern is applied.
- Sort logic is recalculated on every render, regardless of whether inputs changed.
- The access passphrase for viewing habitat details is hardcoded in `src/constants/config.ts`. This was acceptable for a demo. On Mars, the app will be deployed to real residents — a passphrase embedded in source code is visible to anyone who inspects the JS bundle or reads the repository.
- The existing tests in `src/__tests__/earth-era.test.tsx` assert Earth-era behaviour (currency, address format, hardcoded passphrase). They pass today but are expected to fail once the app is adapted for Mars — updating them is part of the job.

### Data Model

- The `Property` type has no environmental or life-support fields relevant to Mars (see reference table above).
- `price` is in Earth currency (EGP) — meaningless on Mars.
- `address` uses a flat Earth street format — not applicable to dome sectors or grid coordinates.
- `area` is a 2D floor area — insufficient for volumetric, pressurised spaces.

### Mock Data Quality

- One property has `"price": -1` — a corrupted sentinel value from a data migration. The app renders it as a negative price without any indication something is wrong.
- The `status` field is inconsistent: `"available"`, `"Available"`, and `"AVAILABLE"` all appear. The current UI colour-codes only the exact lowercase form correctly, so two properties are permanently shown in orange.
- One property has no amenities listed — the parsing in `src/types/property.ts` relies on unchecked `as` casts with no defensive handling for missing or unexpected fields.
- `listed_at` dates span 2019–2024 using the Earth (Gregorian) calendar — Mars operates on a different time system (sols, not days; a Martian year is ~687 Earth days). These dates provide no useful context for when a habitat became available.

### UI

- No visual cues communicate habitability, life-support status, or environmental safety.
- Some properties have `"image_url": null` — the UI correctly falls back to a home icon. However, properties that do have a URL use `<Image>` with no error handling, so a failed network request renders a blank area instead of the same clean fallback.

> These constraints are **intentional**. How you prioritise, what you fix, and what you choose to leave — are all part of the evaluation.

> You are free to make any assumptions regarding the living conditions on Mars beyond the provided details.


---

## 3 — Your Deliverables

You must submit **three deliverables**. All three are required.

---

### Deliverable A — Adapt Property Listings for Mars `REQUIRED`

**Ticket MARS-101**

> *As a prospective Mars resident, when I browse available habitats, I need to quickly understand the living conditions and safety status of each habitat.*

The current listings screen was designed for Earth properties. Adapt it for Martian housing evaluation.

**You may modify:** the property card design, displayed information, data models, state handling, architecture, navigation, and mock data.

**Minimum expectations:**

- [ ] The listings screen displays habitats from the provided mock data
- [ ] Each habitat card presents information relevant to Martian living conditions
- [ ] A prospective resident can evaluate a habitat at a glance — without needing to open the detail screen
- [ ] Missing or corrupt data is handled gracefully — no crashes, no silent blank screens
- [ ] The access passphrase is not hardcoded in source code
- [ ] Tapping a habitat card redirects the user to a passphrase entry screen before the detail page is shown

You decide which improvements are most impactful. Not everything needs to change — but every choice should be intentional and defensible. The screen should feel adapted for Mars, not just relabelled.

---

### Deliverable B — Innovation Feature `REQUIRED`

The Executive Board wants to see **one forward-looking feature** that could differentiate Nawy on Mars.

**Choose one path:**

#### Path 1 — Habitat Control Center

Martian habitats are active life-support environments. Residents need a clear way to understand whether their habitat is operating safely — without interpreting raw telemetry.

Pick **one** of the following screens to build (or propose your own):

**Option A — Life Support Dashboard**
A single-screen overview showing the habitat's vital signs at a glance. O₂ level (%), cabin pressure (kPa), temperature (°C), and CO₂ scrubber status — each colour-coded to safe / warning / critical state. A resident should open this screen and know in under 3 seconds whether everything is fine.

**Option B — Energy Status Screen**
A screen showing the habitat's power balance: current solar generation vs. consumption, battery charge level with an estimated hours-remaining indicator, and a simple day/night cycle indicator. A resident should tell at a glance whether they need to reduce power usage before the next dust storm.

**Option C — Active Alerts Feed**
A prioritised list of habitat warnings and recommendations — e.g. *"Airlock seal pressure dropped 4% — inspect door gasket"* or *"Battery at 12% — sunset in 2 hours"*. Each alert has a severity level (info / warning / critical), a suggested action, and a way to dismiss or snooze it.

#### Path 2 — Your Own Idea

Propose and demonstrate an alternative feature you believe is relevant to the Martian market.

**For either path, Deliver:** A working prototype in code. It can be minimal — a rough but functional screen is enough.

> Clear reasoning and product thinking matter more than feature completeness.

---

### Deliverable C — Mission Debrief `REQUIRED`

Fill in `MISSION_DEBRIEF.md` or present your debrief in any format you prefer — a document, slides, or a structured write-up. Cover any points you find relevant; you are not restricted to the sections in `MISSION_DEBRIEF.md`.

---

## 4 — Technical Guidelines

| | |
|---|---|
| **Framework** | React Native with Expo (required) |
| **Platforms** | iOS and Android |
| **Language** | TypeScript |
| **Architecture** | Any — justify your choice |
| **State Management** | Any (Context, Zustand, Redux Toolkit, Jotai, …) — justify your choice |
| **External Packages** | Allowed where justified — **but the app must remain runnable in Expo Go**. Do not add packages that require custom native code or `expo prebuild`. |
| **Mock Data** | You are free to modify `properties.json` — add, remove, or reshape fields |

### What We Value

- Thoughtful engineering judgment over brute-force implementation
- Clean, readable code over clever code
- Handling edge cases and imperfect data gracefully
- Product awareness — understanding *why*, not just *how*

---

## 5 — Submission

1. Create a new **private** GitHub repository named `nawy-react-native-task`
2. Push this starter project as the **initial commit on `main`** — do not alter it
3. Create a branch named **`mars`** and do all your work there
4. When ready, invite the GitHub reviewers listed at [this link](https://gist.github.com/mozakassab/592f6df573eff4a10bceb5432afb0b61) as collaborators with **read access**
5. Open a **pull request from `mars` into `main`**

---

*Good luck, and welcome to Mars.*
