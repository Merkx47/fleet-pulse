## Packages
leaflet | Core map library
react-leaflet | React components for Leaflet
@types/leaflet | TypeScript definitions for Leaflet
@types/react-leaflet | TypeScript definitions for React Leaflet
framer-motion | Smooth page transitions and animations
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility for merging Tailwind classes safely
react-hook-form | Form state management
@hookform/resolvers | Validation resolvers for react-hook-form

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["Inter", "sans-serif"],
  display: ["Cal Sans", "Inter", "sans-serif"],
}
Leaflet CSS must be imported in index.css or App.tsx
Map tiles: OpenStreetMap 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
Auth pattern: Session-based via Passport.js (credentials: "include")
