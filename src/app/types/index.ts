import { Role } from "../../generated/prisma/enums";
export interface CustomUser {
  userId: string;
  email: string;
  role: Role;
}
declare global {
  namespace Express {
   
    interface Request {
     user?: CustomUser & Record<string, any>;
    }
  }
}


export {};