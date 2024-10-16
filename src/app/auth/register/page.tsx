"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { AccountInfo } from "@/app/types/Account";
import { useRouter } from "next/navigation";

const schema: z.ZodType<AccountInfo> = z
    .object({
        email: z.string().email({ message: "유효한 값이 아닙니다." }),
        password: z.string().min(6, { message: "유효한 값이 아닙니다.(최소 6글자 이상)" }),
        confirmPassword: z.string(),
        nickname: z
            .string()
            .regex(/^[가-힣]+$/, { message: "유효한 값이 아닙니다.(특수문자 제외 한글만)" })
            .min(4, { message: "유효한 값이 아닙니다.(최소 4글자 이상)" })
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "패스워드가 일치하지 않습니다.",
        path: ["confirmPassword"]
    });

const Register = () => {
    const router = useRouter();
    const { register, handleSubmit, formState } = useForm<AccountInfo>({
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            nickname: ""
        },
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data: AccountInfo) => {
        const response = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            console.log("성공");
            alert("회원가입을 축하드립니다!");
            router.replace("/auth/login");
        } else {
            console.log("실패");
            alert("네트워크 오류가 발생하였습니다.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-[100px] flex justify-center items-center">
            <div className="w-1/4 p-[30px] flex flex-col gap-[20px] rounded-md bg-[#181F38]">
                <span className="text-[25px] text-white font-semibold w-full text-center mb-3">회원가입</span>
                <div className="flex flex-col justify-start gap-[10px]">
                    <label className="text-[20px] text-white" htmlFor="이메일">
                        이메일
                    </label>
                    <input
                        className="border-[1px] border-solid border-black pl-3 py-2 rounded-md"
                        {...register("email")}
                        placeholder="이메일"
                        type="email"
                    />
                    {formState.errors.email && (
                        <span className="text-[12px] text-red-600">{formState.errors.email.message}</span>
                    )}
                </div>
                <div className="flex flex-col justify-start gap-[10px]">
                    <label className="text-[20px] text-white" htmlFor="비밀번호">
                        패스워드
                    </label>
                    <input
                        className="border-[1px] border-solid border-black pl-3 py-2 rounded-md"
                        {...register("password")}
                        placeholder="패스워드"
                        type="password"
                    />
                    {formState.errors.password && (
                        <span className="text-[12px] text-red-600">{formState.errors.password.message}</span>
                    )}
                </div>
                <div className="flex flex-col justify-start gap-[10px]">
                    <label className="text-[20px] text-white" htmlFor="비밀번호확인">
                        패스워드 확인
                    </label>
                    <input
                        className="border-[1px] border-solid border-black pl-3 py-2 rounded-md"
                        {...register("confirmPassword")}
                        placeholder="패스워드 확인"
                        type="password"
                    />
                    {formState.errors.confirmPassword && (
                        <span className="text-[12px] text-red-600">{formState.errors.confirmPassword.message}</span>
                    )}
                </div>
                <div className="flex flex-col justify-start gap-[10px]">
                    <label className="text-[20px] text-white" htmlFor="닉네임">
                        닉네임
                    </label>
                    <input
                        className="border-[1px] border-solid border-black pl-3 py-2 rounded-md"
                        {...register("nickname")}
                        placeholder="닉네임"
                        type="text"
                    />
                    {formState.errors.nickname && (
                        <span className="text-[12px] text-red-600">{formState.errors.nickname.message}</span>
                    )}
                </div>
                <button
                    className="mt-4 w-full bg-[#00D084] text-white py-2 rounded-md hover:bg-[#FFBA00] disabled:bg-gray-400"
                    disabled={!formState.isValid}
                    type="submit"
                >
                    가입하기
                </button>
            </div>
        </form>
    );
};

export default Register;
