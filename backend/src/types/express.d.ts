// src/types/express.d.ts
declare namespace Express {
  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  }

  interface Request {
    user: User;
  }
}
