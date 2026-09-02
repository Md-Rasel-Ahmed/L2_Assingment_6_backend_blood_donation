import jwt, { SignOptions } from "jsonwebtoken"

export const createToken = async (
  payload: any,
  secret: string,
  expiresIn: SignOptions["expiresIn"]
) => {
  return jwt.sign({ data: payload }, secret, { expiresIn })
}

export const verifyToken=async(token:string,secret:string)=>{
  try {
     const verifiedToken=jwt.verify(token,secret)
     return {
      success:true,
      data:verifiedToken
     }
  } catch (error) {
    console.log("token verified failed");
    return {
      success:false,
      message:(error as Error).message
    }
  }
}