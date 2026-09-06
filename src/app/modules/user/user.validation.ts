import z from "zod"


export const updateUserDataSchema = z.object({
    body:z.object({
        name:z.string().min(1,"Name Is Required").optional(),
    phone:z.string().min(5,"Phone Number Must Be Atleast 5 Char").optional(),
    upazila:z.string().optional(),
    district:z.string().min(3).optional()
    })
})

