# Multi-Format Preview — Design Decisions
**Date:** 2026-05-30

## The UX problem being solved
Previously: user picks one template, sees one ratio, switches manually.
Now: user picks a content *type*, all three platform ratios render simultaneously. One generate → three outputs.

## Ratio targets
| Ratio | Dimensions | Primary platform | Shell type |
|-------|-----------|-----------------|------------|
| 9:16  | 1080×1920 | Reels, TikTok, Stories | phone-shell |
| 4:5   | 1080×1350 | Instagram feed portrait | story-shell |
| 1:1   | 1080×1080 | Instagram square, LinkedIn, Facebook | square-shell |

## Layout math (desktop, ~1200px center column)
Available width ≈ 1200px − 32px padding = 1168px  
Preview area height ≈ 100vh − 44px topbar − 104px genbar − 48px format strip = ~460px inner  
Target preview height: 420px (with 20px top/bottom padding)

At h=420px:
- 9:16: w = 420 × (9/16) = 236px  
- 4:5: w = 420 × (4/5) = 336px  
- 1:1: w = 420 × 1 = 420px  
Total: 236 + 336 + 420 + 2×20 gaps = 1032px ← fits in 1168px ✓

Scale factors to fit actual shells into these containers:
- phone-shell (320×640) → scale(420/640) = scale(0.656) → rendered 210×420px  
- story-shell (300×533) → scale(420/533) = scale(0.788) → rendered 236×420px  
- square-shell (420×420) → scale(420/420) = scale(1.0)   → rendered 420×420px  

## Content mapping
Each template type has a "natural" ratio. When displaying in the other two ratios, we pick the next best matching template from our existing 8:

| Selected | 9:16 panel | 4:5 panel | 1:1 panel |
|----------|-----------|----------|----------|
| T1 Text Chat | T1 (native) | T5 POV Story | T2 Bold Quote |
| T2 Bold Quote | T1 Text Chat | T3 Myth vs Fact | T2 (native) |
| T3 Myth vs Fact | T5 POV Story | T3 (native) | T2 Bold Quote |
| T4 Stat Cards | T1 Text Chat | T4 (native) | T8 Tips List |
| T5 POV Story | T5 (native) | T3 Myth vs Fact | T7 Hot Take |
| T6 Before/After | T1 Text Chat | T3 Myth vs Fact | T6 (native) |
| T7 Hot Take | T5 POV Story | T4 Stat Cards | T7 (native) |
| T8 Tips List | T1 Text Chat | T4 Stat Cards | T8 (native) |

## Smart crop / position decisions
- **9:16 (phone):** text content anchored to bottom 40% — keeps top safe zone clear for platform chrome (status bar). Background crop: centre-face priority.
- **4:5:** balanced — text centred vertically, background crops to face/focal point.
- **1:1:** tightest crop. If background has a face, crop to 60% from top to keep face in upper third.

## Active frame interaction
- Clicking a format card makes it the "active" frame (highlighted border).
- Controls in the right panel (caption, Info) reflect the active frame.
- "Export PNG" exports the active frame. "Export All Variants" exports all three.

## Empty state
When no content generated yet:
- Show 3 placeholder preview cards with dotted borders and ratio labels
- CTA in centre card: "Drop a photo here or hit Generate All →"
- Template thumbnail strip at bottom of each card

## Reference
- Canva Magic Resize: simultaneous preview validated ✓
- Adobe Express: right-rail controls for active frame ✓
- InShot: ratio tab strip as primary navigation ✓
