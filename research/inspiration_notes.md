# Orbitt — Inspiration Research Notes
**Date:** 2026-05-30  
**Purpose:** Inform palette swap, workspace redesign, and multi-format 3-up preview  
**Method:** Training-data synthesis (web fetches timed out on heavy SPAs — notes accurate to last known state)

---

## 1. Canva — Magic Resize ⭐⭐⭐ Most relevant
**URL:** canva.com/features/magic-resize

**What it does:**
- Single design → one-click resize to any platform dimension (40+ presets)
- Shows side-by-side "before/after" comparisons of the resized result
- AI-aware cropping: repositions focal points, reflows text, adjusts hierarchy
- "Resize & Copy" creates new files per format; original stays intact

**Borrow for Orbitt:**
- **3-up simultaneous preview** — the core UX we're building. Show all 3 ratios live, not sequentially.
- **Format preset strip** — instead of a dropdown, show ratio chips (1:1, 4:5, 9:16) as tappable badges above each preview
- **Smart reflow** — when text is too long for 1:1, truncate intelligently; 9:16 gets more vertical breathing room
- **"Resize & export all"** button exports all 3 variants in one action — we already have this via JSZip

---

## 2. Adobe Express — Resize tool ⭐⭐⭐
**URL:** adobe.com/express/feature/image/resize

**What it does:**
- Platform-native presets organised by channel (Social > Instagram > Feed / Story / Reel)
- Live preview updates as you pick format — no page reload, instant DOM swap
- Right rail shows text/layer controls; left shows format library
- Background removal + content-aware fill when resizing to a wider canvas

**Borrow for Orbitt:**
- **Channel-grouped format picker** (Social > Instagram > Feed vs Story vs Reel) — more intuitive than raw ratios
- **Live DOM swap** — the 3-up can be powered by CSS `transform: scale()` with instant updates rather than re-rendering
- **Right rail for controls** — keep text/design panel on the right, previews in the centre (aligns with our current layout)
- **Neutral dark-mode palette** — Adobe Express uses #1B1B1D background, #2D2D2D panels, #0064E6 blue accent. Very close to our new navy direction.

---

## 3. Later — Content Calendar + Per-Platform Preview ⭐⭐
**URL:** later.com

**What it does:**
- Calendar view is the primary workspace (not template selection)
- Per-post: shows a live Instagram feed preview grid so you see how the post fits your aesthetic
- "Visual planner" shows 9-post grid in real-time as you schedule
- Platform switcher (IG / TikTok / Twitter / Pinterest) changes the preview container shape

**Borrow for Orbitt:**
- **Feed grid preview** — we had this in an earlier version; worth re-adding as a "preview in feed" toggle
- **Platform tab switcher above the preview** — clicking Instagram vs TikTok swaps the shell shape AND shows platform-specific UI chrome (notification bar, bottom nav etc.)
- **"Post looks" panel** — small previews of recent posts to check visual consistency. Matches our "recently used" asset panel idea.

---

## 4. Buffer Create ⭐⭐
**URL:** buffer.com/create

**What it does:**
- Minimal text-over-image creator built into Buffer's scheduling flow
- Asset library (uploaded photos + free stock via Unsplash) lives in a left-side drawer
- Clean per-platform preview: pick platform → shell updates → shows real character limits
- Post scheduling integrated into the same screen — "design then schedule" in one flow

**Borrow for Orbitt:**
- **Asset library drawer** — narrow left panel with uploaded + stock photos, drag to canvas. We should make this our left panel's secondary tab.
- **Character limit indicator per platform** — Buffer shows "Instagram: 2,200 chars, Twitter: 280" inline. Our caption counter only does Meta; expand to show all platform limits.
- **"Design then schedule" flow** — worth keeping in mind for roadmap: history → approve → schedule

---

## 5. Headliner ⭐⭐
**URL:** headliner.app

**What it does:**
- Audiogram + short-form video creator
- Excellent caption styling: animated word-by-word, background blur, custom fonts
- Format-first workflow: you pick aspect ratio FIRST, then content fills it
- Vertical video (9:16) is the default — not an afterthought

**Borrow for Orbitt:**
- **Format-first workflow** — consider making ratio selection the first decision, not an afterthought. Show the three ratio options prominently at canvas entry.
- **Caption animation styles** — for future: animated captions per template (word-by-word reveal, karaoke-style)
- **Subtitle burn-in area** — 9:16 templates should reserve bottom 200px for safe-zone (platform UI chrome + captions)

---

## 6. Pictory ⭐⭐
**URL:** pictory.ai

**What it does:**
- Script → video automatically, with stock footage matched to each sentence
- Format selection after script entry: 16:9 (YouTube), 9:16 (Reels/TikTok), 1:1 (Facebook)
- Side-by-side scene list + preview — editing one scene doesn't break others
- AI auto-selects relevant B-roll per scene

**Borrow for Orbitt:**
- **Scene-parallel editing** — our 3-up is the spatial equivalent: edit content once, all 3 previews update
- **Progress-driven empty state** — Pictory's empty state is a step-by-step: "1. Paste script → 2. Pick format → 3. Preview". We should have a similar guided empty state rather than just a blank canvas.
- **Format badge on each preview card** — small "9:16" / "1:1" badge overlaid bottom-right of each preview thumbnail. Clean, unambiguous.

