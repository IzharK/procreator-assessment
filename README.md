# MVP Service Booking Platform - Monorepo

This repository contains an end-to-end MVP (Minimum Viable Product) for a Service Booking Platform, created as part of the Technical Lead Assessment.

## Project Structure

- **`apps/api`**: Node.js Backend API (built with Express and MongoDB).
- **`apps/web`**: Web Admin Panel (built with React and Vite).
- **`apps/mobile`**: User-facing Mobile App (built with Flutter and Provider).

## Overall Architecture

- **Backend**: RESTful API for auth, service management, and booking logic.
- **Frontend Admin**: Management dashboard live at [service-booking-admin.netlify.app](https://service-booking-admin.netlify.app/).
- **Mobile Client**: Consumer-facing app for users to discover services and schedule appointments.
- **Persistence**: MongoDB Atlas for robust remote data storage.

## Setup Instructions

See the README files in individual directories for detailed setup:
- [API Setup](./apps/api/README.md)
- [Web Admin Setup](./apps/web/README.md)
- [Mobile Setup](./apps/mobile/README.md)

---

## 📖 Global Guides

- **[FINAL_WALKTHROUGH.md](./FINAL_WALKTHROUGH.md)**: **Mandatory Review** - System overview and features.
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**: All-encompassing API & System Guide.
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)**: Step-by-step local testing instructions.
- **[PROMPT_LOG.md](./PROMPT_LOG.md)**: Mandatory record of AI assistance.
- **[MONGODB_SETUP.md](./MONGODB_SETUP.md)**: Cloud Database setup instructions.

## Tech Stack

- **Backend**: Node.js, Express, Mongoose, JWT.
- **Web Admin**: React, Vite, Axios, Tailwind CSS.
- **Mobile App**: Flutter, Provider, HTTP.

## Implementation Details

- **Monorepo**: Centralized codebase with clear separation of concerns.
- **State Management**: Provider (Flutter) for consumer app.
- **Auth**: Token-based authentication (JWT).
- **Deployment**: Render/Netlify (Backend/Web) and Build-ready APK (Android).
