# Friends Connect - MERN Stack Application

A full-stack social networking application built with the MERN stack that allows users to connect with friends, manage friend requests, and discover new connections through recommendations.

## 🌟 Features

- 👤 User Authentication (Sign up/Login)
- 🔍 Search for Users
- 👥 Send/Accept/Reject Friend Requests
- 📋 Friend List Management
- 💡 Friend Recommendations based on mutual connections
- 📱 Responsive Design for all devices

## 🚀 Tech Stack

- **Frontend:**
  - React.js with TypeScript
  - Redux Toolkit for state management
  - Tailwind CSS for styling
  - Framer Motion for animations
  - Lucide React for icons

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB for database
  - JWT for authentication

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Set up environment variables:
   - Create `.env` file in the backend directory:
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

4. Start the development servers:
   ```bash
   npm run dev
   ```

## 🌐 Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation

## 📁 Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── services/
│   │   └── types/
└── backend/
    ├── src/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   ├── middleware/
    │   └── utils/
```

## 🔒 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Users
- GET `/api/users/search` - Search users
- GET `/api/users/recommendations` - Get friend recommendations

### Friends
- POST `/api/friends/request` - Send friend request
- PUT `/api/friends/accept/:requestId` - Accept friend request
- PUT `/api/friends/reject/:requestId` - Reject friend request
- DELETE `/api/friends/:friendId` - Remove friend

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.