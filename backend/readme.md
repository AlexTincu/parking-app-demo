
# Parking Management App

## Important

App created for demo purposes. Work in progress.

## Description

The Parking Management App is a Node.js API for managing parking locations, spots, and reservations. Users can search and reserve available parking spots, while administrators have capabilities for managing locations, updating pricing, viewing reservations, and tracking revenue.

---

## Table of Contents
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Technologies](#technologies)
- [License](#license)

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AlexTincu/parking-app-demo.git
   cd parking-management-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

---

## Environment Setup

Create a `.env` file in the root directory and add your environment variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Replace `your_mongodb_connection_string` and `your_jwt_secret` with your actual MongoDB URI and a secure string for the JWT secret.

---

## Usage

1. **Start the server**:
   ```bash
   npm start
   ```
   By default, the server runs on `http://localhost:5000`.

2. **API Endpoints**: Use the Postman collection included in the project to test the API endpoints (or create a new one using the API documentation below).

---

## API Documentation

The Parking Management API offers multiple endpoints for user and admin operations:
The Postman collection: https://www.postman.com/alextincu/workspace/parking-app-demo/collection/2252387-dd2241fa-77eb-4b3c-8dde-038eb310dda0?action=share&creator=2252387&active-environment=2252387-ebbfeaed-5765-4052-9ce4-9d6036f7f4af
### Authentication Endpoints

1. **Register**  
   - `POST /api/auth/register`
   - Register a new user (returns a JWT for authentication).

2. **Login**  
   - `POST /api/auth/login`
   - Login for existing users (returns a JWT for authentication).

### User Endpoints

1. **Find Parking Spots**
   - `GET /api/parking/find`
   - Find available parking spots based on location, date, and time.

2. **Reserve a Spot**
   - `POST /api/parking/reserve`
   - Reserve a specific parking spot.

3. **Cancel Reservation**
   - `DELETE /api/parking/cancel/:reservationId`
   - Cancel a reservation by ID.

### Admin Endpoints

1. **Add Parking Location**
   - `POST /api/admin/locations`
   - Add a new parking location (admin only).

2. **Update Pricing**
   - `PUT /api/admin/locations/:id/pricing`
   - Update pricing for a specific location (admin only).

3. **Add Parking Spot**
   - `POST /api/admin/spots`
   - Add a new parking spot to an existing location (admin only).

4. **View Reservations**
   - `GET /api/admin/reservations`
   - View all reservations (admin only).

5. **Track Revenue**
   - `GET /api/admin/revenue`
   - View revenue within a specified date range (admin only).

---

## Testing

To run tests, use the following command:

```bash
npm test
```

The tests include checks for authentication, parking spot reservation, and admin functionalities.

---

## Technologies

- Node.js
- Express
- MongoDB
- JWT Authentication
- Jest & Supertest for testing

---

## License

This project is licensed under the MIT License.
