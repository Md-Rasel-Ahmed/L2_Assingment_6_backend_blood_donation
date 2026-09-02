import { Response } from "express"

type TMeta = {
    page:number,
    limit:number,
    total:number,
    totalPage:number
}

type TResponseDta <T> = {
    success:boolean,
    statusCode:number,
    message:string,
    data?:T,
    meta?:TMeta
}
export const sendResponse=<T>(res:Response,data:TResponseDta<T>)=>{
    res.status(data.statusCode).send({
          success:data.success,
          statusCode:data.statusCode,
          message:data.message,
          data:data.data

    })
}