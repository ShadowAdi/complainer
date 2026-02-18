import { compare, hash } from "bcrypt";
export const hashPassword = async (password) => {
    const hashedPassword = await hash(password, 10);
    return hashedPassword;
};
export const comparePassword = async (real_password, hashed_password) => {
    const isPasswordCorrect = await compare(real_password, hashed_password);
    return isPasswordCorrect;
};
//# sourceMappingURL=password-utils.js.map