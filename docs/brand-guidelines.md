# NEXORA Brand Identity & Design Tokens

**Brand Name:** NEXORA  
**Tagline:** Your system. Under control.  
**Typography:** Inter (Variable Font, weights 300 to 900)  
**Personality:** Premium, Technical, Minimal, Intelligent, Trustworthy.

---

## 1. Color Palette Tokens

```css
:root {
  /* Brand Accent Tokens */
  --color-electric-mint: #02FEDC;
  --color-indigo-blue: #5A5CFF;
  --color-neon-magenta: #F502FD;

  /* Dark Theme Tokens (Default) */
  --bg-primary-dark: #08090D;
  --bg-secondary-dark: #11131A;
  --bg-surface-dark: #171A23;
  --bg-surface-elevated: #1F2330;
  --border-subtle-dark: #232838;
  --border-highlight-dark: #323A50;
  --text-primary-dark: #F5F7FA;
  --text-secondary-dark: #969BAA;
  --text-muted-dark: #63697B;

  /* Light Theme Tokens */
  --bg-primary-light: #F4F6FB;
  --bg-secondary-light: #FFFFFF;
  --bg-surface-light: #EBEFF7;
  --border-subtle-light: #D6DEEB;
  --text-primary-light: #0D111C;
  --text-secondary-light: #4A5268;

  /* Status Colors */
  --color-success: #00E699;
  --color-warning: #FFB800;
  --color-danger: #FF4757;
  --color-info: #02FEDC;
}
```

---

## 2. Gradient Usage Guidelines

Gradients must never be plastered across every card or button. They are reserved for:
1. **Primary Hero Actions:** "Start Smart Scan", "Clean Selected"
2. **Progress Indicators:** Linear scanning bars and storage gauges.
3. **Selected Tab Accent Border:** Highlighting the current navigation context.
4. **Brand Elements:** Logo and application icon core.
