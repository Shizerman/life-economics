# Life in Weeks Tool — Spec v2

## Overview

A visual tool that shows users how many weeks they've lived and how many they (statistically) have left. Goal: create a visceral, clarifying moment that motivates intentional living.

---

## Core Inputs

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Birth month | Dropdown | Yes | |
| Birth year | Dropdown | Yes | Range: 1920–2025 |
| Gender | Dropdown | Yes | Male / Female (actuarial tables differ) |
| State | Dropdown | Yes (US default) | All 50 states + DC |
| Country | Dropdown | Phase 2 | Start with US only, add international later |

---

## Data Sources

| Scope | Source | File | Notes |
|-------|--------|------|-------|
| US National | SSA life tables | `actuarial_national.json` | Life expectancy remaining by age and gender |
| US by State | CDC NVSS | `actuarial_states.json` | Life expectancy at birth by state and gender |
| International (Phase 2) | WHO or UN data | TBD | By country and gender |

**How to use together:**
1. User enters birth date, gender, state
2. Calculate current age
3. Look up remaining years from national table for that age/gender
4. Apply state adjustment: `(state_life_expectancy - national_average)` as delta
5. Convert years to weeks

---

## Primary Output

### Grid Visualization

- Grid of boxes (52 columns × ~80-90 rows)
- Each box = 1 week
- Filled boxes = weeks lived
- Empty boxes = weeks remaining (estimated)
- Color coding by life phase (ties to 4 Phases of Life article)

### Key Stats Displayed

| Stat | Example |
|------|---------|
| Weeks lived | 2,184 |
| Weeks remaining (est.) | 1,976 |
| Percentage of life lived | 52% |
| Estimated end year | 2066 |

### Phase Overlay

- Color bands showing Phase 1 (0-20), Phase 2 (20-40), Phase 3 (40-60), Phase 4 (60-80+)
- Shows where user is in their current phase
- Ties directly to Life Economics "4 Phases of Life" article

---

## Relationship Calculators

### Weeks Left with Parents

**Inputs:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Parent 1 birth year | Dropdown | Yes | |
| Parent 1 gender | Dropdown | Yes | Male / Female |
| Parent 1 state | Dropdown | Yes | Default to user's state |
| Parent 2 birth year | Dropdown | No | Optional |
| Parent 2 gender | Dropdown | No | |
| Parent 2 state | Dropdown | No | Default to user's state |
| How often do you see them? | Dropdown | Yes | Options below |

**Visit frequency options:**
- Weekly
- A couple times a month
- Monthly
- Every few months
- A few times a year (default)
- Once a year
- Rarely

**Outputs:**
- "You have approximately X weeks left with your parents"
- "At X visits per year, that's about X visits remaining"
- "You have approximately X trips left with your parents"

---

### Weeks Left with Kids at Home

**Inputs:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Kid 1 birth year | Dropdown | Yes | |
| Kid 1 name | Text | No | Optional, for personalization |
| Kid 2 birth year | Dropdown | No | Optional |
| Kid 2 name | Text | No | |
| Kid 3 birth year | Dropdown | No | Optional |
| Kid 3 name | Text | No | |
| Age they leave home | Number | Yes | Default: 18 |

**Outputs:**
- "You have X weeks left with [Kid 1] at home"
- "You have X weeks left with [Kid 2] at home"
- "You have X weeks until your last child leaves home"

---

## Activity Calculators

### Adventures Remaining

**Inputs:**
| Field | Type | Default |
|-------|------|---------|
| Adventures per year | Number | 2 |

**Output:**
- "At 2 adventures per year, you have ~X adventures left"

---

### Other Activity Stats

| Stat | Calculation | Output Example |
|------|-------------|----------------|
| Summers left | Weeks remaining ÷ 52 | "You have ~X summers left" |
| Holidays left | Years remaining × 2-3 | "You have ~X Thanksgivings left" |
| Work weeks remaining | (Target retirement age - current age) × 50 | "You have ~X work weeks left" (optional input: retirement age) |

---

## Additional Features

### Milestone Markers
- Auto-calculated: "You turned 18 here," "You're here now"
- User-added: graduation, marriage, kids, etc.

### Downloadable/Printable
- PNG or PDF export
- "Print and put on your wall" CTA
- Life Economics watermark/branding

### Save/Bookmark
- Store inputs in localStorage so users don't have to re-enter
- Optional: generate shareable URL with encoded inputs

### Compare Mode (Phase 2)
- "See how your spouse's grid compares"
- Two grids side by side
- Useful for couples planning together

---

## UX Design Principles

### Progressive Disclosure

Don't overwhelm on first load. Structure in layers:

1. **Step 1:** Core inputs (birth date, gender, state) → Show grid immediately
2. **Step 2:** "Want to see more?" → Reveal relationship calculators
3. **Step 3:** "Customize your view" → Adventures, visits, work weeks

### Collapsible Sections

Each add-on calculator is its own collapsible card:

```
[Your Life in Weeks]                    ← Always visible
- Inputs + Grid + Core stats

[+] Time with Parents                   ← Collapsed by default
    - Parent inputs
    - Weeks/visits remaining

[+] Time with Kids at Home              ← Collapsed by default
    - Kid inputs
    - Weeks until they leave

[+] Adventures Remaining                ← Collapsed by default
    - Adventures per year input
    - Adventures remaining stat

[Download Image] [Share]
```

