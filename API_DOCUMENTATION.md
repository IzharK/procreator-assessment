# API Documentation & System Guide

This guide provides detailed instructions on how to interact with the **Service Booking Platform** via the REST API. It is designed for both Web (Admin Panel) and Mobile (Consumer App) developers.

---

## 🔐 Authentication & Roles

The API uses **JWT (JSON Web Tokens)** for security and role-based access control.

-   **Base URL**: `http://localhost:5000/api`
-   **Header**: `Authorization: Bearer <YOUR_TOKEN_HERE>`
-   **Roles**:
    -   `user`: Can browse services and manage their own bookings.
    -   `admin`: Full access to create/edit/delete services and manage all system bookings.

---

## 👤 1. Admin Startup Guide (Creating the First Admin)

For security, the Admin Panel does not allow "Public Admin Registration." To create your first admin user, follow these steps:

### Option A: Via cURL (Recommended for Testing)
Run this command in your terminal to create your first administrative account:

```bash
curl -X POST http://localhost:5000/api/auth/signup \
-H "Content-Type: application/json" \
-d '{
  "name": "Super Admin",
  "email": "admin@example.com",
  "password": "adminPassword123",
  "role": "admin"
}'
```

---

## 🔑 2. Authentication Endpoints

### User Signup (Mobile/Web)
`POST /auth/signup`
-   **Body**: `{"name": "...", "email": "...", "password": "...", "role": "user|admin"}`
-   **Roles**: Role defaults to `user` if not provided.

### User Login
`POST /auth/login`
-   **Body**: `{"email": "...", "password": "..."}`
-   **Response**: Returns the user object + `token`.

---

## 🛠️ 3. Service Management (Admin Panel Focus)

Authorized services for managing the platform catalog.

### List All Services
`GET /services`
-   **Auth**: Not required (Public).
-   **Description**: Returns a list of all available services.

### Create Service
`POST /services`
-   **Auth**: Admin Only.
-   **Body**: 
    ```json
    {
      "name": "Cloud Audit",
      "description": "Full system security review",
      "duration": 60,
      "price": 250
    }
    ```

### Update/Delete Service
`PUT /services/:id` | `DELETE /services/:id`
-   **Auth**: Admin Only.

---

## 📅 4. Booking Flow (Mobile Focus)

Endpoints for the customer booking experience.

### Create a Appointment
`POST /bookings`
-   **Auth**: User or Admin.
-   **Body**: `{"service": "<SERVICE_ID>", "date": "2026-10-10T14:30:00Z"}`

### My Bookings
`GET /bookings/mybookings`
-   **Auth**: Logged-in User.
-   **Description**: Returns only the bookings belonging to the authenticated user.

---

## 📊 5. Administrative Oversight (Admin Panel Focus)

### View All System Bookings
`GET /bookings/allbookings`
-   **Auth**: Admin Only.
-   **Description**: Returns a flat list of every booking in the system with populated User and Service details.

### Update Booking Status
`PUT /bookings/:id/status`
-   **Auth**: Admin Only.
-   **Body**: `{"status": "confirmed|completed|canceled"}`

---

## 📱 Mobile Developer Tips (Flutter)

-   **Base URL**: Use `http://10.0.2.2:5000/api` for Android Emulators.
-   **Token Persistence**: Store the token using `shared_preferences` immediately after a successful login/signup.
-   **Status Enums**: Possible booking statuses are `pending` (default), `confirmed`, `completed`, and `canceled`.

---

## ⚡ Error Codes Reference

-   `200/201`: Success / Resource Created.
-   `400`: Bad Request (Missing fields or invalid data).
-   `401`: Unauthorized (Invalid or missing token).
-   `403`: Forbidden (Role not allowed - e.g., User trying to create a service).
-   `404`: Not Found (Invalid ID or Route).
-   `500`: Server Error (Database connection or logic failure).
