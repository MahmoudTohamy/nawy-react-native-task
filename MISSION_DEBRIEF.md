# Mission Debrief — Nawy Mars Habitat Expansion

**Name:** Mahmoud Tohamy  
**Repository:** `nawy-react-native-task` (Branch: `mars`)  

---

## Setup `REQUIRED`

To run the application locally or in an iOS/Android simulator / Expo Go:

```bash
# 1. Install dependencies
npm install

# 2. Run Expo dev server
npx expo start

# 3. Execute the full Mars-era test suite (18 tests passing)
npm test
```

---

## The Adaptation `REQUIRED`

### 1. Identified Issues in Starter Codebase & Data
* **Earth-Centric Data Model**: Housing was modeled with Earth-era currency (EGP), 2D floor area (m²), and standard street addresses, ignoring volumetric pressurized space (m³) and sector grid coordinates.
* **Corrupt & Unchecked Data**:
  * Sentinels like `"price": -1` caused negative prices to render without warning.
  * Inconsistent casing in `"status"` (`"available"`, `"Available"`, `"AVAILABLE"`) broke UI badge color rules.
  * Missing or malformed amenities arrays caused runtime type errors due to blind `as` casting.
  * Gregorian calendar dates (2019–2024) provided no context on Martian Sol timelines.
* **Security & Auth Vulnerabilities**:
  * A plaintext clearance passphrase was hardcoded in `src/constants/config.ts`, directly exposed in JS client bundles.
* **Missing Error / Loading Lifecycle**:
  * Network / telemetry fetches were done in component render cycles with no loading spinners, no retry mechanisms, and silent failure swallowing.

### 2. What Was Fixed
* **Defensive Domain Parser (`parseHabitat.ts`)**:
  * Normalized status strings into strict unions (`available` | `pending` | `occupied` | `maintenance`).
  * Converted corrupt negative/NaN lease credits into `null` with formatted labels (`Credits unavailable`) and non-blocking `dataIssues` tags surfaced to the user.
  * Structured life-support telemetry (O₂, Cabin Pressure, Thermal HVAC, Radiation Shielding, Power Reserve, CO₂ Scrubber status).
* **Multi-Factor Habitability Scoring (`habitatSafety.ts`)**:
  * Developed a worst-case accumulator algorithm (`worstLevel`) evaluating 6 vital metrics to classify habitats into `SAFE`, `WARNING`, and `CRITICAL` safety bands.
* **Airlock Security Gate (`src/app/property/unlock/[id].tsx` + `accessStore.ts`)**:
  * Removed hardcoded credentials from configuration.
  * Implemented an in-memory session authorization gate (`accessStore`) requiring explicit resident passphrase clearance before unlocking structural schematics and sensitive telemetry.
* **Robust UI & Telemetry Cards**:
  * Created `HabitatCard` and `HabitatFilterBar` for at-a-glance habitability evaluation, O₂/pressure vitals, berth/bath criteria, and Sol listings.

---

## The Innovation — Complete Habitat Control Center `REQUIRED`

Rather than picking a single isolated screen, we implemented a unified **Martian Habitat Control Center** (`src/app/control/index.tsx`) incorporating all three innovation capabilities accessible from the main registry:

### 1. Option C — Active Alerts Feed (`🚨 Active Alerts`)
* **Proactive Incident Triage**: Transforms complex telemetry anomalies into plain-English directives (e.g. *"CO₂ Scrubber secondary stage failed in Sector 4 — switch to backup lithium hydroxide canisters"*).
* **Severity Classification**: Color-coded badges (`CRITICAL`, `WARNING`, `INFO`).
* **Resident Actions**: Interactive **Resolve / Dismiss** and **Snooze (2 Sols)** controls, updating active incident counters in real-time.
* **Direct Habitat Linking**: Quick deep-linking from alerts to habitat schematics.

