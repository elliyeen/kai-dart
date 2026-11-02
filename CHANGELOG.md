# Changelog

Versions follow the pull requests merged to `main`. Dates are 2026. Nothing here claims live DART data, endorsement or certification.

## [0.2.0] — 2026-11-01
### Added
- **Station platform** (`/stations`): all 115 original station-line records, search, five line filters, station pages with map, issues, evidence and a simulated independent-verification workflow (PRs #4–#11).
- **Per-station actions**: Report an issue (prefilled sheet), Deploy crew (simulated, Operations only) and a per-station Autonomous demo (#30).
- **Inspection checklist** rebuilt to 45 items in six sections with Pass/Fail/N/A, photo, notes, 80% submit threshold, attestation and tour (#30).
- **KAI loop** (Observe, Decide, Act, Verify, Learn): rules-based, simulated; plus a guided-demo step for it (#30).
- `/faq` (14 answers), `/get-started`, `/checkout` (non-binding proposal, nothing submitted), `/architecture` ("DART Super Intelligence", scenes cropped from the approved mock) (#18–#27).
- Loop, audit, inventory, test scenarios, contractors, contract and timing views (#15–#17).
- Cross-browser and device test sweep: 11 routes × 12 widths in Chromium, Firefox, WebKit, iPhone 14, iPad Pro 11, Pixel 7 (#26).
### Changed
- Architecture page: Enterprise Security band (SOC 2 Type II, Zero Trust, Encryption, Compliance shown as targets and mappings, not certifications); Intelligence engine view per line (#32).
- Landing: store-badge style CTAs, one hero "Get started" button, pilot heading typeset Apple-style with stations in alphabetical order (Akard, Park Lane, Spring Valley) (#25, #27, #30).
- Stations sidebar: one line list instead of two (#29).
- CI installs Chromium, Firefox and WebKit (#28).
- README rewritten from what the repo actually does.
### Fixed
- Stations page clipping under the header; 320 px overflows on the report form, checklist and inventory; site stays light in dark-scheme browsers (#25, #26).
- Checklist submit bar sat under the mobile tab bar (#30).
### Removed
- Platform and How It Works links from the nav and footers (#33).
- Unsupported claims: "65 stations", "16,055 inspection points", "real-time" and predictive-AI figures in the README; the "This is the new DART standard" section.

## [0.1.0]
- Initial KAI landing and legacy DART dashboard demo (`/platform`, `/dart/*`, `/cities/*`).
