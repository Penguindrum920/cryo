# CRYO Product Requirements Document

Generated for interview preparation from the current CRYO codebase.

## 1. Product Summary

CRYO is a premium animated soda website for a fictional cold-wave fruit soda brand. The site presents a cinematic landing page, a flavour exploration page, a reviews page with a keyboard animation, and an AR product experience. The main product promise is that each flavour feels like a different branded world while still using one shared soda can model and one shared data system.

## 2. Product Goals

- Make the CRYO brand feel premium, cold, kinetic, and flavour-specific.
- Let users move from the landing page to a specific flavour with visual continuity.
- Use real 3D can rendering instead of flat mockups.
- Give every flavour its own colors, label texture, copy, ingredient profile, video, and AR model path.
- Support desktop inspection and mobile AR through proven web AR patterns.
- Keep the code structured enough that routes, data, animations, and assets can be explained clearly in an interview.

## 3. Users

- A consumer browsing a product landing site.
- A mobile user who wants to place a can in AR.
- A desktop user who wants a premium 3D showcase fallback.
- An interviewer or reviewer evaluating frontend engineering, animation implementation, asset handling, deployment, and user experience decisions.

## 4. Routes And Pages

| Route | File | Purpose |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | Landing page. Renders the Hero slice. |
| `/flavours` | `src/app/flavours/page.tsx` | Reads `flavor` or `flavour` search params and renders the matching flavour experience. |
| `/reviews` | `src/app/reviews/page.tsx` | Renders reviews with typing headline and Nimbus keyboard animation. |
| `/ar/[slug]` | `src/app/ar/[slug]/page.tsx` | Static AR route for each flavour slug, with optional `?launch=1` auto-launch. |

## 5. Core Functional Requirements

1. Landing page must show the CRYO brand and animated 3D cans.
2. Landing page must provide flavour cards only after the scroll-intro sequence reaches the flavour picker stage.
3. Selecting a flavour must route to `/flavours?flavor=<id>` and keep flavour data consistent.
4. Flavours page must play the uploaded flavour video normally, then fade the video while the same visual can handoff appears.
5. The persistent can must remain visible through the scan-box section instead of spawning as an unrelated object.
6. Flavour scan section must show the selected flavour name, description, ingredients, and notes.
7. AR button must always use the currently selected flavour.
8. Mobile AR must use `<model-viewer>` with WebXR, Scene Viewer, and Quick Look support.
9. Desktop AR fallback must show an orbitable 3D showcase and a QR code handoff.
10. Reviews page must type the heading with a blinking cursor, animate the keyboard, move heading and keyboard out of frame, then reveal review cards.
11. Overscroll must be disabled globally.
12. Deployment must include runtime assets under `public/assets`, `public/flavour-videos`, `public/ar`, and model support files.

## 6. Flavour Requirements

| Flavour | Pairing | Primary | Secondary | Route slug |
| --- | --- | --- | --- | --- |
| Frostbite Berry | Berry and lychee | `#c21121` | `#b3e6fb` | `frostbite-berry` |
| Neon Meltdown | Watermelon and mint | `#c1fe1a` | `#fe00ae` | `neon-meltdown` |
| Cosmic Crush | Grape and kiwi | `#433455` | `#ddea78` | `cosmic-crush` |
| Midnight Citrus | Blueberry and lemon | `#0d3b66` | `#faf0ca` | `midnight-citrus` |
| Velvet Frost | Peach and vanilla | `#c8a2c9` | `#fefbce` | `velvet-frost` |

## 7. Technical Requirements

- Framework: Next.js 14 App Router.
- Language: TypeScript and React 18.
- 3D stack: Three.js, React Three Fiber, Drei.
- Animation stack: GSAP and ScrollTrigger.
- AR stack: `@google/model-viewer` for WebXR, Android Scene Viewer, and iOS Quick Look path support.
- QR handoff: `qrcode.react`.
- Styling: Tailwind CSS plus global CSS in `src/app/app.css`.
- Deployment: Vercel project named `cryo`, GitHub repo `Penguindrum920/cryo`.

## 8. Nonfunctional Requirements

- Animations should respect `prefers-reduced-motion` where implemented.
- 3D canvases should use conservative DPR ranges for performance.
- Assets should be served from `public/` using stable public paths.
- Vercel uploads should exclude local caches and source-only asset archives while preserving runtime public assets.
- The shared flavour data must be the single source of truth for copy, colors, labels, logo variants, and AR models.

## 9. Acceptance Criteria

- `npm run build` completes successfully.
- Vercel production deployment is live at `https://cryo-iota.vercel.app`.
- Public flavour labels return HTTP 200 from `/assets/labels/*.png`.
- `/`, `/flavours`, `/reviews`, and `/ar/frostbite-berry` return HTTP 200.
- Every hand-written source/config file is represented in the interview guide source appendix.
- This `project guide` folder is committed and pushed to GitHub.

## 10. Interview Positioning

The project can be described as a branded interactive product site that combines data-driven flavour theming, WebGL product rendering, scroll-linked animation, video-to-3D handoff, AR launch flows, and production deployment hardening. The strongest interview points are the shared flavour model, the separation between routes and slices, the graceful mobile/desktop AR split, and the debugging process around Vercel asset uploads and dependency peer ranges.
