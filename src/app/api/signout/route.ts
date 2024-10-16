import { signout } from "@/services/authService";
import { NextResponse } from "next/server";

export async function POST() {
    const signoutResult = await signout();
    if (!signoutResult.success) return NextResponse.json({ success: false, error: signoutResult.error });

    return NextResponse.json({ success: true });
}
