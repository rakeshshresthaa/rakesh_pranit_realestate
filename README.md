# React + Vite

# Smart Real Estate Application Documentation

## Project Overview

**Smart Real Estate** is a full-stack web application built with React.js for a real estate platform. It enables users to browse, search, and manage property listings, with features like user authentication, favorites, analytics, notifications, and role-based access (user, agent, admin). The frontend uses React Router for navigation, Tailwind CSS for styling, and integrates with a backend API (likely JSON Server at `http://localhost:5000`) for data persistence.

### Key Features
- **Public Pages**: Home (featured properties, search, categories), Listings (filtered search), Property Details.
- **Protected Pages**: Dashboard (overview, property management), Favorites, Analytics, Notifications.
- **Authentication**: Login/Register with role selection; session management via localStorage.
- **Theming**: Light/dark mode toggle, persisted in localStorage and respecting system preferences.
- **API Integration**: CRUD operations for properties, favorites, notifications; analytics computation.
- **UI Components**: Reusable like PropertyCard, Navbar, Footer; icons from Lucide React; toasts via react-hot-toast.
- **Forms**: Validation with react-hook-form; image handling (URLs or base64 previews).
- **Charts**: Recharts for analytics visualizations (pie, line, area charts).
- **Routing**: Protected routes; URL params for filters/sorting.
- **Dependencies**: React, React Router, Axios, Tailwind, Recharts, Lucide React, React Hook Form, React Hot Toast.

### Tech Stack
- **Frontend**: React 18+, Vite (inferred from `main.jsx` and `App.css`).
- **Styling**: Tailwind CSS with custom layers; Google Fonts (Inter, Poppins).
- **State Management**: React Context (AuthContext, ThemeContext).
- **API**: Axios-based client (`api.js`) with data normalization.
- **Build/Deployment**: Assumes local dev with backend at port 5000.

### User Roles
- **User**: Browse listings, favorites, notifications, basic analytics.
- **Agent**: Manage own properties, view agent-specific analytics.
- **Admin**: Full access, including all properties and platform analytics.

### Assumptions/Limitations
- Backend is mocked (e.g., JSON Server); no real auth (plain password checks).
- Some data is mocked (e.g., analytics time-series).
- Image uploads are preview-only (base64); no server storage.
- No real-time features (e.g., WebSockets).
- Potential style conflicts between `index.css` and `App.css`.

## File Structure

The codebase is organized as a standard React app:

```
src/
├── assets/                # Static assets (e.g., logo.png)
├── components/            # Reusable UI components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── PropertyCard.jsx
│   └── ProtectedRoute.jsx
├── context/               # React Contexts
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── pages/                 # Page components
│   ├── Home.jsx
│   ├── Listings.jsx
│   ├── PropertyDetails.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Favorites.jsx
│   ├── Analytics.jsx
│   └── Notifications.jsx
├── services/              # API clients
│   └── api.js
├── App.jsx                # Main app with routing
├── App.css                # Additional CSS (logo, card styles)
├── index.css              # Global Tailwind styles
└── main.jsx               # Entry point
```

## Detailed File Descriptions

Below is a table summarizing each file, including purpose, key imports, and notable features. Use this for quick reference.

