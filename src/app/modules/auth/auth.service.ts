import { prisma } from "../../lib/prisma"

const singup = async(payload:any)=>{
    const isExistUser=await prisma.user.findUnique({
        where:{
            email:payload.email
        }
    })

}

export const AuthService ={
    singup
}