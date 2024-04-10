// custom.d.ts

import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        user_id: string;
        name:string;
        // You can add more properties here if needed
      };
    }
  }
}
