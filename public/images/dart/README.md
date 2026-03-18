# DART Photo Assets

Real photography from DART stations and infrastructure, captured February 2026.

## Files

| File | Used in |
|------|---------|
| `parkeroad.jpg` | Homepage hero |
| `20260223_191335.jpg` | Platform page hero, homepage platform section |
| `20260223_191302.jpg` | Available |
| `20260223_195532.jpg` | Available |
| `20260223_195547.jpg` | Available |
| `20260223_195550.jpg` | Available |
| `DartredlineParker.jpg` | Available |

## Guidelines

- All images are original photography — no stock
- Format: `.jpg`
- Preferred minimum width: 1920px for full-bleed sections
- Always pair with the cinematic gradient overlay when used as a section background:

```tsx
<div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/10 to-black/70" />
<div className="absolute inset-0 bg-linear-to-r from-black/15 via-transparent to-black/15" />
```
