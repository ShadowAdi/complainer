export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePassword: (real_password: string, hashed_password: string) => Promise<boolean>;
