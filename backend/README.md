# Backend API Documentation

## Overview
This is a Node.js/Express backend API for the ReactNative App with MongoDB integration.

## Features
- User autentication and management
- Product management
- RESTful API endpoints
- MongoDB database integration
- Error handling and validation
- CORS support

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance like MongoDB Atlas)

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the backend folder with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/reactnative_app
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:8081
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will run on the port specified in `.env` (default: 5000).

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Health Check
- **GET** `/health`
  - Response: Server status and uptime

### User Endpoints

#### Get All Users
- **GET** `/users`
  - Returns list of all users
  - Response: `{ success: true, data: [...], count: number }`

#### Get User by ID
- **GET** `/users/:id`
  - Returns specific user
  - Response: `{ success: true, data: {...} }`

#### Create User
- **POST** `/users`
  - Body: `{ username, email, password, firstName, lastName, phone }`
  - Response: `{ success: true, message: "User created", data: {...} }`

#### Update User
- **PUT** `/users/:id`
  - Body: `{ username, email, firstName, lastName, phone, isActive }`
  - Response: `{ success: true, message: "User updated", data: {...} }`

#### Delete User
- **DELETE** `/users/:id`
  - Response: `{ success: true, message: "User deleted", data: {...} }`

#### Login
- **POST** `/users/login`
  - Body: `{ email, password }`
  - Response: `{ success: true, message: "Login successful", data: {...} }`

### Product Endpoints

#### Get All Products
- **GET** `/products`
  - Query parameters:
    - `category`: Filter by category
    - `minPrice`: Minimum price filter
    - `maxPrice`: Maximum price filter
    - `search`: Search by name or description
  - Response: `{ success: true, data: [...], count: number }`

#### Get Product by ID
- **GET** `/products/:id`
  - Response: `{ success: true, data: {...} }`

#### Create Product
- **POST** `/products`
  - Body: `{ name, description, price, category, stock, sku, image }`
  - Response: `{ success: true, message: "Product created", data: {...} }`

#### Update Product
- **PUT** `/products/:id`
  - Body: `{ name, description, price, category, stock, sku, image, isActive, rating }`
  - Response: `{ success: true, message: "Product updated", data: {...} }`

#### Delete Product
- **DELETE** `/products/:id`
  - Response: `{ success: true, message: "Product deleted", data: {...} }`

#### Add Product Review
- **POST** `/products/:id/reviews`
  - Body: `{ userId, comment, rating }`
  - Response: `{ success: true, message: "Review added", data: {...} }`

## Database Models

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  firstName: String,
  lastName: String,
  phone: String,
  isActive: Boolean,
  role: String (user/admin),
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  name: String (required),
  description: String,
  price: Number (required),
  category: String,
  stock: Number,
  sku: String,
  image: String,
  isActive: Boolean,
  rating: Number,
  reviews: [{
    userId: ObjectId,
    comment: String,
    rating: Number,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Project Structure
```
backend/
├── server.js              # Main server entry point
├── package.json           # Project dependencies
├── .env.example           # Environment configuration template
├── models/                # MongoDB schemas
│   ├── User.js
│   └── Product.js
├── routes/                # API endpoints
│   ├── users.js
│   ├── products.js
│   └── health.js
└── docs/                  # Documentation
```

## Error Handling
All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Security Features
- Password hashing with bcryptjs
- CORS protection
- Input validation
- Error handling middleware

## Development Tips
1. Use MongoDB Compass to visualize your database
2. Test endpoints using Postman or Thunder Client
3. Set NODE_ENV=development for detailed error messages
4. Use nodemon for automatic server restart during development

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or check your MongoDB Atlas connection string
- Verify MONGODB_URI in .env file

### Port Already in Use
- Change PORT in .env file
- Or kill the process using the port

## Next Steps
- Implement JWT authentication middleware
- Add more validation
- Set up unit tests
- Deploy to production server
