# KAI baseline vs official DART data

Source: DART GTFS, https://www.dart.org/transitdata/latest/google_transit.zip, retrieved 2026-10-31 (8.4 MB, HTTP 200).
Feed version V755-218-220-20261029, effective 2026-10-29 to 2026-12-06 (rail signup 220 OCT2026_RAIL). Parsed from routes/trips/stop_times/stops; raw copy kept outside the repo. Detail: `official-reconciliation.json`.

## Counts
| Measure | Value |
|---|---|
| Baseline records | 115 |
| Baseline unique physical stations (coords, 4 dp) | 75 |
| Official unique DART rail stations incl. Silver | 75 |
| Official unique stations excl. Silver-only stops | 66 |
| Official station-line memberships incl. Silver | 123 |
| Official station-line memberships excl. Silver | 113 |
| TRE-only stops (excluded) | 8 |
| Baseline records matched (<250 m) | 115 / 115 |
| Baseline line memberships confirmed | 114 / 115 (99.1%) |
| Official memberships not in baseline | 9 |

**"65 stations" is not supported.** The official feed gives 75 unique rail stations (66 without Silver Line-only stops; Silver is route_type 2 in the feed, not 0). The official line memberships are 123 (113 without Silver) vs 115 baseline records. The gap is explained by the 9 extra memberships below plus the unconfirmed dfw-b. Counting "stations" depends on the rule used: shared stops are one station, and Silver's 12th Street and Downtown Carrollton are separate stops from same-named Red/Orange and Green stops.

## Exceptions
| Item | Finding |
|---|---|
| Convention Center (Blue, closure flag) | Feed still schedules stop 22747 on Blue and Red (123 trips per day-type each). Closure (Jan 5 2026) is NOT confirmed by the feed. Red record carries no closure flag. |
| dfw-b (Orange) | Same coords as dfw-a. Official has one Orange DFW Airport Station; Terminal B is Silver-only. Unconfirmed. |
| Deep Ellum, Baylor, Fair Park | Baseline Green only. Feed adds Blue/Orange/Red with only 1-9 trips per day-type (vs 120 Green): likely limited/event service, not verified. |
| Name variants | Forest Lane/FOREST LN, SW Medical/SOUTHWEST MEDICAL, N. Carrollton/NORTH CARROLLTON, MLK Jr./MLK, Baylor University Med Ctr/BAYLOR, Tyler/Vernon. |
| Silver Line | Present (route 27514, 10 stops, 212 trips at sampled stops). |
| Excluded | TRE-only stops, streetcar/trolley, Sherman Pocket Track, Tex yard limits. |

## Could not be verified
- Convention Center closure and reopening estimate (2029): no DART service alert or press page was checked; the feed contradicts it.
- Whether the extra Blue/Orange/Red calls at Deep Ellum/Baylor/Fair Park are public service.
- Coordinates: baseline equals feed coordinates exactly (0 m on all 115), so the baseline appears derived from this feed; no independent check was possible.
- City values in the baseline (not in GTFS), and DART's official station-count wording (fact sheet pages not consulted).
- Silver Line opening/operating status beyond its presence in the schedule.
