import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
    return await updateSession(request);
}

export const config = {
    matcher: ["/auth/:path*", "/profile/:path*", "/admin/:path*", "/main_board/new"]
};
