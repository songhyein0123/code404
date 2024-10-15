import { AccountInfo } from "@/app/types/Account";
import { signout, signup } from "@/services/authService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const data: AccountInfo = await request.json();

    const signupResult = await signup(data);
    if (!signupResult.success) return NextResponse.json({ success: false, error: signupResult.error });

    await signout(); // 회원가입 시 자동 인증 세션 등록 해제를 위한

    return NextResponse.json({ success: true });
}
