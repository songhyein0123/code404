import { AccountInfo } from "@/app/types/Account";
import { signout, signup } from "@/services/authService";
import { addUser } from "@/services/dbService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const data: AccountInfo = await request.json();

    await signout(); // 회원가입 시, 에러 방지

    const signupResult = await signup(data);
    if (!signupResult.success) return NextResponse.json({ success: false, error: signupResult.error });

    const addUserResult = await addUser(data);
    if (!addUserResult.success) return NextResponse.json({ success: false, error: addUserResult.error });

    await signout(); // 회원가입 시 자동 인증 세션 등록 해제를 위한

    return NextResponse.json({ success: true });
}