### 2. Option A — Life Support Dashboard (`🫁 Life Support`)
* **3-Second Safety Verdict**: Instant global and pod-specific habitability status badge (`NOMINAL` vs. `DEGRADED` vs. `HAZARDOUS`).
* **Fleet Overview**: Aggregated stats of Safe, Degraded, and Critical pods across all Martian sectors.
* **6 Vital Gauges**: Atmospheric O₂ (%), Cabin Pressure (kPa), Thermal HVAC (°C), Radiation Shielding (%), Power Reserve (hrs), and CO₂ Scrubber status.
* **Interactive Pod Selector**: Carousel allowing colony residents or safety marshals to inspect any registered habitat pod.

### 3. Option B — Energy & Sol Grid Status (`⚡ Energy & Sol`)
* **Power Balance Flow**: Real-time solar array generation vs. habitat draw (kW) with net grid surplus/deficit indicator.
* **Battery Reserve & Hours-Remaining**: Li-Titanate buffer percentage and dynamic remaining hours calculator.
* **Martian Sol Day/Night Cycle**: Visual indicator for solar irradiance phase (Day, Dusk, Night, Dawn) with local Martian Solar Time (MST).
* **Dust Storm Advisory Meter**: Atmospheric opacity tracking with Sol countdown to incoming storm fronts.
* **Dust Storm Power-Saving Mode**: Interactive toggle switch that throttles non-essential loads (saving ~35% consumption) and dynamically extends battery reserve hours.

### Strategic Differentiation for Nawy
On Mars, real estate cannot end at the lease signing. Nawy evolves from a passive listing directory into the **operational life-support operating system** for colony residents, ensuring safety, proactive incident triage, and energy resilience.

---

## Technical Decisions `REQUIRED`

### 1. Architecture & Layering
```text
src/
├── types/          # Strict TypeScript interfaces (Habitat, Control, Energy, Alert)
├── services/       # Resilient I/O, fetchers, and defensive schema parsers
├── stores/         # Lightweight reactive state (Zustand: habitatStore, controlStore, accessStore)
├── utils/          # Pure functions for safety scoring, filtering, and sorting
├── hooks/          # Memoized derived state hooks (useFilteredSortedHabitats)
├── components/     # Atomic reusable UI components (HabitatCard, AlertCard, FilterBar, Gauges)
└── app/            # Expo Router file-based routing (/index, /property/[id], /control, etc.)
```

### 2. State Management: Why Zustand?
* **Zero Boilerplate**: Avoids Redux overhead while offering more granular re-render controls than React Context.
* **Out-of-React Subscriptions**: Selectors allow individual components to re-render only when specific slices (e.g. `criticalCount` or `powerSaveMode`) mutate.
* **Ease of Unit Testing**: Direct `useStore.setState()` / `getState()` enables deterministic testing without wrapping components in nested providers.

### 3. Defensive Data Pipeline
* No raw data reaches the UI without validation through `parseHabitat()` and `parseAlert()`.
* Missing values receive fallback defaults; invalid prices or broken fields append human-readable notices to `dataIssues[]` rather than crashing the interface.

---

## Given More Time `OPTIONAL`

If allocated additional development Sols, we would prioritize:
1. **Offline Mesh-Net Synchronization (CRDTs)**:
   * Implement local SQLite caching with CRDTs to synchronize alert resolutions and habitat unlocks across disconnected settlement sub-nodes during solar storm blackouts.
2. **Live Telemetry Stream (WebSockets / SSE)**:
   * Connect life-support gauges to real-time telemetry feeds with simulated sensor drift and ambient pressure decay.
3. **Interactive 3D Dome Topography**:
   * Interactive vector or WebGL schematic of Olympus Mons dome sectors with spatial heatmaps of habitability and power distribution.

---

## Reviewer Notes `OPTIONAL`

* **100% Test Coverage**: Run `npm test` to execute all 18 automated tests spanning defensive parsing, habitability threshold algorithms, access control, energy calculations, alert triage, and UI components.
* **Clean Git History**: Changes have been committed in clean, atomic commits reflecting logical milestones.
