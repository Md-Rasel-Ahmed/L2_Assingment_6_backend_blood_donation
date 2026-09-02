import jwt, { SignOptions } from "jsonwebtoken"

export const createToken = async (
  payload: any,
  secret: string,
  expiresIn: SignOptions["expiresIn"]
) => {
  return jwt.sign({ data: payload }, secret, { expiresIn })
}