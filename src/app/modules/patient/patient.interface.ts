export interface ICreateBloodRequest {
  patientId: string;
  patientName: string;
  bagsNeeded?: number;
  hospitalName: string;
  district: string;
  upazila: string;
  hospitalAddr: string;
  neededBy: string | Date;
  details?: string;
}