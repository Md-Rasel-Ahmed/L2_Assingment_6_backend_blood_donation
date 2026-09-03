import { Role } from "../../../generated/prisma/enums"

export interface ISingup {
  name?:string,
  email:string,
  password?:string,
  phone?:string,
  district?:string,
  upazila?:string,
  address?:string,
  role:Role
}
export interface Ilogin {
  email:string,
  password:string
}