# Life in Weeks Tool — Spec v1

## Overview

A visual tool that shows users how many weeks they've lived and how many they (statistically) have left. Goal: create a visceral, clarifying moment that motivates intentional living.

---

## Inputs

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Birth month | Dropdown | Yes | |
| Birth year | Dropdown | Yes | Range: 1920–2025 |
| Gender | Dropdown | Yes | Male / Female (actuarial tables differ) |
| State | Dropdown | Yes (US default) | All 50 states + DC |
| Country | Dropdown | Phase 2 | Start with US only, add international later |

---

## Data Sources

| Scope | Source | Notes |
|-------|--------|-------|
| US National | SSA life tables | By age and gender |
| US by State | CDC NVSS | State-level life expectancy by gender |
| International (Phase 2) | WHO or UN data | By country and gender |

**SSA Life Tables:** https://www.ssa.gov/oact/STATS/table4c6.html

---

## Outputs

### Primary Visualization

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

---

## Enhanced Features

### Milestone Markers
- Auto-calculated: "You turned 18 here," "You're here now"
- User-added: graduation, marriage, kids, etc.

### "Weeks Left With" Calculator
- Input: parent's birth year/gender/state
- Output: estimated weeks you have left with them

### Adventure Math
- "If you take 2 adventures per year, you have ~X adventures left"
- "If you see your parents twice a year, you have ~X visits left"

### Phase Overlay
- Color bands showing Phase 1 (0-20), Phase 2 (20-40), Phase 3 (40-60), Phase 4 (60-80+)
- Shows where user is in their current phase

### Downloadable/Printable
- PNG or PDF export
- "Print and put on your wall" CTA

---

## UI/UX Notes

- Mobile responsive (grid scales down)
- Dark/light mode
- Subtle animation on load (boxes fill in from birth to now)
- Share button (generates shareable link or image)

---

## Phased Rollout

### Phase 1 (MVP)

- Birth date, gender, state (US only)
- Grid visualization
- Weeks lived / remaining stats
- Phase overlay (ties to 4 Phases article)
- Downloadable image

### Phase 2

- International data
- "Weeks left with parents" feature
- Custom milestone markers
- Adventure math

---

## Content Tie-Ins

- 4 Phases of Life article
- Adventure article ("Go go go!")
- Potential standalone post: "How Many Weeks Do You Have Left?"

---

## Open Questions

1. Do you want the Phase colors baked in, or optional?
2. "Weeks left with parents" — include in MVP or save for later?
3. Shareable image — priority or nice-to-have?
4. Any branding on the output (Life Economics watermark)?
