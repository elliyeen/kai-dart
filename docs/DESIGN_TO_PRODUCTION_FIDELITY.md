# Design-to-Production Fidelity Contract — KAI

Status: REQUIRED for design implementation. This contract is a quality gate, not proof that any screen has passed review.

## Governing principle
An approved image is not merely inspiration. A production page must match its approved visual hierarchy, geometry, illustrations, typography, spacing, colors and interactions. A passing build does not imply design approval. No claim of pixel-perfect reproduction without an actual reference asset and measured review.

## Source of truth
- Product requirements and approvals: [Notion KAI specification](https://app.notion.com/p/40bbfb540ff3815db9efd7d92097dfe7).
- Executable implementation: this repository, using its existing Next.js, React, TypeScript, Tailwind, SVG and Playwright stack.
- Approved architecture image: `design/reference/dart-super-intelligence-approved.png` (MISSING until supplied and verified). Never silently replace with an approximate mockup.
- Design tokens and illustration assets: checked-in repository files, reused in actual page components.
- Review evidence: Playwright screenshots, visual comparison report, PR and Notion record.

## Mandatory workflow
1. **Discover**: Read latest Notion spec, this contract, existing CLAUDE.md, source, assets, styles, route and tests. Preserve existing work.
2. **Freeze reference**: Confirm the actual approved image file, dimensions and version/hash. If missing, mark `BLOCKED: approved reference asset not supplied` for visual fidelity; continue unrelated coding and scaffolding, never pretend an image description is equivalent.
3. **Extract design contract**: Create a small structured design manifest with canvas size, color tokens, type scale, spacing, stage geometry, illustrations, assets, responsive behavior and required micro-interactions. Capture any unknowns explicitly.
4. **Build real prototype**: Reuse production React/TypeScript components and SVG assets from the start. No throwaway mockup to be recreated later. Prefer CSS/Tailwind from existing stack. No new framework.
5. **Visual QA loop**: Use Playwright at identical viewport and scale to approved reference, capture screenshot, make side-by-side and overlay/diff, inspect macro-layout, illustration silhouettes, text hierarchy, spacing, palette, security ribbon, then correct and repeat. A raw image difference score alone is not an approval.
6. **Responsive and functional QA**: Desktop 1440/1280, iPad 1024/834, mobile 430/390. Test navigation, keyboard, focus, reduced motion, semantic labels, no overflow, content and accessibility.
7. **Gate**: Do not mark design COMPLETE or merge as visually approved without screenshot evidence and explicit user sign-off on rendered implementation. Do not claim production deployment without live verification. Respect existing branch protection and production approval rules.
8. **Record and resume**: Update IMPLEMENTATION_STATUS.md and Notion with exact screenshot paths, observed differences, commands, results, commit/PR, preview URL, approver and approval state. Resume from latest verified checkpoint.

## Current DART Super Intelligence design
- Exact heading: **DART Super Intelligence**
- Exact subheading: **Turn transit data into a clean, safe experience for all**
- Five stages: **Data In** (DART-inspired light rail) → **KAI** (Ingest · Model · Analyze) → **Intelligence** (Detect · Predict · Prioritize) → **Action** (Dispatch · Maintain · Resolve) → **Outcomes** (passengers going to work, school, play).
- Continuous security band: Built for Security | Protected Data | Controlled Access | Compliance Ready | Reliable & Scalable. Verify claims before describing implemented controls.
- Visual: white background, navy typography, restrained DART yellow accents, fine arrows, generous whitespace, premium consistent isometric SVG illustrations, subtle micro-interactions. No circle step numbers, tool/vendor logo stack, chart-as-outcome, “by Elliyeen” hero copy or Request a Proposal CTA on /architecture.
- The /get-started and /checkout pages retain their separate business flows and must also use this fidelity workflow when their coded designs are approved.
- Treat transit integration, DART endorsement, actual dispatch and security certification as unverified unless supported by evidence.

## Definition of done
Code + tests + visual evidence + responsive review + human visual approval + authorized deployment + verified live page. Missing any item means NOT COMPLETE. Visual approval is separate from code/test approval.

## Actual visual failure evidence — 2026-11-01
User supplied TWO images in conversation: (A) screenshot of delivered architecture page, 1320×2868 phone screenshot with small content in middle; (B) approved desktop mockup, 1536×768 with large, polished five-stage isometric illustrations. **Image B is the visual authority; image A is a failed implementation, not a new reference.** The current delivered design is REJECTED. The two files were supplied in ChatGPT, but have not been committed to GitHub; Claude must obtain the actual reference image file before claiming visual fidelity.

**Preserve from approved image B:** large stage illustrations occupying substantial visual width; high-contrast navy hero; prominent type; strong horizontal five-stage rhythm; refined consistent illustration silhouettes; clear thick security ribbon with icons; professional spacing and scale. **Do not copy its outdated content:** remove proposal CTA, circular numbered badges, “DART Platform” label, and old right-action subtitle. Use latest approved exact text and labels from Notion. Do not treat the rejected implementation as an aesthetic target.

**Mandatory correction:** At desktop 1536×768, create a screenshot of /architecture and compare against approved B at the same viewport; the diagram must be the hero rather than tiny icons. At mobile viewport 390/430, show a designed mobile layout, not a zoomed-out desktop page. Screenshot dimensions alone are not sufficient: review actual illustration scale, content density, typography and icon fidelity. Do not solve by scaling the entire page or placing the approved JPEG as a background. Rebuild/reuse the illustration assets as real responsive elements, preserving the visual design. No approval or completion without user acceptance of rendered screenshot.
