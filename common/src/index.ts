import zod from "zod";

//user
//signup
export const signupInputs = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6),
    name: zod.string().optional()
})
export type SignupInput = zod.infer<typeof signupInputs>    //this is for easy to frontend developer 

//signin
export const signinInputs = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6),
})
export type SigninInput = zod.infer<typeof signinInputs> 

//blog
//create
export const createBlog = zod.object({
    title: zod.string(),
    content: zod.string()
})
export type CreateBlog = zod.infer<typeof createBlog> 

//update
export const updateBlog = zod.object({
    title: zod.string(),
    content: zod.string(),
    id: zod.number()
})
export type UpdateBlog = zod.infer<typeof updateBlog> 
