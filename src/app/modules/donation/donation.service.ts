import config from "../../config"
import { getBkashIdToken } from "../../lib/bkash"
import { AppError } from "../../utils/AppError"
import { IRequestUser } from "../user/user.interface"
import httpStatus from "http-status"

const createDonation =async(user:IRequestUser)=>{
    const idToken=await getBkashIdToken()
     const response=await fetch(`${config.bkash_base_url}/tokenized/checkout/create`,{
        method:"POST",
        headers:{
           "Content-Type": "application/json",
             Accept:"application/json",
            authorization: idToken as string,
            "x-app-key":config.bkash_app_key
        },
        body:JSON.stringify({
  agreementID: "TokenizedMerchant01L3IKB6H1565072174986",
  mode: "0011",
  payerReference: "01723888888",
  callbackURL: "http://localhost:5000/api/v1/donation/bkash/payment/callback",
  merchantAssociationInfo: "MI05MID54RF09123456One",
  amount: "100",
  currency: "BDT",
  intent: "sale",
  merchantInvoiceNumber: user.userId,
        })
     })
     const result=await response.json()
    return result
}

const paymentCallback=async(query:Record<string,any>)=>{
   
const {paymentID,status}=query

if(!paymentID){
    throw new AppError(httpStatus.NOT_FOUND,"Payment Id Missing")
}
if(!status){
    throw new AppError(httpStatus.NOT_FOUND,"Payment Status Missing")
}

const bkashIdToken=await getBkashIdToken()
const response=await fetch(`${config.bkash_base_url}/tokenized/checkout/execute`,{
    method:"POST",
     headers:{
           "Content-Type": "application/json",
             Accept:"application/json",
            authorization: bkashIdToken as string,
            "x-app-key":config.bkash_app_key
        },
        body:JSON.stringify({
            paymentID
        })

})
const result=await response.json()
return result
}
export const DonationService={
    createDonation,
    paymentCallback
}