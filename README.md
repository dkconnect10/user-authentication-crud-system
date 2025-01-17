Here’s the requested information in plain text format for your `README.md` file without JSON file format:

---

# Secure User Management System

## Description
The **Secure User Management System** is a backend application built with **Node.js**, **Express.js**, and **MongoDB** to manage users securely. It incorporates **JWT authentication** with refresh tokens, **role-based access control (RBAC)**, **password management** features, and includes **CRUD operations** for user profiles. The system also provides **password reset functionality** via OTP (sent through email), with **data validation** using **express-validator**.

### Key Features:
1. **JWT Authentication and Authorization**: Secure API access using JWT tokens for user authentication and role-based authorization.
2. **Profile Management**: Allows users to update and retrieve their profiles.
3. **Password Management**: Users can reset their passwords using a time-limited OTP sent to their email.
4. **CRUD Operations**: Admin users can perform CRUD operations on any user, while normal users can only update their profiles.
5. **Soft Delete**: Soft delete users instead of permanently removing them, preserving data integrity.
6. **Input Validation**: Using express-validator to ensure data integrity and security across all inputs.
7. **Postman Documentation**: All API endpoints are documented with example requests and responses.

---

## Setup and Installation

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)
- [Postman](https://www.postman.com/) for testing API requests

### Installation Steps

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Create a `.env` file** in the root of the project with the following variables:
   ```
   ACCESS_TOKEN_KEY=your-access-token-secret
   REFRESH_TOKEN_KEY=your-refresh-token-secret
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USERNAME=your-email@example.com
   EMAIL_PASSWORD=your-email-password
   ```

4. **Run the application**:
   ```
   npm start
   ```

The server will start running on `http://localhost:8080`.

---

## API Endpoints

### 1. **User Registration** (`POST /api/v1/user/register`)
Registers a new user by providing name, email, and password.

#### Example Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Response:
```json
{
  "message": "User registered successfully."
}
```

---

### 2. **User Login** (`POST /api/v1/user/login`)
Allows a user to log in and receive a JWT access token and refresh token.

#### Example Request:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Response:
```json
{
  "accessToken": "your-access-token",
  "refreshToken": "your-refresh-token"
}
```

---

### 3. **Get User Profile** (`GET /api/v1/user/getUserProfile`)
Fetches the profile information of the authenticated user.

#### Example Request:
```bash
GET http://localhost:8080/api/v1/user/getUserProfile
Authorization: Bearer <access-token>
```

#### Response:
```json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "profileImage": "profile-image-url",
  "createdAt": "2025-01-01T12:00:00Z",
  "updatedAt": "2025-01-01T12:00:00Z"
}
```

---

### 4. **Update User Profile** (`PUT /api/v1/user/updateProfile`)
Allows a user to update their profile.

#### Example Request:
```json
{
  "name": "John Updated",
  "profileImage": "new-profile-image-url"
}
```

#### Response:
```json
{
  "message": "User profile updated successfully."
}
```

---

### 5. **Password Reset (Request OTP)** (`POST /api/v1/user/password-reset`)
Initiates the password reset process by sending a one-time OTP to the user's email.

#### Example Request:
```json
{
  "email": "john@example.com"
}
```

#### Response:
```json
{
  "message": "OTP sent to email successfully."
}
```

---

### 6. **Verify OTP** (`POST /api/v1/user/verify-otp`)
Verifies the OTP sent to the user's email and allows password reset.

#### Example Request:
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### Response:
```json
{
  "message": "OTP verified successfully."
}
```

---

### 7. **Reset Password** (`POST /api/v1/user/reset-password`)
Resets the user's password using the OTP verification.

#### Example Request:
```json
{
  "email": "john@example.com",
  "newPassword": "new-secure-password123"
}
```

#### Response:
```json
{
  "message": "Password reset successfully."
}
```

---

### 8. **Delete User by ID** (`DELETE /api/v1/user/delete/:id`)
Allows admin users to delete any user’s account by ID.

#### Example Request:
```bash
DELETE http://localhost:8080/api/v1/user/delete/12345
Authorization: Bearer <admin-access-token>
```

#### Response:
```json
{
  "message": "User deleted successfully."
}
```

---

## Conclusion
The **Secure User Management System** provides a simple yet powerful solution for managing users, ensuring that sensitive data is securely handled. It leverages modern technologies like JWT for authentication, MongoDB for data storage, and Nodemailer for email services. The system is designed to be flexible, scalable, and secure, with built-in password management, profile management, and administrative control.

