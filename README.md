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

### 5. Automated Email Communications (Nodemailer)
*   **Confirmation Mails:** Guests receive an immediate HTML-styled confirmation email upon booking.
*   **24-Hour Reminders:** A background worker scans the database and sends reminder emails 24 hours before reservation time.
*   **Developer Fallback (Ethereal):** If no SMTP settings are configured in `.env`, the system automatically provisions an Ethereal SMTP account and logs test-mail URLs in the console for instant browser previewing.

---

## 🛠️ Tech Stack

### Backend
*   **Runtime:** Node.js (ES Modules syntax)
*   **Framework:** Express.js
*   **Database:** MongoDB via Mongoose ODM
*   **Security:** JSON Web Tokens (JWT) & BcryptJS password hashing
*   **Mailing:** Nodemailer & Ethereal SMTP

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
*   [MongoDB](https://www.mongodb.com/) (Running locally on default port `27017` or a cloud-hosted URI)

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
3.  Configure environment variables by creating a `.env` file in the `Backend` directory:
    ```env
    PORT=5500
    MONGO_URI=<YOUR_MONGODB_URI>
    JWT_SECRET=<YOUR_JWT_SECRET_KEY>
    JWT_EXPIRES_IN=7d
    ADMIN_SECRET_KEY=<YOUR_ADMIN_REGISTRATION_PASSCODE>

    # Optional Custom SMTP settings (Fallback utilizes Ethereal SMTP)
    SMTP_HOST=<YOUR_SMTP_SERVER>
    SMTP_PORT=<YOUR_SMTP_PORT>
    SMTP_USER=<YOUR_SMTP_USERNAME_EMAIL>
    SMTP_PASS=<YOUR_SMTP_PASSWORD>
    SMTP_FROM="BistroReserve" <YOUR_SENDER_EMAIL>
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
3.  Configure environment variables by creating a `.env` file in the `Frontend` directory:
    ```env
    VITE_API_URL=<YOUR_BACKEND_SERVER_API_ENDPOINT>
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
4.  Enter the correct passcode configured as `ADMIN_SECRET_KEY` -> submit -> success! You are logged in and redirected to the Admin dashboard.

### Test Scenario B: Single-Admin Constraint
1.  Log out of the administrator account.
2.  Go back to Sign Up (`/register`).
3.  Try to register a *second* account with "Administrator" role and your correct passcode.
4.  Submit -> expect error: `"An administrator account already exists. Only one admin is allowed."`

### Test Scenario C: Table Reservation & Email Logging
1.  Register a standard **Customer** account.
2.  Go to **Menu**, click any dish (e.g. *Matar Paneer*).
3.  In the detail view, click **Book Dinner Session** to redirect to the booking workspace.
4.  Select date, time slot, and guest count -> click **Check Availability**.
5.  Choose a table (or *Auto-Assign*) and click **Confirm Reservation**.
6.  Check the backend console. You will see a success log with an **Ethereal email preview link** (if not using custom SMTP) allowing you to inspect the HTML confirmation sent to your registered guest.
