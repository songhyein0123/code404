export type AccountInfo = {
    email: string;
    password: string;
    confirmPassword: string;
    nickname: string;
};

export type AccountLoginInfo = Pick<AccountInfo, "email" | "password">;
