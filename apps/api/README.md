# Service Booking MVP - Backend API

This is the Node.js/Express backend for the Service Booking MVP.

## Tech Stack
- **Node.js**: Runtime environment.
- **Express.js**: Web framework.
- **MongoDB**: Database (via Mongoose).
- **JWT**: For secure authentication.

## Setup Instructions

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Variables**:
    Create a `.env` file based on `.env.example`:
    - `MONGODB_URI`: Your MongoDB Atlas connection string.
    - `JWT_SECRET`: A secret key for signing tokens.
3.  **Run in development**:
    ```bash
    node index.js
    ```

## API Endpoints

### Auth
- `POST /api/auth/signup`: Create a new account.
- `POST /api/auth/login`: Authenticate and receive a JWT.

### Services
- `GET /api/services`: List all services.
- `GET /api/services/:id`: Get service details.
- `POST /api/services`: (Admin only) Create a service.
- `PUT /api/services/:id`: (Admin only) Update a service.
- `DELETE /api/services/:id`: (Admin only) Delete a service.

### Bookings
- `GET /api/bookings/mybookings`: Get bookings for the authenticated user.
- `POST /api/bookings`: Create a new booking.
- `PUT /api/bookings/:id/cancel`: Cancel a booking.
- `GET /api/bookings/allbookings`: (Admin only) View all system bookings.
- `PUT /api/bookings/:id/status`: (Admin only) Update booking status.
