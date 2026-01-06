# FleetPulse - Product Requirements Document

> **Version**: 1.0.0  
> **Standard**: Silicon Valley Production-Grade  
> **Document Type**: Requirements Specification  
> **Last Updated**: January 2026

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Technology Requirements](#2-technology-requirements)
3. [Application Structure](#3-application-structure)
4. [User Roles & Permissions](#4-user-roles--permissions)
5. [Functional Requirements - Authentication](#5-functional-requirements---authentication)
6. [Functional Requirements - Admin Dashboard](#6-functional-requirements---admin-dashboard)
7. [Functional Requirements - User Portal](#7-functional-requirements---user-portal)
8. [Data Requirements](#8-data-requirements)
9. [API Contract Requirements](#9-api-contract-requirements)
10. [UI/UX Requirements](#10-uiux-requirements)
11. [Design System Requirements](#11-design-system-requirements)
12. [Component Requirements](#12-component-requirements)
13. [Form & Validation Requirements](#13-form--validation-requirements)
14. [State Management Requirements](#14-state-management-requirements)
15. [Performance Requirements](#15-performance-requirements)
16. [Security Requirements](#16-security-requirements)
17. [Accessibility Requirements](#17-accessibility-requirements)
18. [Responsive Design Requirements](#18-responsive-design-requirements)
19. [Error Handling Requirements](#19-error-handling-requirements)
20. [Testing Requirements](#20-testing-requirements)

---

## 1. Product Overview

### 1.1 Description

FleetPulse is a modern fleet management SaaS platform that enables fleet managers to monitor their vehicles in real-time while providing administrators with tools to manage users and vehicle registrations.

### 1.2 Target Users

| User Type | Description |
|-----------|-------------|
| System Administrator | Internal staff managing users and vehicle registrations |
| Fleet Manager | End customer monitoring their fleet vehicles |

### 1.3 Core Value Proposition

- Real-time vehicle telemetry monitoring
- Diagnostic trouble code (DTC) alerts and descriptions
- GPS location tracking with map visualization
- Vehicle health status at a glance
- Centralized fleet administration

---

## 2. Technology Requirements

### 2.1 Frontend Stack

| Requirement | Specification |
|-------------|---------------|
| Framework | Next.js 14+ with App Router |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Form Handling | Formik |
| Validation | Yup |
| State Management | Zustand for global state, TanStack Query for server state |
| Icons | Lucide React |
| Charts | Recharts |
| Maps | Leaflet or Mapbox GL |
| Notifications | Sonner (toast library) |
| Animations | Framer Motion |

### 2.2 Backend Reference

| Requirement | Specification |
|-------------|---------------|
| API Framework | FastAPI (Python) |
| API Documentation | OpenAPI/Swagger (`/docs`) |
| Authentication | JWT-based |

### 2.3 Environment Configuration

The backend URL must be defined **once** as an environment variable. All API calls throughout the application shall reference this single variable.

| Variable | Value | Location |
|----------|-------|----------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://fleetpulse-io7s.onrender.com` | `.env.local` |

**Implementation Requirements:**

| Requirement ID | Description |
|----------------|-------------|
| ENV-001 | Backend URL shall be stored in `.env.local` as `NEXT_PUBLIC_API_BASE_URL` |
| ENV-002 | A centralized API client/config file shall import and export this variable |
| ENV-003 | All API service files shall import the base URL from the centralized config only |
| ENV-004 | No hardcoded backend URLs shall exist anywhere in the codebase |
| ENV-005 | Changing the backend URL shall require modification in `.env.local` only |

**File Structure:**

```
.env.local
└── NEXT_PUBLIC_API_BASE_URL=https://fleetpulse-io7s.onrender.com

src/lib/config.ts
└── export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

src/lib/api/client.ts
└── imports API_BASE_URL from config.ts
└── all API calls use this single source
```

### 2.3 Code Quality Requirements

| Requirement | Specification |
|-------------|---------------|
| Linting | ESLint with strict rules |
| Formatting | Prettier |
| Git Hooks | Husky for pre-commit checks |
| Type Safety | No `any` types allowed |

### 2.4 Design Philosophy

| Principle | Description |
|-----------|-------------|
| Minimalistic | Clean, uncluttered interfaces with purposeful whitespace |
| Reusable | Component-based architecture with maximum reusability |
| Consistent | Unified design language across all pages |
| Professional | Silicon Valley standard aesthetics |

---

## 3. Application Structure

### 3.1 Route Groups

| Route Group | Purpose | Access |
|-------------|---------|--------|
| (auth) | Authentication pages | Public |
| (admin) | Admin dashboard | Admin only |
| (dashboard) | User portal | Authenticated users |

### 3.2 Key Pages

**Authentication**
- `/login` - User and admin login
- `/register` - New user registration

**Admin Dashboard**
- `/admin` - Admin home with user search
- `/admin/users/[userId]` - User details and vehicle list
- `/admin/users/[userId]/reset-password` - Password reset form
- `/admin/users/[userId]/vehicles/new` - Register new vehicle
- `/admin/users/[userId]/vehicles/[vehicleId]` - Edit vehicle

**User Portal**
- `/dashboard` - Main dashboard with vehicle monitoring
- `/dashboard/settings` - User settings

---

## 4. User Roles & Permissions

### 4.1 Administrator

| Permission | Description |
|------------|-------------|
| Search Users | Search for users by email address |
| View User Details | View user profile information |
| Reset User Password | Force password reset for any user |
| List User Vehicles | View all vehicles registered to a user |
| Register Vehicle | Add new vehicle to a user's account |
| Edit Vehicle | Modify vehicle details and status |
| Delete Vehicle | Remove vehicle from system |

### 4.2 Fleet Manager (User)

| Permission | Description |
|------------|-------------|
| Register Account | Create new account with email/password |
| Login/Logout | Authenticate and end session |
| View Own Vehicles | See list of registered vehicles |
| View Vehicle Telemetry | Access real-time vehicle data |
| Sync Vehicle Data | Trigger manual data refresh |
| View DTC Codes | See diagnostic trouble codes |

---

## 5. Functional Requirements - Authentication

### 5.1 User Registration

| Requirement ID | Description |
|----------------|-------------|
| AUTH-REG-001 | System shall provide a registration form with email, password, and full name fields |
| AUTH-REG-002 | Email field shall validate for proper email format |
| AUTH-REG-003 | Password field shall display strength indicator (weak/medium/strong) |
| AUTH-REG-004 | Password shall require minimum 8 characters, 1 uppercase, 1 lowercase, 1 number |
| AUTH-REG-005 | System shall prevent duplicate email registration |
| AUTH-REG-006 | System shall display success message and redirect to login on successful registration |
| AUTH-REG-007 | Page shall include link to login page for existing users |

### 5.2 User Login

| Requirement ID | Description |
|----------------|-------------|
| AUTH-LOG-001 | System shall provide login form with email and password fields |
| AUTH-LOG-002 | Password field shall include show/hide toggle |
| AUTH-LOG-003 | System shall provide "Remember me" checkbox option |
| AUTH-LOG-004 | System shall display error message for invalid credentials |
| AUTH-LOG-005 | System shall redirect to appropriate dashboard on successful login |
| AUTH-LOG-006 | Page shall include link to registration page |
| AUTH-LOG-007 | System shall store JWT tokens securely |

### 5.3 Session Management

| Requirement ID | Description |
|----------------|-------------|
| AUTH-SES-001 | System shall automatically refresh access tokens before expiry |
| AUTH-SES-002 | System shall redirect to login when session expires |
| AUTH-SES-003 | User shall be able to logout from any page |
| AUTH-SES-004 | Logout shall clear all stored tokens and session data |

---

## 6. Functional Requirements - Admin Dashboard

### 6.1 Dashboard Home / User Search

| Requirement ID | Description |
|----------------|-------------|
| ADM-SRC-001 | Dashboard shall display header with "FleetPulse Admin Dashboard" title |
| ADM-SRC-002 | System shall provide email search input with search button |
| ADM-SRC-003 | Search shall be debounced (300ms delay) to prevent excessive API calls |
| ADM-SRC-004 | System shall display loading state during search |
| ADM-SRC-005 | System shall display "No user found" message when search returns empty |
| ADM-SRC-006 | System shall display user details card when user is found |

### 6.2 User Details Display

| Requirement ID | Description |
|----------------|-------------|
| ADM-USR-001 | User card shall display User ID |
| ADM-USR-002 | User card shall display Email address |
| ADM-USR-003 | User card shall display Full Name |
| ADM-USR-004 | User card shall display Active Status with visual badge (green=active, red=inactive) |
| ADM-USR-005 | User card shall display Created At date in human-readable format |
| ADM-USR-006 | User card shall include "Reset User Password" action button |
| ADM-USR-007 | User card shall include "View Vehicles" navigation button |

### 6.3 Reset Password

| Requirement ID | Description |
|----------------|-------------|
| ADM-PWD-001 | System shall provide dedicated reset password page/modal |
| ADM-PWD-002 | Form shall display user's email (read-only) |
| ADM-PWD-003 | Form shall include new password input with show/hide toggle |
| ADM-PWD-004 | Form shall validate password meets strength requirements |
| ADM-PWD-005 | System shall require confirmation dialog before submitting |
| ADM-PWD-006 | System shall display success toast notification on completion |
| ADM-PWD-007 | System shall display error message on failure |
| ADM-PWD-008 | Form shall include Cancel button to return to previous page |

### 6.4 Vehicle List (User Context)

| Requirement ID | Description |
|----------------|-------------|
| ADM-VEH-001 | Page shall display user information header |
| ADM-VEH-002 | Page shall display "Registered Vehicles" section with vehicle count |
| ADM-VEH-003 | Page shall include "Register New Vehicle" primary action button (top-right) |
| ADM-VEH-004 | Vehicles shall display in responsive table format |
| ADM-VEH-005 | Table columns: Sensor IMEI, VIN, Brand, Model, Year, Color, Plate Number, Fuel Type, Transmission, Active Status, Created At, Actions |
| ADM-VEH-006 | Active Status shall display as color-coded badge |
| ADM-VEH-007 | Each row shall include Edit action button |
| ADM-VEH-008 | Table shall support sorting by column headers |
| ADM-VEH-009 | Table shall display empty state when no vehicles exist |
| ADM-VEH-010 | Table shall display loading skeleton while fetching data |

### 6.5 Register Vehicle

| Requirement ID | Description |
|----------------|-------------|
| ADM-REG-001 | System shall provide vehicle registration form |
| ADM-REG-002 | Form field: Sensor IMEI (text, required) |
| ADM-REG-003 | Form field: Vehicle VIN (text, required) |
| ADM-REG-004 | Form field: Vehicle Brand (text, required) |
| ADM-REG-005 | Form field: Vehicle Model (text, required) |
| ADM-REG-006 | Form field: Vehicle Year (number, required, 1900 to current year+1) |
| ADM-REG-007 | Form field: Vehicle Color (text or color picker, required) |
| ADM-REG-008 | Form field: Vehicle Plate Number (text, required) |
| ADM-REG-009 | Form field: Fuel Type (dropdown - Petrol, Diesel, Electric, Hybrid, required) |
| ADM-REG-010 | Form field: Transmission (dropdown - Automatic, Manual, required) |
| ADM-REG-011 | Form shall include "Register Vehicle" submit button |
| ADM-REG-012 | Form shall include Cancel button to return to vehicle list |
| ADM-REG-013 | System shall display loading state during submission |
| ADM-REG-014 | System shall display success toast and redirect to vehicle list on success |
| ADM-REG-015 | System shall display field-level validation errors |

### 6.6 Edit Vehicle

| Requirement ID | Description |
|----------------|-------------|
| ADM-EDT-001 | System shall display current vehicle information at top of page |
| ADM-EDT-002 | Form shall pre-populate all fields with existing vehicle data |
| ADM-EDT-003 | All fields from registration shall be editable |
| ADM-EDT-004 | Form shall include Active Status toggle switch |
| ADM-EDT-005 | Form shall include "Save Changes" submit button |
| ADM-EDT-006 | Form shall include Cancel button to return without saving |
| ADM-EDT-007 | System shall require confirmation for status change to inactive |
| ADM-EDT-008 | System shall display success toast on successful update |
| ADM-EDT-009 | System shall highlight changed fields before submission |

---

## 7. Functional Requirements - User Portal

### 7.1 Dashboard Layout

| Requirement ID | Description |
|----------------|-------------|
| USR-LAY-001 | Header shall display FleetPulse logo/branding |
| USR-LAY-002 | Header shall display welcome message with user's full name |
| USR-LAY-003 | Header shall include user profile dropdown menu (top-right) |
| USR-LAY-004 | Profile dropdown shall include logout option |
| USR-LAY-005 | Layout shall be responsive for mobile and desktop |

### 7.2 Vehicle Selection

| Requirement ID | Description |
|----------------|-------------|
| USR-SEL-001 | Dashboard shall include vehicle selection dropdown |
| USR-SEL-002 | Dropdown shall list all VINs registered to user |
| USR-SEL-003 | Dropdown options shall display: VIN, Brand, Model, Year for identification |
| USR-SEL-004 | Dropdown shall be searchable/filterable |
| USR-SEL-005 | System shall remember last selected vehicle |
| USR-SEL-006 | Dashboard shall display prominent "Sync" button |
| USR-SEL-007 | Sync button shall trigger manual data refresh |
| USR-SEL-008 | Sync button shall display loading animation while syncing |

### 7.3 Vehicle Information Card

| Requirement ID | Description |
|----------------|-------------|
| USR-VEH-001 | Card shall display Vehicle Brand |
| USR-VEH-002 | Card shall display Vehicle Model |
| USR-VEH-003 | Card shall display Vehicle Year |
| USR-VEH-004 | Card shall display Vehicle Color |
| USR-VEH-005 | Card shall display Plate Number |
| USR-VEH-006 | Card shall display Fuel Type |
| USR-VEH-007 | Card shall display Transmission Type |
| USR-VEH-008 | Card shall display VIN |
| USR-VEH-009 | Card shall display Sensor IMEI |
| USR-VEH-010 | Card shall display Active Status badge |

### 7.4 Real-Time Metrics Display

| Requirement ID | Description |
|----------------|-------------|
| USR-MET-001 | Fuel Level shall display as visual gauge (0-100%) |
| USR-MET-002 | Mileage shall display as odometer-style visualization |
| USR-MET-003 | MIL Mileage shall display in kilometers |
| USR-MET-004 | Battery Health shall display with color-coded badge (GOOD=green, FAIR=yellow, POOR=orange, CRITICAL=red) |
| USR-MET-005 | Charging Status shall display current state (IDLE, CHARGING, DISCHARGING) |
| USR-MET-006 | ECU Status shall display with status indicator (STABLE=green, UNSTABLE=yellow, ERROR=red) |
| USR-MET-007 | All metrics shall use appropriate visual indicators (gauges, progress bars, badges) |

### 7.5 Location & Map Display

| Requirement ID | Description |
|----------------|-------------|
| USR-MAP-001 | System shall display GPS coordinates (Latitude, Longitude) |
| USR-MAP-002 | System shall embed interactive map showing vehicle position |
| USR-MAP-003 | Map shall support zoom in/out |
| USR-MAP-004 | Map shall support pan/drag navigation |
| USR-MAP-005 | Map shall display vehicle marker at current position |
| USR-MAP-006 | System shall display "Last Updated" timestamp |

### 7.6 Vehicle State & Alerts

| Requirement ID | Description |
|----------------|-------------|
| USR-STA-001 | Vehicle State shall display with color indicator (PARKED=gray, IDLING=yellow, DRIVING=blue) |
| USR-STA-002 | Speeding Status shall display (BELOW_LIMIT=green, AT_LIMIT=yellow, OVER_LIMIT=red) |
| USR-STA-003 | Engine Load shall display (LOW=blue, NORMAL=green, HIGH=orange, CRITICAL=red) |
| USR-STA-004 | Engine Stability shall display (OK=green, WARNING=yellow, CRITICAL=red) |
| USR-STA-005 | All status cards shall use consistent color coding |

### 7.7 Warning Indicators

| Requirement ID | Description |
|----------------|-------------|
| USR-WRN-001 | Overheating Risk shall display with warning colors (NORMAL=green, SENSOR_FAULTY=amber, WARNING=orange, CRITICAL=red) |
| USR-WRN-002 | Intake Air Temperature shall display status (NORMAL=green, INTAKE_HEAT_SOAK=amber, CRITICAL=red) |
| USR-WRN-003 | Warning states shall use warning triangle icons |
| USR-WRN-004 | Critical states shall pulse or animate to draw attention |

### 7.8 Diagnostic Trouble Codes (DTC)

| Requirement ID | Description |
|----------------|-------------|
| USR-DTC-001 | DTC section shall be expandable/collapsible |
| USR-DTC-002 | Each DTC shall display fault code (e.g., P0135) |
| USR-DTC-003 | Each DTC shall display description text |
| USR-DTC-004 | Each DTC shall display severity icon (info=blue, warning=amber, critical=red) |
| USR-DTC-005 | DTC list shall be scrollable if many codes present |
| USR-DTC-006 | Section header shall show count of active DTCs |

### 7.9 Timestamps Display

| Requirement ID | Description |
|----------------|-------------|
| USR-TIM-001 | Data Timestamp shall display when data was captured |
| USR-TIM-002 | Server Timestamp shall display when server received data |
| USR-TIM-003 | Vehicle Registered date shall display |
| USR-TIM-004 | All timestamps shall be in human-readable format |
| USR-TIM-005 | Timestamps shall show relative time where appropriate (e.g., "2 minutes ago") |

---

## 8. Data Requirements

### 8.1 User Entity

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | Primary key, auto-generated |
| email | String | Required, unique, valid email format |
| fullName | String | Required, 2-100 characters |
| passwordHash | String | Required, never exposed to frontend |
| isActive | Boolean | Required, default true |
| createdAt | DateTime | Auto-generated |
| updatedAt | DateTime | Auto-updated |

### 8.2 Vehicle Entity

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | Primary key, auto-generated |
| userId | UUID | Required, foreign key to User |
| sensorImei | String | Required, unique |
| vin | String | Required, 17 characters |
| brand | String | Required |
| model | String | Required |
| year | Integer | Required, 1900 to current year + 1 |
| color | String | Required |
| plateNumber | String | Required |
| fuelType | Enum | Required: petrol, diesel, electric, hybrid |
| transmission | Enum | Required: automatic, manual |
| isActive | Boolean | Required, default true |
| createdAt | DateTime | Auto-generated |
| updatedAt | DateTime | Auto-updated |

### 8.3 Vehicle Telemetry Entity

| Field | Type | Description |
|-------|------|-------------|
| vehicleId | UUID | Reference to vehicle |
| latitude | Float | GPS latitude coordinate |
| longitude | Float | GPS longitude coordinate |
| fuelLevel | Integer | Percentage (0-100) |
| mileage | Integer | Total kilometers |
| milMileage | Integer | MIL mileage in km |
| batteryHealth | Enum | GOOD, FAIR, POOR, CRITICAL |
| chargingStatus | Enum | IDLE, CHARGING, DISCHARGING |
| ecuStatus | Enum | STABLE, UNSTABLE, ERROR |
| vehicleState | Enum | PARKED, IDLING, DRIVING |
| speedingStatus | Enum | BELOW_LIMIT, AT_LIMIT, OVER_LIMIT |
| engineLoad | Enum | LOW, NORMAL, HIGH, CRITICAL |
| engineStability | Enum | OK, WARNING, CRITICAL |
| overheatRisk | Enum | NORMAL, SENSOR_FAULTY, WARNING, CRITICAL |
| intakeAirTemp | Enum | NORMAL, INTAKE_HEAT_SOAK, CRITICAL |
| dtcCodes | Array | List of DTC objects |
| dataTimestamp | DateTime | When data was captured |
| serverTimestamp | DateTime | When server received data |

### 8.4 DTC Code Structure

| Field | Type | Description |
|-------|------|-------------|
| code | String | OBD-II code (e.g., P0135) |
| description | String | Human-readable description |
| severity | Enum | info, warning, critical |

---

## 9. API Contract Requirements

### 9.0 Base Configuration

| Configuration | Value |
|---------------|-------|
| Base URL Variable | `NEXT_PUBLIC_API_BASE_URL` |
| Default Value | `https://fleetpulse-io7s.onrender.com` |
| API Version | v1 |
| Full API Prefix | `${NEXT_PUBLIC_API_BASE_URL}/api/v1` |
| Documentation | `${NEXT_PUBLIC_API_BASE_URL}/docs` |
| OpenAPI Spec | `${NEXT_PUBLIC_API_BASE_URL}/openapi.json` |

> **Note:** All endpoint paths below are relative to `${API_BASE_URL}/api/v1`

### 9.1 Authentication Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/v1/auth/register | Register new user |
| POST | /api/v1/auth/login | Authenticate user |
| POST | /api/v1/auth/logout | End session |
| POST | /api/v1/auth/refresh | Refresh access token |
| GET | /api/v1/auth/me | Get current user profile |

### 9.2 Admin Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/v1/admin/users/search | Search users by email |
| GET | /api/v1/admin/users/:userId | Get user details |
| POST | /api/v1/admin/users/:userId/reset-password | Reset user password |
| GET | /api/v1/admin/users/:userId/vehicles | List user's vehicles |
| POST | /api/v1/admin/users/:userId/vehicles | Register vehicle |
| GET | /api/v1/admin/vehicles/:vehicleId | Get vehicle details |
| PUT | /api/v1/admin/vehicles/:vehicleId | Update vehicle |
| DELETE | /api/v1/admin/vehicles/:vehicleId | Delete vehicle |

### 9.3 User Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/v1/vehicles | List own vehicles |
| GET | /api/v1/vehicles/:vehicleId | Get vehicle details |
| GET | /api/v1/vehicles/:vehicleId/telemetry | Get latest telemetry |
| POST | /api/v1/vehicles/:vehicleId/sync | Trigger data sync |
| GET | /api/v1/vehicles/:vehicleId/dtc | Get DTC codes |

### 9.4 API Response Requirements

| Requirement ID | Description |
|----------------|-------------|
| API-RES-001 | All responses shall follow consistent JSON structure |
| API-RES-002 | Success responses shall include `success: true` and `data` field |
| API-RES-003 | Error responses shall include `success: false`, `error.code`, and `error.message` |
| API-RES-004 | Validation errors shall include field-specific error messages |
| API-RES-005 | All endpoints shall return appropriate HTTP status codes |

---

## 10. UI/UX Requirements

### 10.1 General UX Principles

| Requirement ID | Description |
|----------------|-------------|
| UX-GEN-001 | Interface shall follow minimalistic design principles |
| UX-GEN-002 | Visual hierarchy shall be clear and consistent |
| UX-GEN-003 | Primary actions shall be visually prominent |
| UX-GEN-004 | Destructive actions shall require confirmation |
| UX-GEN-005 | Navigation shall be intuitive with clear breadcrumbs |
| UX-GEN-006 | Empty states shall provide helpful guidance |
| UX-GEN-007 | Error states shall provide actionable feedback |

### 10.2 Loading States

| Requirement ID | Description |
|----------------|-------------|
| UX-LOD-001 | All async operations shall display loading indicators |
| UX-LOD-002 | Buttons shall show spinner when action is in progress |
| UX-LOD-003 | Tables shall display skeleton loaders while fetching |
| UX-LOD-004 | Forms shall be disabled during submission |
| UX-LOD-005 | Page transitions shall be smooth (no flash of content) |

### 10.3 Notifications

| Requirement ID | Description |
|----------------|-------------|
| UX-NOT-001 | Success actions shall display green toast notification |
| UX-NOT-002 | Error actions shall display red toast notification |
| UX-NOT-003 | Warning states shall display amber toast notification |
| UX-NOT-004 | Info messages shall display blue toast notification |
| UX-NOT-005 | Toasts shall auto-dismiss after 5 seconds |
| UX-NOT-006 | Toasts shall be dismissible by user |

### 10.4 Interactive Elements

| Requirement ID | Description |
|----------------|-------------|
| UX-INT-001 | All clickable elements shall have hover states |
| UX-INT-002 | Focus states shall be clearly visible for keyboard navigation |
| UX-INT-003 | Transitions shall be smooth (200-300ms duration) |
| UX-INT-004 | Icons shall accompany actions for clarity |
| UX-INT-005 | Tooltips shall provide additional context where needed |

---

## 11. Design System Requirements

### 11.1 Color Palette

| Color Category | Usage |
|----------------|-------|
| Primary (Blue) | Primary actions, links, active states |
| Neutral (Slate/Gray) | Text, backgrounds, borders |
| Success (Green) | Positive status, success messages, active/good states |
| Warning (Amber) | Warning status, caution states |
| Error (Red) | Error messages, critical states, inactive status |
| Info (Blue) | Informational messages |

### 11.2 Typography

| Requirement ID | Description |
|----------------|-------------|
| DES-TYP-001 | Primary font family: Inter (or similar sans-serif) |
| DES-TYP-002 | Monospace font for codes/technical data: JetBrains Mono |
| DES-TYP-003 | Font sizes: consistent scale (12/14/16/18/20/24/30/36px) |
| DES-TYP-004 | Font weights: Regular (400), Medium (500), Semibold (600), Bold (700) |
| DES-TYP-005 | Line heights: 1.5 for body text for readability |

### 11.3 Spacing

| Requirement ID | Description |
|----------------|-------------|
| DES-SPA-001 | Base spacing unit: 4px (4/8/12/16/20/24/32/40/48/64px scale) |
| DES-SPA-002 | Consistent padding for cards and containers |
| DES-SPA-003 | Adequate whitespace between distinct sections |

### 11.4 Border Radius

| Requirement ID | Description |
|----------------|-------------|
| DES-RAD-001 | Small elements (badges, chips): 4px |
| DES-RAD-002 | Medium elements (buttons, inputs): 6-8px |
| DES-RAD-003 | Large elements (cards, modals): 12-16px |
| DES-RAD-004 | Circular elements (avatars, dots): Full radius |

### 11.5 Shadows

| Requirement ID | Description |
|----------------|-------------|
| DES-SHA-001 | Subtle shadows for elevation |
| DES-SHA-002 | Soft shadow for card depth |
| DES-SHA-003 | Larger shadow for modal prominence |
| DES-SHA-004 | Medium shadow for dropdowns |

---

## 12. Component Requirements

### 12.1 Button Component

| Requirement ID | Description |
|----------------|-------------|
| CMP-BTN-001 | Variants: Primary, Secondary, Outline, Ghost, Danger |
| CMP-BTN-002 | Sizes: Small (32px), Medium (40px), Large (48px) |
| CMP-BTN-003 | States: Default, Hover, Active, Disabled, Loading |
| CMP-BTN-004 | Support for left and right icons |
| CMP-BTN-005 | Full-width option available |

### 12.2 Input Component

| Requirement ID | Description |
|----------------|-------------|
| CMP-INP-001 | Types: Text, Email, Password, Number, Tel |
| CMP-INP-002 | Support for label and required indicator |
| CMP-INP-003 | Support for error message display |
| CMP-INP-004 | Support for hint text |
| CMP-INP-005 | Support for left and right icons |
| CMP-INP-006 | Password type with show/hide toggle |
| CMP-INP-007 | States: Default, Focus, Error, Disabled |

### 12.3 Select Component

| Requirement ID | Description |
|----------------|-------------|
| CMP-SEL-001 | Support for option list with value and label |
| CMP-SEL-002 | Support for placeholder text |
| CMP-SEL-003 | Support for searchable/filterable options |
| CMP-SEL-004 | Support for error state |
| CMP-SEL-005 | Keyboard navigation support |

### 12.4 Card Component

| Requirement ID | Description |
|----------------|-------------|
| CMP-CRD-001 | Variants: Default (bordered), Outlined, Elevated (shadow) |
| CMP-CRD-002 | Padding options: None, Small, Medium, Large |
| CMP-CRD-003 | Support for header with title, subtitle, and action |
| CMP-CRD-004 | Support for footer content |

### 12.5 Badge Component

| Requirement ID | Description |
|----------------|-------------|
| CMP-BDG-001 | Variants: Default, Success, Warning, Error, Info |
| CMP-BDG-002 | Sizes: Small, Medium |
| CMP-BDG-003 | Option for status dot indicator |

### 12.6 Table Component

| Requirement ID | Description |
|----------------|-------------|
| CMP-TBL-001 | Support for column definitions with custom rendering |
| CMP-TBL-002 | Support for sortable columns |
| CMP-TBL-003 | Support for loading skeleton state |
| CMP-TBL-004 | Support for empty state message |
| CMP-TBL-005 | Support for row click action |
| CMP-TBL-006 | Responsive horizontal scroll on mobile |

### 12.7 Modal Component

| Requirement ID | Description |
|----------------|-------------|
| CMP-MOD-001 | Sizes: Small, Medium, Large, Extra Large |
| CMP-MOD-002 | Support for title and description |
| CMP-MOD-003 | Close button in header |
| CMP-MOD-004 | Click outside to close (configurable) |
| CMP-MOD-005 | Escape key to close |
| CMP-MOD-006 | Smooth open/close animations |
| CMP-MOD-007 | Background overlay with blur effect |

### 12.8 Skeleton Component

| Requirement ID | Description |
|----------------|-------------|
| CMP-SKL-001 | Variants: Text, Circular, Rectangular |
| CMP-SKL-002 | Configurable width and height |
| CMP-SKL-003 | Pulse animation |

### 12.9 Dashboard-Specific Components

| Requirement ID | Description |
|----------------|-------------|
| CMP-DSH-001 | MetricCard: Display metric with title, value, unit, icon, and trend |
| CMP-DSH-002 | FuelGauge: Visual gauge for fuel level (0-100%) |
| CMP-DSH-003 | Odometer: Digital odometer display for mileage |
| CMP-DSH-004 | StatusIndicator: Color-coded status with label and optional pulse |
| CMP-DSH-005 | VehicleMap: Interactive map with vehicle marker |
| CMP-DSH-006 | DTCPanel: Expandable panel for diagnostic codes |

---

## 13. Form & Validation Requirements

### 13.1 Form Handling

| Requirement ID | Description |
|----------------|-------------|
| FRM-HDL-001 | All forms shall use Formik for state management |
| FRM-HDL-002 | All forms shall use Yup for schema validation |
| FRM-HDL-003 | Validation shall run on blur and on submit |
| FRM-HDL-004 | Forms shall prevent double submission |
| FRM-HDL-005 | Forms shall reset on successful submission where appropriate |

### 13.2 Validation Rules - Registration

| Field | Validation Rules |
|-------|-----------------|
| Email | Required, valid email format |
| Password | Required, min 8 chars, 1 uppercase, 1 lowercase, 1 number |
| Full Name | Required, 2-100 characters |

### 13.3 Validation Rules - Login

| Field | Validation Rules |
|-------|-----------------|
| Email | Required, valid email format |
| Password | Required |

### 13.4 Validation Rules - Reset Password

| Field | Validation Rules |
|-------|-----------------|
| Email | Required, valid email format, read-only |
| New Password | Required, min 8 chars, 1 uppercase, 1 lowercase, 1 number |

### 13.5 Validation Rules - Vehicle Registration/Edit

| Field | Validation Rules |
|-------|-----------------|
| Sensor IMEI | Required, alphanumeric, 15 characters |
| VIN | Required, 17 characters |
| Brand | Required, 2-50 characters |
| Model | Required, 2-50 characters |
| Year | Required, number, 1900 to current year + 1 |
| Color | Required |
| Plate Number | Required, 2-15 characters |
| Fuel Type | Required, must be valid enum value |
| Transmission | Required, must be valid enum value |

---

## 14. State Management Requirements

### 14.1 Global State (Zustand)

| Requirement ID | Description |
|----------------|-------------|
| STA-GLB-001 | Auth store: Current user, tokens, login/logout actions |
| STA-GLB-002 | Vehicle store: Selected vehicle, vehicle list cache |
| STA-GLB-003 | UI store: Sidebar state, theme preference |

### 14.2 Server State (TanStack Query)

| Requirement ID | Description |
|----------------|-------------|
| STA-SRV-001 | All API calls shall use TanStack Query for caching |
| STA-SRV-002 | Stale time: 30 seconds for telemetry, 5 minutes for static data |
| STA-SRV-003 | Automatic refetch on window focus |
| STA-SRV-004 | Optimistic updates for mutations where appropriate |
| STA-SRV-005 | Proper error handling and retry logic |

---

## 15. Performance Requirements

| Requirement ID | Description |
|----------------|-------------|
| PRF-001 | Initial page load: under 3 seconds |
| PRF-002 | Time to Interactive (TTI): under 3.5 seconds |
| PRF-003 | Largest Contentful Paint (LCP): under 2.5 seconds |
| PRF-004 | Cumulative Layout Shift (CLS): under 0.1 |
| PRF-005 | First Input Delay (FID): under 100ms |
| PRF-006 | API responses displayed within 1 second of request |
| PRF-007 | Images and assets shall be lazy loaded |
| PRF-008 | Bundle size optimized with code splitting |

---

## 16. Security Requirements

| Requirement ID | Description |
|----------------|-------------|
| SEC-001 | All API communication via HTTPS |
| SEC-002 | JWT tokens stored securely (httpOnly cookies preferred) |
| SEC-003 | Sensitive routes protected with authentication middleware |
| SEC-004 | Admin routes require admin role verification |
| SEC-005 | Input sanitized to prevent XSS attacks |
| SEC-006 | CSRF protection implemented |
| SEC-007 | Password fields never logged or exposed |
| SEC-008 | Rate limiting on authentication endpoints |
| SEC-009 | Failed login attempts tracked and limited |

---

## 17. Accessibility Requirements

| Requirement ID | Description |
|----------------|-------------|
| A11Y-001 | WCAG 2.1 Level AA compliance |
| A11Y-002 | All interactive elements keyboard accessible |
| A11Y-003 | Focus indicators clearly visible |
| A11Y-004 | Color contrast ratio: 4.5:1 minimum |
| A11Y-005 | All images have appropriate alt text |
| A11Y-006 | Form fields have associated labels |
| A11Y-007 | Error messages announced to screen readers |
| A11Y-008 | Skip navigation link provided |
| A11Y-009 | ARIA attributes used appropriately |

---

## 18. Responsive Design Requirements

### 18.1 Breakpoints

| Breakpoint | Width | Target Devices |
|------------|-------|----------------|
| Mobile | < 640px | Phones |
| Tablet | 640px - 1024px | Tablets, small laptops |
| Desktop | 1024px - 1280px | Laptops, desktops |
| Large Desktop | > 1280px | Large monitors |

### 18.2 Responsive Behavior

| Requirement ID | Description |
|----------------|-------------|
| RES-001 | Layout adapts fluidly to all screen sizes |
| RES-002 | Tables scroll horizontally on mobile |
| RES-003 | Navigation collapses to hamburger menu on mobile |
| RES-004 | Touch targets minimum 44x44px on mobile |
| RES-005 | Font sizes scale appropriately for readability |
| RES-006 | Dashboard cards stack vertically on mobile |
| RES-007 | Map component usable on all screen sizes |

---

## 19. Error Handling Requirements

| Requirement ID | Description |
|----------------|-------------|
| ERR-001 | Network errors display user-friendly message |
| ERR-002 | 404 pages provide navigation back to home |
| ERR-003 | 500 errors display generic error page |
| ERR-004 | Form validation errors display inline |
| ERR-005 | API errors display toast notification |
| ERR-006 | Session expiry redirects to login with message |
| ERR-007 | Error boundaries catch component crashes |
| ERR-008 | Failed data loads offer retry option |

---

## 20. Testing Requirements

### 20.1 Unit Testing

| Requirement ID | Description |
|----------------|-------------|
| TST-UNT-001 | All utility functions shall have unit tests |
| TST-UNT-002 | All validation schemas shall have unit tests |
| TST-UNT-003 | Code coverage minimum: 80% |

### 20.2 Integration Testing

| Requirement ID | Description |
|----------------|-------------|
| TST-INT-001 | All API integrations tested |
| TST-INT-002 | Authentication flow fully tested |
| TST-INT-003 | Form submissions tested end-to-end |

### 20.3 E2E Testing

| Requirement ID | Description |
|----------------|-------------|
| TST-E2E-001 | Critical user journeys have E2E tests |
| TST-E2E-002 | User registration flow |
| TST-E2E-003 | User login flow |
| TST-E2E-004 | Admin user search and password reset |
| TST-E2E-005 | Admin vehicle registration |
| TST-E2E-006 | User vehicle selection and telemetry viewing |

---

## Appendix A: Sample DTC Codes Reference

| Code | Description | Severity |
|------|-------------|----------|
| P0135 | O2 bank 1 sensor 2 heater circuit malfunction | Warning |
| P0011 | Camshaft timing over-advanced (Bank 1) | Warning |
| P0141 | O2 bank 1 sensor 2 heater circuit malfunction | Warning |
| P2185 | Engine Coolant Temperature Sensor 2 circuit too high | Critical |

---

## Appendix B: Status Color Mapping

| Status Type | Value | Color |
|-------------|-------|-------|
| Battery Health | GOOD | Green |
| Battery Health | FAIR | Yellow |
| Battery Health | POOR | Orange |
| Battery Health | CRITICAL | Red |
| Vehicle State | PARKED | Gray |
| Vehicle State | IDLING | Yellow |
| Vehicle State | DRIVING | Blue |
| Engine Load | LOW | Blue |
| Engine Load | NORMAL | Green |
| Engine Load | HIGH | Orange |
| Engine Load | CRITICAL | Red |
| Active Status | true | Green |
| Active Status | false | Red |

---

## Appendix C: Wireframe Layouts

### Admin Dashboard - User Search

```
┌─────────────────────────────────────────────────────────┐
│  FleetPulse Admin Dashboard                    [Logout] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Search Users                                           │
│  ┌─────────────────────────────────┐ ┌────────┐        │
│  │ Enter email address...          │ │ Search │        │
│  └─────────────────────────────────┘ └────────┘        │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  User Details                                    │   │
│  │  ─────────────────────────────────────────────  │   │
│  │  ID: uuid-xxxx-xxxx                             │   │
│  │  Email: user@example.com                        │   │
│  │  Full Name: John Doe                            │   │
│  │  Status: ● Active                               │   │
│  │  Created: January 1, 2026                       │   │
│  │                                                  │   │
│  │  [Reset Password]  [View Vehicles →]            │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Admin - Vehicle List

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Back    FleetPulse Admin                                    [Logout] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  User: John Doe (user@example.com)                                      │
│                                                                         │
│  Registered Vehicles (3)                        [+ Register New Vehicle]│
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ IMEI       │ VIN        │ Brand  │ Model │ Status   │ Actions     │ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │ 123456789  │ ABC123...  │ Toyota │ Camry │ ● Active │ [Edit]      │ │
│  │ 987654321  │ XYZ789...  │ Honda  │ Civic │ ● Active │ [Edit]      │ │
│  │ 456789123  │ DEF456...  │ Ford   │ Focus │ ○ Inactive│ [Edit]     │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### User Dashboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Logo] FleetPulse              Welcome, John Doe        [Profile ▼]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────┐  ┌─────────┐             │
│  │ Select Vehicle: Toyota Camry (ABC123) ▼  │  │  Sync   │             │
│  └──────────────────────────────────────────┘  └─────────┘             │
│                                                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────┐ │
│  │ Vehicle Info        │  │ Fuel Level          │  │ Battery Health  │ │
│  │ Toyota Camry 2024   │  │ ████████░░ 78%      │  │ ● GOOD          │ │
│  │ Plate: ABC-1234     │  │                     │  │                 │ │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────┘ │
│                                                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────┐ │
│  │ Mileage             │  │ Vehicle State       │  │ Engine Status   │ │
│  │ 186,549 km          │  │ ● DRIVING           │  │ ● STABLE        │ │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────┘ │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     [Interactive Map]                            │   │
│  │                         📍                                       │   │
│  │                    Lat: 6.5574, Lng: 3.3843                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ▼ Diagnostic Trouble Codes (4)                                   │   │
│  │   ⚠ P0135 - O2 sensor heater circuit malfunction                │   │
│  │   ⚠ P0011 - Camshaft timing over-advanced                       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Document Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| Tech Lead | | | |
| Design Lead | | | |
| QA Lead | | | |

---

*End of Requirements Document*
