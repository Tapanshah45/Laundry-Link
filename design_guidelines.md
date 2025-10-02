# Hostel Laundry Management App - Design Guidelines

## Design Approach

**Selected Approach:** Modern Utility Design inspired by Linear and Notion
**Justification:** This is a utility-focused app where efficiency and clarity are paramount. Students need to quickly view available slots and book them without friction. The design should be clean, trustworthy, and functional while maintaining a friendly, approachable feel for the student audience.

**Key Design Principles:**
- Clarity over decoration: Information hierarchy must be immediately obvious
- Speed and efficiency: Minimize clicks and cognitive load
- Trust and reliability: Visual design should convey system dependability
- Mobile-first: Students will primarily use this on their phones

---

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary: 220 90% 56% (Clean blue - trustworthy, calm)
- Primary Hover: 220 90% 48%
- Background: 0 0% 100%
- Surface: 220 13% 97% (Subtle card background)
- Text Primary: 222 47% 11%
- Text Secondary: 215 16% 47%
- Success: 142 71% 45% (Available slots)
- Success Light: 142 76% 96% (Available slot backgrounds)
- Error: 0 72% 51% (Booked slots)
- Error Light: 0 100% 97%

**Dark Mode:**
- Primary: 220 90% 56%
- Primary Hover: 220 90% 64%
- Background: 222 47% 11%
- Surface: 217 33% 17%
- Text Primary: 210 40% 98%
- Text Secondary: 215 20% 65%
- Success: 142 71% 45%
- Success Light: 142 50% 20%
- Error: 0 72% 51%
- Error Light: 0 60% 20%

### B. Typography

**Font Families:**
- Primary: 'Inter' from Google Fonts (via CDN)
- Monospace: 'JetBrains Mono' for time/room numbers

**Hierarchy:**
- Display (Welcome header): 2.5rem (40px), weight 700, line-height 1.2
- Heading 1: 1.875rem (30px), weight 600, line-height 1.3
- Heading 2: 1.5rem (24px), weight 600, line-height 1.4
- Body Large: 1.125rem (18px), weight 400, line-height 1.6
- Body: 1rem (16px), weight 400, line-height 1.5
- Small: 0.875rem (14px), weight 400, line-height 1.4
- Label: 0.875rem (14px), weight 500, uppercase, letter-spacing 0.05em

### C. Layout System

**Tailwind Spacing Units:** Use consistent spacing of 2, 4, 6, 8, 12, 16, 20, 24 units
- Micro spacing: p-2, gap-2 (buttons, inline elements)
- Standard spacing: p-4, gap-4, m-4 (cards, form fields)
- Section spacing: py-8, py-12 (page sections)
- Large spacing: py-16, py-20 (page padding)

**Grid System:**
- Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- Slot Grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

### D. Component Library

**Authentication Flow (PhoneLogin.jsx):**
- Centered card layout (max-w-md) with generous padding (p-8)
- Large app title with laundry icon (Heroicons: SparklesIcon)
- Phone input with country code selector
- Primary CTA button: Full width, rounded-lg, py-3, shadow-sm
- OTP input: 6-digit boxes with monospace font, gap-2
- Loading states: Subtle spinner with primary color

**Dashboard Layout:**
- Sticky header (h-16) with white/dark background, shadow-sm
- Welcome banner: Full-width colored gradient background (primary to lighter primary), py-12, rounded-xl mb-8
- User info: Display name (text-2xl font-bold) and room number (monospace badge)
- Logout button: Positioned top-right, outline variant

**Slot Cards:**
- Card base: rounded-xl, shadow-sm, hover:shadow-md transition, p-6
- Available state: border-2 border-success, bg-success-light
- Booked state: border-2 border-error, bg-error-light, opacity-60
- Time display: Large (text-2xl font-bold monospace), centered
- Date display: text-sm text-secondary, mb-4
- Status indicator: Badge with pill shape, uppercase, text-xs font-semibold
- Book button: Full width, rounded-lg, primary color, disabled state for booked
- Hover effect: scale-105 transform (only on available slots)

**Navigation:**
- Protected routes with loading spinner during auth check
- Smooth page transitions using Framer Motion (fade + slide)

**Icons:**
- Use Heroicons via CDN
- Key icons: SparklesIcon (laundry), ClockIcon (time), HomeIcon (room), CheckCircleIcon (available), XCircleIcon (booked)

### E. Animations

**Use Sparingly:**
- Page transitions: Fade + slide (duration 300ms)
- Slot card hover: Gentle scale-105 (duration 200ms, ease-out)
- Button interactions: Built-in Tailwind transitions
- Success/Error toasts: Slide from top (Framer Motion)
- Real-time updates: Subtle pulse effect when slot status changes

**Avoid:** Excessive motion, spinning elements, complex animations that distract from core functionality

---

## Page-Specific Guidelines

### Phone Login Page
- Centered vertical layout with max-w-md
- App logo/title at top (text-4xl, mb-8)
- Card with white/dark background, shadow-lg, rounded-2xl, p-8
- Two-step process: Phone → OTP, clear visual progression
- Error messages below inputs, text-error, text-sm
- Success redirect with brief loading state

### Dashboard Page
- Full viewport height with sticky header
- Hero-style welcome section (not a literal hero image, but colorful banner)
- Slot grid starting immediately below welcome (py-8)
- Real-time badge showing "Live" status (pulsing green dot)
- Empty state if no slots: Centered message with illustration placeholder
- Bottom padding for mobile scroll comfort (pb-20)

---

## Accessibility & Responsiveness

- Maintain WCAG AA contrast ratios (4.5:1 for text)
- Dark mode consistently applied across all components including inputs
- Focus states: ring-2 ring-primary ring-offset-2
- Touch targets: Minimum 44x44px (py-3 for buttons)
- Mobile: Single column grid, larger touch areas
- Tablet: 2-column slot grid
- Desktop: 3-4 column slot grid

---

## Images

**No hero images required** - This is a utility app focused on information display. The welcome banner uses a colored gradient background instead of imagery to maintain load speed and clarity.

**Icon Usage Only:**
- Heroicons for UI elements (laundry, time, status indicators)
- All icons 24x24px (w-6 h-6) with consistent stroke-width