| File Name          | Purpose | Key Imports | Notable Features |
|--------------------|---------|-------------|------------------|
| **index.css**     | Global stylesheet with Tailwind. | Tailwind directives, Google Fonts. | Base styles (html/body with dark mode); components (btn-primary, card, input-field); utilities (text-gradient). Supports light/dark transitions. |
| **App.jsx**       | Root component with routing and providers. | React Router, AuthProvider, ThemeProvider, Toaster. | Wraps in Router, ThemeProvider, AuthProvider; defines public/protected routes; includes Navbar/Footer; custom Toaster styles. |
| **App.css**       | Specific component styles (Vite defaults). | None. | Styles #root, .logo (hover effects, spin animation), .card. May conflict with index.css. |
| **main.jsx**      | App entry point. | React, ReactDOM. | Renders App in #root with StrictMode; imports index.css. |
| **api.js**        | API client for backend interactions. | Axios. | Base URL `http://localhost:5000`; methods for properties (get/create/update/delete with filters), favorites, notifications, analytics (client-computed); normalizes data with `mapProperty`. |
| **Analytics.jsx** | Protected analytics page. | useAuth, api, Recharts, Lucide icons. | Role-based stats/cards; charts (pie for types, line for views, area for prices—some mocked); time range selector; market insights sidebar. |
| **Notifications.jsx** | Protected notifications page. | useAuth, api, Lucide icons. | Tabs (all/unread/types) with counts; notification cards with priority colors, icons, actions (read/delete); settings for preferences. |
| **Home.jsx**      | Public landing page. | api, PropertyCard, Lucide icons. | Hero search; categories cards; featured properties grid; stats; testimonials; CTA. |
| **PropertyDetails.jsx** | Property detail view. | useAuth, api, Lucide icons, toast. | Image carousel; details/icons; amenities with dynamic icons; agent contact form (with visit scheduling); favorite/share actions. |
| **Register.jsx**  | Registration page. | useAuth, react-hook-form, Lucide icons, toast. | Form with validation (password requirements checklist); role selection; terms checkbox; benefits list. |
| **Favorites.jsx** | Protected favorites page. | useAuth, api, PropertyCard, Lucide icons, toast. | Favorites grid with remove buttons; empty state with CTAs. |
| **Listings.jsx**  | Listings search page. | api, PropertyCard, Lucide icons. | URL param filters/sorting; sidebar filters; view modes (grid/list); pagination. |
| **Login.jsx**     | Login page. | useAuth, react-hook-form, Lucide icons, toast. | Role selection; remember me; forgot password; demo accounts info. |
| **Dashboard.jsx** | Protected dashboard. | useAuth, api, PropertyCard, Lucide icons, toast. | Tabs (overview/properties/favorites/analytics); stats; property management form (add/edit with drag-drop image); activity feed. |
| **ThemeContext.jsx** | Theme management context. | React hooks. | Persists dark mode; toggle function; uses system preference. |
| **AuthContext.jsx** | Auth management context. | React hooks, Axios. | Login/register/logout; role checks; avatar generation; coerces user data. |
| **PropertyCard.jsx** | Reusable property card. | useAuth, api, Lucide icons, toast. | Image/price/title/location; favorite toggle; view details link. |
| **Footer.jsx**    | Footer component. | React Router, Lucide icons. | Company info/contact; link sections; social icons; copyright. |
| **ProtectedRoute.jsx** | Route guard. | React Router, useAuth. | Checks auth/loading/role; redirects accordingly. |
| **Navbar.jsx**    | Navigation bar. | useAuth, useTheme, Lucide icons. | Logo; nav links; search; theme toggle; user menu (dashboard/notifications/logout); mobile menu. |

## Components Breakdown

### Core Components
- **Navbar.jsx**: Sticky top bar with responsive design. Includes search form that navigates to /listings; theme toggle (Sun/Moon icons); user dropdown if logged in (avatar, links to dashboard/favorites/analytics/notifications/logout).
- **Footer.jsx**: Bottom section with grid layout. Dynamic year in copyright (e.g., © 2025).
- **PropertyCard.jsx**: Card with hover effects; uses fallback images; favorite heart icon toggles via API.
- **ProtectedRoute.jsx**: Ensures auth; optional role enforcement (e.g., admin-only).

### Page Components
- **Home.jsx**: Engages users with visuals; fetches featured properties.
- **Listings.jsx**: Advanced filtering (price/bedrooms/etc.); pagination logic; clear filters button.
- **PropertyDetails.jsx**: Detailed view with carousel (chevrons for nav); contact form submits to API (truncated in code).
- **Dashboard.jsx**: Multi-tab interface; form for property CRUD with amenities as comma-separated string.
- **Analytics.jsx**: Visual data; mock time data; responsive charts.
- **Notifications.jsx**: Interactive list; type-specific icons (e.g., AlertCircle for high priority).
- **Favorites.jsx**: Simple management; confirm dialog for clear all (not implemented in API).
- **Login/Register.jsx**: Secure forms; password visibility; real-time validation.

## Contexts and Providers

- **ThemeContext.jsx**: Provides `isDark` and `toggleTheme`. Applied via class on <html>.
- **AuthContext.jsx**: Central auth logic. Login/register use Axios to /users; no hashing (insecure for prod).

## API Layer (api.js)

- **Endpoints**: /properties, /users, /favorites, /notifications.
- **Filtering**: Uses params like _sort, _order, price_gte for JSON Server compatibility.
- **Analytics**: Aggregates totals/averages client-side; type distribution object.
- **Favorites/Notifications**: User-specific; mark read via patch.

## Styling and Theming

- **Tailwind Integration**: Custom classes in index.css (e.g., .btn-primary with hover/focus states).
- **Dark Mode**: Consistent use of dark: variants (e.g., dark:bg-gray-900).
- **Gradients/Icons**: Text gradients; Lucide for scalable icons.

## Potential Improvements
- **Security**: Hash passwords; add JWT for auth.
- **Performance**: Server-side pagination/filtering; lazy load images.
- **Accessibility**: Add ARIA labels; keyboard nav for carousel.
- **Testing**: Add unit tests for contexts/API.
- **Deployment**: Configure for production (e.g., env vars for API URL).

This documentation covers all provided files. For code examples or deeper dives, refer to specific sections. If updates are needed, provide more details!
