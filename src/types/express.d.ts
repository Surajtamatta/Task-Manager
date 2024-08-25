// types/express.d.ts

import { Request } from 'express';
import { User } from '../entities/User';

export interface AuthenticatedRequest extends Request {
  user: User; // Add the user property to the Request type
}
