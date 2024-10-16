import { AccountLoginInfo } from "@/app/types/Account";
import { signin, signinCheck } from "@/services/authService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const data: AccountLoginInfo = await request.json();
    const signinActivateCheck = await signinCheck(data);

    if (signinActivateCheck) {
        const signinResult = await signin(data);
        if (!signinResult.success) return NextResponse.json({ success: false, error: signinResult.error });
    } else {
        return NextResponse.json({ success: false, error: "비활성화된 계정임" });
    }

    return NextResponse.json({ success: true });
}
