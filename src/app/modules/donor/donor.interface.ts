import { BloodGroup } from "../../../generated/prisma/enums";

export interface ICreateDonor {
  bloodGroup: BloodGroup;
  isAvailable?: boolean;
  lastDonatedAt?: string | Date;
  totalDonations?: number;
}