# Backend

This is the backend for the Book Fair Stall Reservation System, built with Node.js, Express, TypeScript, and Prisma.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MySQL database

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   - Copy `.env.example` to `.env`
   - Fill in the required environment variables:
     - `DATABASE_URL`: Your MySQL database connection string
     - `PORT`: Server port (default: 4000)
     - `NODE_ENV`: Environment (development/production)
     - `CLIENT_ORIGIN`: Frontend URL (default: http://localhost:5173)
     - `JWT_SECRET`: Secret key for JWT tokens
     - `JWT_EXPIRES_IN`: JWT expiration time (default: 7d)
     - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: Email configuration
     - `EMAIL_FROM`: Sender email address
     - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Cloudinary configuration for QR codes

3. **Database Setup:**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # (Optional) Seed the database
   npx prisma db seed
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```
This starts the server with hot reloading using nodemon.

### Production Mode
```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 4000).

## API Endpoints

The API provides endpoints for user authentication, stall management, and reservations. Base URL: `http://localhost:4000/api`

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Stalls
- `GET /api/stalls` - Get all stalls
- `GET /api/stalls/:id` - Get stall by ID

### Reservations
- `GET /api/reservations` - Get user's reservations
- `POST /api/reservations` - Create a new reservation
- `PUT /api/reservations/:id` - Update reservation
- `DELETE /api/reservations/:id` - Cancel reservation

## Project Structure

```
backend/
├── src/
│   ├── app.ts              # Express app setup
│   ├── server.ts           # Server entry point
│   ├── config/
│   │   ├── db.js           # Prisma client
│   │   └── env.ts          # Environment variables
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── types/              # TypeScript types
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── seed.ts             # Database seeding
│   └── migrations/         # Database migrations
├── .env                    # Environment variables
├── package.json
├── tsconfig.json
└── nodemon.json
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM for database management
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image hosting for QR codes
- **Nodemailer** - Email sending

## Development

- Use `npm run dev` for development with auto-restart
- The server will log database connection status on startup
- API routes are protected with JWT authentication where required
- QR codes are generated and stored in Cloudinary for reservations
