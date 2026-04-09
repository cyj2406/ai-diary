# Design System Document: The Empathetic Editor

## 1. Overview & Creative North Star
**Creative North Star: "The Ethereal Archive"**

To transcend the clinical nature of typical AI interfaces, this design system adopts the philosophy of an "Ethereal Archive." It moves beyond the rigid, boxy constraints of standard Material Design 3 by treating the UI as a living, breathing canvas of emotional reflection. 

We achieve a high-end editorial feel through **Intentional Asymmetry** and **Tonal Depth**. Instead of centering everything, we use staggered layouts and generous white space to allow the user’s thoughts to "breathe." The interface shouldn't feel like a database; it should feel like a high-end digital stationery set that responds to your mood.

---

## 2. Colors & Atmospheric Surface Logic
The palette is rooted in a sophisticated interpretation of optimism—shifting from deep, authoritative purples (`primary`) to restorative teals (`secondary`).

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders are strictly prohibited for sectioning or containment. Boundaries must be defined through background color shifts or subtle tonal transitions.
*   *Implementation:* Place a `surface-container-low` card atop a `surface` background. The change in hex value is the boundary.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of "frosted glass" or "fine vellum."
*   **Base:** `surface` (#f6f6f8) for the main application background.
*   **Secondary Content:** `surface-container-low` (#f0f1f3) for sidebars or secondary navigation.
*   **Interactive Cards:** `surface-container-lowest` (#ffffff) to provide the highest contrast and visual "pop" for diary entries.

### The "Glass & Gradient" Rule
To move beyond "out-of-the-box" MD3, use Glassmorphism for floating action buttons or modal overlays. 
*   **Backdrop Blur:** 20px–30px.
*   **Fill:** `surface` at 70% opacity.
*   **Signature Textures:** Use a subtle linear gradient (from `primary` #652fe7 to `primary-container` #a98fff) at 10% opacity as a background mesh for "Analysis" screens to signify AI activity without overwhelming the text.

---

## 3. Typography: Editorial Clarity
We use a dual-font pairing to balance authority with approachability.

*   **The Display & Headline Scale (Plus Jakarta Sans):** A high-end sans-serif with a geometric touch. Used for `display-lg` through `headline-sm`. Its wide apertures create an open, optimistic feel.
*   **The Reading & Label Scale (Be Vietnam Pro):** A modern, legible typeface optimized for long-form diary reading. Used for `title`, `body`, and `label` roles.

**Hierarchy Strategy:** 
Use `display-md` for emotional summaries (e.g., "You felt Radiant today") and `body-lg` for the actual diary text. The contrast in scale between a massive headline and a tight, well-leaded body block creates a "magazine" aesthetic.

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering** rather than structural shadows.

*   **The Layering Principle:** Stack `surface-container-lowest` on `surface-container` to create a natural lift.
*   **Ambient Shadows:** For floating elements (like the "New Entry" button), use a 32px blur, 0px spread, and 4% opacity shadow using the `on-surface` (#2d2f31) color. It should feel like a soft glow, not a dark drop-shadow.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline-variant` (#acadaf) at **15% opacity**. Never use a 100% opaque border.

---

## 5. Components

### Buttons
*   **Primary:** High-pill shape (`rounded-full`). Gradient fill from `primary` to `primary-dim`. No shadow.
*   **Secondary:** `surface-container-high` background with `primary` text.
*   **Tertiary:** Ghost style. `on-background` text with no container; `primary-container` 20% opacity on hover.

### Diary Cards & Lists
*   **Prohibition:** No divider lines between entries.
*   **The Separation:** Use a `1.5rem` (md) margin between cards. Use a subtle background shift to `surface-container-lowest` for the active entry.
*   **Corner Radius:** All cards must use `xl` (3rem) or `lg` (2rem) corners to maintain the "soft" brand identity.

### Emotion Chips
*   **Joy:** `tertiary-container` (#f4a237) background, `on-tertiary-container` text.
*   **Calm:** `secondary-container` (#68fadd) background, `on-secondary-container` text.
*   **Neutral:** `surface-container-highest` background, `on-surface-variant` text.

### Input Fields
*   **Diary Text Area:** No border. `surface-container-low` background. The focus state is indicated by a subtle transition to `surface-container-lowest` and a soft `primary-fixed` "glow" (shadow) around the perimeter.

### Contextual Components: The "Analysis Pulse"
*   **The Mood Bloom:** A custom component for AI analysis. A large, blurred circle using `secondary-fixed-dim` that sits behind the text, slowly oscillating in size to indicate the AI is "thinking" or "feeling" the entry.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical margins. If the left margin is 2rem, try a 4rem right margin for diary entries to create an editorial layout.
*   **Do** use `surface-tint` sparingly to highlight AI-generated insights.
*   **Do** prioritize "white space as a feature." If a screen feels crowded, increase the `surface` padding rather than adding a box.

### Don’t
*   **Don’t** use black (#000000). Use `on-surface` (#2d2f31) for high-contrast text.
*   **Don’t** use standard Material 3 "Elevated" shadows. They are too heavy for an "Empathetic" app. Stick to Tonal Layering.
*   **Don’t** use sharp corners. Even a `sm` corner (0.5rem) should be used sparingly; prefer `DEFAULT` (1rem) and above.