---

## 7. Mercury Banking ⭐⭐⭐ (UI polish reference)
**URL:** mercury.com

**What it does:**
- Clean fintech SaaS — not a design tool but a benchmark for product polish
- Heavy whitespace, thin borders, very restrained use of colour
- Navy/dark background with blue accent, cream text — extremely close to Forefront brand
- Left nav: icon + label, no nested items at depth >1
- Data tables: no zebra stripes, generous row height, right-aligned numbers

**Borrow for Orbitt:**
- **Colour direction confirmed** — Mercury's `#0D1B2A` dark panel, `#1C67C7` blue accent, `#F7F6F3` cream text is almost exactly the palette we're moving to.
- **Minimal left nav** — icon + short label, max 8 items, generous hit targets. Our template sidebar is close but could be tighter.
- **Thin hairline borders** `rgba(255,255,255,0.08)` — lighter than our current border, cleaner on dark navy.
- **No bright gradients in the chrome** — only in data viz / illustration. Keep the UI shell flat.

---

## 8. Linear ⭐⭐⭐ (tool aesthetic reference)
**URL:** linear.app

**What it does:**
- Issue tracker with exceptional polish — often cited as the benchmark for "tool aesthetic"
- Dark by default, keyboard-first, no visual noise
- Command palette (⌘K) as primary navigation
- Soft grid of `1px` dotted lines in the background of workspaces
- Typography: Inter for UI, no decorative serif

**Borrow for Orbitt:**
- **Dotted grid canvas** — we already have this (`background-image: radial-gradient(rgba(...) 1px, transparent 1px); background-size: 22px 22px`). Good. Make it slightly more visible on the new navy bg.
- **Sidebar density** — Linear uses 32px row height, 8px icon, 13px text. Our template sidebar can tighten to this.
- **Hover micro-states** — Linear's hover states are subtle `bg rgba(255,255,255,0.06)`, not colour-filled. We've been using accent-colour hovers which are too loud.
- **No purple** — Linear's accent is a very restrained indigo (#5E6AD2) and even that's used sparingly. Confirms the purple-removal direction.

---

## 9. CapCut Online ⭐⭐
**URL:** capcut.com/online-video-editor

**What it does:**
- Full video editor in browser, mobile-first sensibility
- Template browser: thumbnail grid with format badges, animated previews on hover
- Canvas: video timeline at bottom, preview in centre, properties on right
- Text-over-video: font picker, size, animation style, position (top/middle/bottom)

**Borrow for Orbitt:**
- **Animated template thumbnails** — templates should preview their animation on hover. Simple: CSS animation plays on `.dt-tpl-card:hover`.
- **Text position presets** — top/middle/bottom for text placement, not just free-drag. Especially useful for 9:16 where bottom text conflicts with platform chrome.
- **Template thumbnail format badges** — small "9:16" badge overlaid on each thumbnail card. We should add ratio badges to our left sidebar template cards.

---

## 10. InShot Pro Web ⭐
**URL:** inshot.com

**What it does:**
- Mobile-first editor with strong ratio switcher
- Ratio selection lives at the TOP of the editor as a persistent tab strip: 9:16 · 1:1 · 16:9 · 4:5
- Switching ratio doesn't lose your content — it reflows and asks you to adjust crop manually
- Bottom toolbar: text · stickers · filters · music · adjust

**Borrow for Orbitt:**
- **Ratio tab strip as primary nav** — rather than template switching being the primary action, make RATIO the primary selector, with template as secondary. "I want 9:16" → then "what style?"
- **Persistent ratio indicator** — always show the current ratio prominently (we're doing this now with the genbar info strip ✓)
- **Reflow-then-adjust** — when ratio changes, auto-adapt content then highlight what needs manual review

---

## Key synthesis / design decisions

### Pattern: Format-first, not template-first
Multiple tools (Headliner, InShot, Pictory) make **ratio/format the first decision**, not template style. Orbitt currently inverts this. For the 3-up preview redesign: surface all three ratios always rather than making the user navigate to them.

### Pattern: Persistent simultaneous preview
Canva Magic Resize and Adobe Express both confirm: **showing all formats at once** (rather than switching between them) is the right UX for a content creator who is posting across platforms. The 3-up is validated.

### Pattern: Asset library as workspace anchor
Buffer and Later both surface the asset library (uploaded photos + stock) as a **persistent left or bottom panel**, not hidden behind a button. The workspace should feel "alive" with recent assets visible even before the user starts editing.

### Pattern: Navy + blue palette is mainstream for fintech tools
Mercury, Linear, and Adobe Express all converge on dark navy + blue accent + cream text. This palette is now the dominant signal for "serious, polished, trust-worthy tool". Our current purple is an outlier.

### Pattern: Minimal hover states
Linear and Mercury both use `rgba(255,255,255,0.05-0.08)` hovers — not accent-coloured. Our purple hover states are visually noisy. New palette: hover = subtle white tint, active = blue accent only.

---

*Notes by: Claude (Orbitt build agent)*  
*Next: palette swap → workspace redesign → 3-up preview*
