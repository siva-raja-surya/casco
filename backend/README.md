# COSCO Receipt Portal Backend

This is the Express.js and MongoDB backend for the Receipt Portal application.

## Setup Instructions

1.  **Install Dependencies**
    Navigate to the `backend` folder in your terminal and run:
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Create a `.env` file in the `backend` directory with the following content:
    ```env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/cosco_receipts
    JWT_SECRET=super_secret_key_change_this_in_production
    ```
    *Note: Make sure you have MongoDB installed and running locally, or use a MongoDB Atlas URI.*

3.  **Run the Server**
    ```bash
    npm start
    ```
    The server will start on `http://localhost:5000`.

## API Endpoints

### Authentication
- `POST /api/auth/otp/send` - Send OTP to email
- `POST /api/auth/otp/verify` - Verify OTP
- `POST /api/auth/admin/login` - Admin Login (returns JWT)
- `POST /api/auth/admin/register` - Create initial admin account

### Requests
- `POST /api/requests` - Submit a new receipt request
- `GET /api/requests` - Get all requests (Admin)
- `PATCH /api/requests/:id/status` - Update request status (Admin)
