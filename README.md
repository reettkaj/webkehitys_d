## Authentication & Authorization Rules

- Passwords are hashed using bcrypt before storing in database
- Login endpoint: POST /api/auth/login
- JWT is used for authentication
- Protected routes require Authorization header: Bearer <token>

Authorization rules:
- Users can update only their own account
- Users can delete only their own entries
- Only entry owner can update or delete entry
- JWT expires in 1 hour
