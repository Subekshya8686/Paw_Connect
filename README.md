# PawConnect - Pet Adoption Platform

A comprehensive web application for pet adoption and fostering, built with React and Node.js.

## Features

- **Pet Management**: Browse, search, and manage available pets for adoption
- **User Authentication**: Secure login and registration system with role-based access
- **Adoption & Foster Applications**: Complete application forms for pet adoption and fostering
- **User Profiles**: Manage user profiles and bookmarked pets
- **Admin Dashboard**: Comprehensive admin panel for managing pets, users, and applications
- **Responsive Design**: Modern, mobile-friendly interface

## Tech Stack

### Frontend
- React 18 with Vite
- React Router DOM for navigation
- TanStack Query (React Query) for data fetching
- Material-UI (MUI) components
- Tailwind CSS for styling
- React Hook Form for form handling

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- Multer for file uploads
- Nodemailer for email functionality

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Start the backend server: `cd server && npm start`

## Environment Variables

Create a `.env` file in the root directory with:
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_UPLOAD_BASE_URL=http://localhost:5000/uploads
```

## Database

The application uses MongoDB. Make sure MongoDB is running locally or update the connection string in `server/config/db.js`.
