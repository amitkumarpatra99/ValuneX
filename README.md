# Valunex — Brand Style Guide (concise)


## Colors
- Primary Gradient: linear-gradient(90deg, #7C3AED 0%, #8B5CF6 50%, #EF4444 100%)
- Brand Purple: #7C3AED
- Brand Pink/Accent: #EF4444
- Dark Background: #071024
- Surface/Glass: rgba(255,255,255,0.04)
- Muted Text: #9CA3AF
- White: #FFFFFF

## Typography
- Primary font: Inter (variable)
- Weights: 400 (regular), 600 (semibold), 800 (extrabold)
- Sizes:
  - H1: 32–40px
  - H2: 24–30px
  - Body: 14–16px
  - Buttons: 14–16px (bold)

## UI Tokens
- Border radius: 12px / 16px for cards
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32
- Shadows: soft deep shadow for cards: `0 12px 40px rgba(2,6,23,0.6)`

## Iconography
- Use `react-icons` for UI icons, or use custom SVG icons.
- Keep icons filled or stroke depending on context; maintain high contrast.

## Usage examples
- Primary CTA: rounded-full, gradient background, white text, subtle shadow.
- Cards: glass effect with `backdrop-filter: blur()` and subtle border.
- Favicon: use `logo.svg` (vector) + PNG fallback sizes 32x32, 16x16.

