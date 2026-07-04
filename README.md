# BistroReserve: Restaurant Reservation & Gourmet Portal

BistroReserve is a full-stack, professional web application designed for premium dining spaces. It allows guests to discover gourmet recipes, search world cuisines, and reserve tables instantly. It also provides restaurant administrators with a secure console to manage table inventory and review client reservations.

---

## ⚙️ Key Features

### 1. Guest & Discovery Features
*   **Professional Landing Page:** Hero showcase, dining features, live visual statistics, and guest reviews.
*   **Gourmet Dish Index (Menu):** Horizontal navigation bar supporting 37+ regional cuisines, search queries, and sliders highlighting general recommendations and Indian curry specialties.
*   **Place Specialty Finder:** Responsive grids displaying recipes matching selected regions (e.g. Italian, French, Mexican).
*   **Dish Detail Portal:** High-quality dish visuals, origin metadata, and table reservation shortcuts.

### 2. Table Reservation Wizard
*   **Dynamic Slot Allocation:** Guests choose dates, guests size, and active slots.
*   **Table Picker:** Pick specific tables (e.g., T2, T8) or opt for "Auto-Assign" to let the system select the best-fitting spot.
*   **Cancel Options:** Guests can cancel bookings directly from their reservation dashboard.

### 3. Administrator Console
*   **Table Inventory CRUD:** Create new tables, edit labels/capacities, or temporarily toggle a table's status (Active/Inactive).
*   **Live Booking Board:** Filter all reservations by date to coordinate table setups and client arrivals.
*   **Admin Cancellations:** Modify or cancel any reservation on behalf of guests.

### 4. Enterprise Security Controls
*   **Single-Admin Constraint:** Enforces a strict one-admin policy at the database level. Additional attempts to register administrator accounts are rejected.
*   **Admin Passcode Gate:** Restricts administrator signups using a secure passcode verification key.
*   **JWT Session Authorization:** Stateless cookie-based header tokens securing administrative actions.

---

## 🛠️ Tech Stack

### Backend
*   **Runtime:** Node.js (ES Modules syntax)
*   **Framework:** Express.js
*   **Database:** MongoDB via Mongoose ODM
*   **Security:** JSON Web Tokens (JWT) & BcryptJS password hashing
*   **Validation:** Express-Validator

### Frontend
*   **Library:** React (Vite environment)
*   **State Management:** Redux Toolkit & React-Redux
*   **Routing:** React Router DOM
*   **Styling:** Tailwind CSS (Light Mode layout, glassmorphic effects, Outfit typography)
*   **Sliders:** React-Slick & Slick-Carousel
*   **Icons:** Lucide-React

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have the following installed locally:
*   [Node.js](https://nodejs.org/) (v18+)
*   [MongoDB](https://www.mongodb.com/) (Running locally on default port `27017`)

---

### 2. Backend Installation & Launch

1.  Navigate to the `Backend` directory:
    ```bash
    cd Backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables by creating/checking the `.env` file:
    ```env
    PORT=----
    MONGO_URI=mongodb://localhost:27017/---------
    JWT_SECRET=--------------------------
    JWT_EXPIRES_IN=7d
    ADMIN_SECRET_KEY=-----------
    ```
4.  Seed the reference restaurant tables:
    ```bash
    npm run seed
    ```
5.  Start the Express server:
    ```bash
    npm run dev
    ```
    *The server starts listening on `http://localhost:5500`.*

---

### 3. Frontend Installation & Launch

1.  Navigate to the `Frontend` directory:
    ```bash
    cd ../Frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables by checking the `.env` file:
    ```env
    VITE_API_URL=http://localhost:5500/api
    VITE_MEAL_API_URL=https://www.themealdb.com/api/json/v1/1
    ```
4.  Launch the Vite development server:
    ```bash
    npm run dev
    ```
    *Open `http://localhost:5173` in your browser.*

---

## 🔒 Verification & Test Scenarios

### Test Scenario A: Registering as Admin
1.  Go to Sign Up (`/register`).
2.  Change Account Type to **Administrator**. An **Admin Security Passcode** field will display.
3.  Enter an incorrect passcode -> submit -> expect error: `"Invalid Admin Security Key"`.
4.  Enter the correct passcode `------` -> submit -> success! You are logged in and redirected to the Admin dashboard.

### Test Scenario B: Single-Admin Constraint
1.  Log out of the administrator account.
2.  Go back to Sign Up (`/register`).
3.  Try to register a *second* account with "Administrator" role and passcode `admin123`.
4.  Submit -> expect error: `"An administrator account already exists. Only one admin is allowed."`

### Test Scenario C: Making a Reservation
1.  Register a standard **Customer** account.
2.  Go to **Menu**, click any dish (e.g. *Matar Paneer*).
3.  In the detail view, click **Book Dinner Session** to redirect to the booking workspace.
4.  Select date, time slot, and guest count -> click **Check Availability**.
5.  Choose a table (or *Auto-Assign*) and click **Confirm Reservation**. The booking appears in the personal list.
