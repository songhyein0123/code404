import { AccountLoginInfo } from "@/app/types/Account";
import { signin } from "@/services/authService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const data: AccountLoginInfo = await request.json();

    const signinResult = await signin(data);
    if (!signinResult.success) return NextResponse.json({ success: false, error: signinResult.error });

    return NextResponse.json({ success: true });
}
