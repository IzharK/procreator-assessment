# Testing & Execution Guide: MVP Service Booking Platform

This guide walks you through the proper end-to-end testing sequence for all three modules (API, Web Admin, and Mobile App). 

---

## 🛠️ Step 1: Backend API Setup (The Core)

The backend must be running first for the frontend and mobile apps to communicate.

1.  **Environment Configuration**:
    Navigate to `apps/api` and ensure you have a `.env` file. You can use the provided `.env.example` as a template:
    ```bash
    PORT=5000
    MONGODB_URI=your_mongodb_atlas_uri
    JWT_SECRET=your_secret_key
    ```
    > [!IMPORTANT]
    > **Remote Backend Ready**: The project is now configured to use the live API at `https://service-booking-api-nzje.onrender.com/`. You no longer need to run the backend locally to test the Web or Mobile apps!

    > [!NOTE]
    > **What is `JWT_SECRET`?** 
    > Unlike the MongoDB URI, you don't "find" this on a dashboard. It's a secret string **you create** to sign tokens. For testing, you can use any random string like `supersecret123`, but for production, use a strong random key (e.g., `openssl rand -base64 32`).

2.  **Initialize Server**:
    ```bash
    cd apps/api
    npm install
    node index.js
    ```
    **Verification**: Open `http://localhost:5000/` in your browser. You should see: 
    `{"message": "Service Booking MVP API is running..."}`

---

## 🖥️ Step 2: Web Admin Panel (Management)

Test the administrative side of the platform.

1.  **Start the Web Dashboard**:
    ```bash
    cd apps/web
    npm install
    npm run dev
    ```
2.  **Testing Flow**:
    - **Login**: Go to `http://localhost:5173/login`. Use any email/password (since it's an MVP, you can create the first Admin account via a Postman request to `/api/auth/signup` with `role: "admin"`).
    - **Service Creation**: Once logged in, navigate to the Dashboard and verify the UI. 
    - **Admin Check**: Confirm you see the KPIs and the empty bookings table.

---

## 📱 Step 3: Mobile App (Consumer Flow)

Test the actual booking experience a customer would have.

1.  **Initialize Flutter**:
    ```bash
    cd apps/mobile
    flutter pub get
    flutter run
    ```
    > [!TIP]
    > Ensure your backend API is accessible from your mobile device/emulator. If using an Android Emulator, use `10.0.2.2:5000` instead of `localhost:5000` in the `auth_provider.dart` and `booking_provider.dart` files.

2.  **Testing Flow**:
    - **Sign Up**: Register a new user account in the app.
    - **Discovery**: You should see the service catalog (fetched from the API).
    - **Booking**: Pick a service, select a date/time, and click "Confirm Booking".
    - **Status Check**: Go to the "My Bookings" tab and verify the new entry appears with a "PENDING" status.

---

## 🔗 Step 4: End-to-End Verification

To confirm the full system integration:
1.  **Mobile -> Web**: After making a booking on the mobile app, refresh your **Web Admin Dashboard**.
2.  **Verification**: You should see the user's booking appear in the table with their name, service type, and selected date.
3.  **Web -> Mobile**: On the Web Admin dashboard, change the status of the booking (mock an "Update"). Verify it updates on the mobile "My Bookings" screen.

---

## 🧪 API Call Reference (Manual Testing)

If you'd like to test the API manually using **Postman** or **cURL**, use these examples:

### 1. User Signup
```bash
curl -X POST https://service-booking-api-nzje.onrender.com/api/auth/signup \
-H "Content-Type: application/json" \
-d '{"name": "Test User", "email": "test@example.com", "password": "password123", "role": "user"}'
```

### 2. User Login
```bash
curl -X POST https://service-booking-api-nzje.onrender.com/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email": "test@example.com", "password": "password123"}'
```
*Note: Copy the `token` from the response for the next steps.*

### 3. Fetch Services
```bash
curl -X GET https://service-booking-api-nzje.onrender.com/api/services
```

### 4. Create a Booking (Requires Token)
```bash
curl -X POST https://service-booking-api-nzje.onrender.com/api/bookings \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <YOUR_TOKEN_HERE>" \
-d '{"service": "<SERVICE_ID_HERE>", "date": "2026-10-10T10:00:00Z"}'
```

---

## 🧪 Troubleshooting Tips

- **CORS Issues**: If the Web app can't talk to the API, ensure `cors` is properly configured in `apps/api/index.js`.
- **Database Connection**: If the server crashes on start, check if your IP address is whitelisted in MongoDB Atlas or if your local MongoDB is running.
- **Port Conflicts**: If port `5000` or `5173` is taken, update the `.env` or `vite.config.js` respectively.

> [!CAUTION]
> Remember that the Mobile App and Web Admin depend on the Backend API. Always keep the API terminal running in the background!
