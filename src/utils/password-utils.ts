import { compare, hash } from "bcrypt";

export const hashPassword=async (password:string)=>{
    const hashedPassword=await hash(password,10)
    return hashedPassword
}

export const comparePassword=async (real_password:string,hashed_password:string)=>{
    const isPasswordCorrect=await compare(real_password,hashed_password)
    return isPasswordCorrect
}