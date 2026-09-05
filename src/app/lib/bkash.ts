import config from "../config"
import { AppError } from "../utils/AppError"
import { redisClient } from "./radis"

export const getBkashIdToken=async()=>{
   try {
     const bkashIdTokenKey="bkash:idToken"
    const bkashRefreshTokenKey="bkash:RefreshToken"

    const getRedisIdToken=await redisClient.get(bkashIdTokenKey)
    const getRedisRefreshToken=await redisClient.get(bkashRefreshTokenKey)

    const getRedisIdTokenTTL = await redisClient.ttl(getRedisIdToken as string)
     const getRedisRefreshTokenTTL=await redisClient.ttl(getRedisRefreshToken as string)

    let bkashidToken=getRedisIdToken

    if(getRedisIdTokenTTL<=600 && getRedisRefreshTokenTTL >=600){
         const response=await fetch(`${config.bkash_base_url}/tokenized/checkout/token/refresh`,{
        method:"POST",
        headers:{
           "Content-Type": "application/json",
            Accept:" application/json",
            username: config.bkash_username,
            password: config.bkash_password
        },
        body:JSON.stringify({
            app_key: config.bkash_app_key,
            app_secret: config.bkash_app_secret_key ,
            refresh_token:getRedisRefreshToken
        })

    })
    const result=await response.json()
    bkashidToken=result.id_token
    return bkashidToken
    }

    if(getRedisIdToken && getRedisRefreshToken){
 const response=await fetch(`${config.bkash_base_url}/tokenized/checkout/token/grant`,{
        method:"POST",
        headers:{
           "Content-Type": "application/json",
            Accept:" application/json",
            username: config.bkash_username,
            password: config.bkash_password
        },
        body:JSON.stringify({
            app_key: config.bkash_app_key,
            app_secret: config.bkash_app_secret_key 
        })

    })
    const result=await response.json()

    await redisClient.set(bkashIdTokenKey,result.id_token,{
        expiration:{
            type:"EX",
            value:3600
        }
    })
    await redisClient.set(bkashRefreshTokenKey,result.refresh_token,{
        expiration:{
            type:"EX",
            value:3600*24*28
        }
    })
    bkashidToken=result.id_token
    }

   
    return bkashidToken
   } catch (error) {
     throw new AppError(500,(error as Error).message)
   }
}