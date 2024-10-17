"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { AccountLoginInfo } from "@/app/types/Account";
import { navigate, signinWithProvider } from "@/services/authService";

const schema: z.ZodType<AccountLoginInfo> = z.object({
    email: z.string().email({ message: "유효한 값이 아닙니다." }),
    password: z.string().min(6, { message: "유효한 값이 아닙니다.(최소 6글자 이상)" })
});

const Login = () => {
    const { register, handleSubmit, formState } = useForm<AccountLoginInfo>({
        mode: "onChange",
        defaultValues: {
            email: "",
            password: ""
        },
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data: AccountLoginInfo) => {
        const response = await fetch("/api/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        // 서버가 2xx 상태 코드인 경우에만 성공 처리
        if (response.ok) {
            const result = await response.json();

            if (result.success) {
                console.log("성공");
                alert("성공적으로 로그인 되었습니다.");
                navigate();
            } else if (result.error === "비활성화된 계정임") {
                alert("비활성화된 계정입니다. 관리자에게 문의하세요.");
            } else {
                console.log("실패");
                alert("아이디 또는 비밀번호를 확인하세요.");
            }
        } else {
            // 서버에서 2xx 외의 상태 코드를 반환하는 경우 (실패)
            console.log("response: ", response);
            console.error("로그인 실패");
            alert(`로그인 실패`);
        }
    };

    const handleSigninWithGithub = async () => {
        await signinWithProvider("github");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-[100px] flex justify-center items-center">
            <div className="w-1/4 p-[30px] flex flex-col gap-[20px] rounded-md bg-[#181F38]">
                <span className="text-[25px] text-white font-semibold w-full text-center mb-3">로그인</span>
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
                <button
                    className="mt-4 w-full bg-[#00D084] text-white py-2 rounded-md hover:bg-[#FFBA00] disabled:bg-gray-400"
                    disabled={!formState.isValid}
                    type="submit"
                >
                    로그인하기
                </button>
                <button
                    className="w-full bg-black text-white py-2 rounded-md"
                    type="button"
                    onClick={handleSigninWithGithub}
                >
                    깃허브 로그인
                </button>
            </div>
        </form>
    );
};

export default Login;
