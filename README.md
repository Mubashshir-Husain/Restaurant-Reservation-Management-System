# BistroReserve: Restaurant Reservation & Gourmet Portal

BistroReserve is a full-stack restaurant reservation portal and gourmet recipe explorer. Guests can discover dishes, view regional specialties, and book tables instantly. Administrators can manage the restaurant's table configuration, check incoming guest bookings, and edit reservations.

---

## 🚀 Setup Instructions

### 1. Prerequisites
Ensure you have the following installed locally:
*   [Node.js](https://nodejs.org/) (v18+)
*   [MongoDB](https://www.mongodb.com/) (Running locally on the default port `27017` or via a cloud-hosted URI)

---

### 2. Backend Setup
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
    MONGO_URI=<YOUR_MONGODB_CONNECTION_URI>
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
4.  Seed the reference restaurant tables in the database:
    ```bash
    npm run seed
    ```
5.  Start the Express server:
    ```bash
    npm run dev
    ```
    *The server starts listening on `http://localhost:5500`.*

---

### 3. Frontend Setup
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

## 📋 Assumptions Made

1.  **Fixed Time Slots:** The restaurant operates on a fixed set of non-overlapping 90-minute time slots (e.g. 12:00, 13:30, 15:00, 19:00, 20:30, 22:00). Guests cannot book arbitrary custom timings (such as 12:15).
2.  **Single Restaurant Location:** The system manages table capacity and bookings for a single location.
3.  **Timezone Independence:** Dates are stored as plain strings in `YYYY-MM-DD` format and slot times as `HH:MM` strings, assuming bookings are processed relative to local restaurant time.
4.  **Single Administrator Rule:** Only one administrator account is allowed to exist in the database at any given time to safeguard configuration access.

---

## 🧠 Reservation & Availability Logic

### 1. Overlap Calculations
To check if two slots conflict, the system converts time strings (e.g., `"13:30"`) into minutes since midnight. Two intervals `[aStart, aEnd)` and `[bStart, bEnd)` overlap if:
$$\text{Overlap} = (\text{aStart} < \text{bEnd}) \land (\text{bStart} < \text{aEnd})$$
Where the default slot duration is set to 90 minutes.

### 2. Availability Wizard
When a guest queries available tables for a date and slot:
1.  The database fetches all active tables with a seating capacity greater than or equal to the requested guest size: `capacity >= guests`.
2.  It queries all confirmed reservations for the selected date and filters out tables with overlapping reservation slots.
3.  The remaining tables are returned to the frontend as available options.

### 3. Smart Auto-Assignment
If a guest does not select a specific table, the system auto-assigns the **smallest suitable table** that fits the party size. This preserves larger tables for larger groups.

### 4. Concurrency Safety
A unique compound database index is defined on `{ table: 1, date: 1, timeSlot: 1 }` filtered by `status: "confirmed"`. If two users concurrently attempt to book the same table/slot, the database rejects the second request, preventing double bookings.

---

## 👥 Role-Based Access (User vs Admin)

*   **Guest/Visitor:** Can view the landing page, browse recipe lists, filter by cuisine, and explore dish details. Must register or log in to make reservations.
*   **Customer (User):** Can access the booking wizard, check table availability, confirm reservations, and cancel their own bookings.
*   **Administrator (Admin):** 
    *   Can add, edit, or delete tables from the database.
    *   Can view all reservations, filter them by date, modify reservation settings, or cancel bookings on behalf of guests.

**Technical Enforcement:**
*   *Backend:* Middlewares (`requireAuth` and `requireAdmin`) intercept requests, verify the JWT, check the user's role in the database, and block unauthorized API access.
*   *Frontend:* The `Dashboard` component checks the logged-in user's profile role and dynamically renders either the `CustomerPanel` or the `AdminPanel`.

---

## ✉️ Email Confirmations & Reminders (Nodemailer)

*   **Instant Confirmation:** When a booking is confirmed, the system immediately dispatches an HTML-formatted confirmation email containing reservation details (date, slot, guest count, table label).
*   **24-Hour Reminder Scanner:** A background worker runs periodically on the server (default: every 5 minutes). It scans the database for confirmed bookings scheduled within the next 24 hours. If found, it emails a friendly dining reminder to the guest.
*   **Spam Prevention:** If a user makes a reservation less than 24 hours in advance, the system automatically flags `reminderSent: true` on creation. This prevents sending a redundant reminder email right after the confirmation email.

---

## ⚠️ Known Limitations

1.  **No Table Merging:** The system cannot automatically combine smaller adjacent tables (e.g., merging two 2-seat tables for a party of 4). Bookings must fit onto a single table.
2.  **Static Pre-Set Slots:** Guests cannot specify custom durations or custom booking times.
3.  **Local SMTP Preview:** If custom SMTP credentials are omitted, emails are routed to a mock Ethereal test inbox, and preview URLs are logged in the backend terminal instead of sending to real emails.

---

## 💡 Areas for Improvement (with more time)

1.  **Dynamic Table-Grouping Algorithm:** Implement logic to automatically merge smaller adjacent tables for larger guest counts when large tables are fully booked.
2.  **Flexible Booking Hours:** Allow guests to book arbitrary times and durations with dynamic slot calculation.
3.  **Real-Time Dashboard Updates:** Integrate WebSockets (Socket.io) to push instant notifications to the Admin board when bookings are made or cancelled.
4.  **Multi-Location / Venue Support:** Expand schemas to manage capacities across multiple restaurant branches.
5.  **Interactive Seating Map:** Build a visual floor plan in the frontend allowing guests to click and select tables visually.