### Smart Defaults

| Input | Default |
|-------|---------|
| Adventures per year | 2 |
| Visits with parents | "A few times a year" (4-6) |
| Kids leave at | 18 |
| Retirement age | 65 |

Let users adjust, but don't force them to think.

### Emotional Pacing

1. The grid is the gut punch — let that land first
2. Core stats reinforce the impact
3. Relationship calculators deepen the emotion
4. Activity stats make it actionable

Don't show everything at once. Let them discover.

### Mobile-First

- This will get shared — grid must scale down cleanly
- Inputs must be thumb-friendly
- Share image must look good on social media

---

## Suggested Page Layout

```
┌─────────────────────────────────────────────────┐
│  YOUR LIFE IN WEEKS                             │
├─────────────────────────────────────────────────┤
│  Birth Month [▼]  Birth Year [▼]  Gender [▼]   │
│  State [▼]                                      │
│                                                 │
│  [Generate My Grid]                             │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐  (52 columns)         │
│  │█│█│█│█│█│█│█│█│█│█│█│  ← Phase 1 (blue)     │
│  │█│█│█│█│█│█│█│█│█│█│█│                        │
│  │█│█│█│█│█│█│█│█│█│█│█│  ← Phase 2 (green)    │
│  │█│█│█│█│█│█│█│█│█│█│█│                        │
│  │█│█│█│●│░│░│░│░│░│░│░│  ← You are here (●)   │
│  │░│░│░│░│░│░│░│░│░│░│░│  ← Phase 3 (yellow)   │
│  │░│░│░│░│░│░│░│░│░│░│░│                        │
│  │░│░│░│░│░│░│░│░│░│░│░│  ← Phase 4 (orange)   │
│  └─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘                        │
│                                                 │
│  WEEKS LIVED: 2,184    WEEKS LEFT: 1,976       │
│  52% COMPLETE          EST. END: 2066          │
│                                                 │
├─────────────────────────────────────────────────┤
│  [+] Time with Parents                          │
├─────────────────────────────────────────────────┤
│  [+] Time with Kids at Home                     │
├─────────────────────────────────────────────────┤
│  [+] Adventures Remaining                       │
├─────────────────────────────────────────────────┤
│  [+] More Stats (Summers, Holidays, Work Weeks) │
├─────────────────────────────────────────────────┤
│  [Download Image]  [Share]  [Print]             │
└─────────────────────────────────────────────────┘
```

---

## Phased Rollout

### Phase 1 (MVP)

- [x] Birth date, gender, state inputs
- [x] Grid visualization with phase colors
- [x] Core stats (weeks lived, remaining, percentage)
- [ ] Weeks left with parents
- [ ] Weeks left with kids at home
- [ ] Adventures remaining
- [ ] Downloadable image

### Phase 2

- [ ] Visits remaining with parents
- [ ] Summers/holidays/work weeks remaining
- [ ] Custom milestone markers
- [ ] Save inputs (localStorage)
- [ ] Shareable URL

### Phase 3

- [ ] International data (WHO/UN)
- [ ] Compare mode (two grids side by side)
- [ ] "Time with" comparison chart (parents vs work vs sleep)

---

## Content Tie-Ins

| Article | Connection |
|---------|------------|
| 4 Phases of Life | Phase overlay colors and structure |
| Always Have an Adventure on the Calendar | Adventures remaining calculator |
| Future: "How Many Weeks Do You Have Left?" | Standalone post introducing this tool |
| Future: "The Visits You Have Left" | Deep dive on parent time calculator |

---

## Technical Notes

### State Adjustment Calculation

```javascript
// National average life expectancy at birth (2022)
const nationalAvgMale = 74.74;
const nationalAvgFemale = 80.18;

// Get state-specific life expectancy
const stateLifeExp = actuarialStates[state][gender];
const nationalAvg = gender === 'male' ? nationalAvgMale : nationalAvgFemale;

// Calculate adjustment
const stateAdjustment = stateLifeExp - nationalAvg;

// Get remaining years from national table based on current age
const remainingYears = actuarialNational[gender][currentAge];

// Apply state adjustment
const adjustedRemainingYears = remainingYears + stateAdjustment;

// Convert to weeks
const weeksRemaining = Math.round(adjustedRemainingYears * 52);
```

### Parent Weeks Calculation

```javascript
// Calculate parent's remaining weeks using their age/gender/state
const parentAge = currentYear - parentBirthYear;
const parentRemainingYears = actuarialNational[parentGender][parentAge];
const parentStateAdj = actuarialStates[parentState][parentGender] - nationalAvg;
const parentWeeksRemaining = (parentRemainingYears + parentStateAdj) * 52;

// User's weeks remaining
const userWeeksRemaining = /* calculated above */;

// Weeks left together = minimum of both
const weeksWithParent = Math.min(parentWeeksRemaining, userWeeksRemaining);

// Visits remaining
const visitsPerYear = /* from dropdown */;
const visitsRemaining = Math.round((weeksWithParent / 52) * visitsPerYear);
```

---

## Open Questions (Resolved)

1. ~~Do you want the Phase colors baked in, or optional?~~ → Baked in, ties to article
2. ~~"Weeks left with parents" — include in MVP or save for later?~~ → Include in MVP
3. ~~Shareable image — priority or nice-to-have?~~ → Priority for MVP
4. ~~Any branding on the output?~~ → Yes, Life Economics watermark
