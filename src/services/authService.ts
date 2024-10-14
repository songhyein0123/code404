"use server";

import { AccountInfo } from "@/app/types/Account";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signup(data: AccountInfo) {
    const { email, password } = data;
    const supabase = createClient();

    const info = {
        email: email as string,
        password: password as string
    };

    const { error } = await supabase.auth.signUp(info);

    return error ? { success: false, error: error.message } : { success: true };
}

export async function signout() {
    const supabase = createClient();
    await supabase.auth.signOut();
}

export async function getUser() {
    const supabase = createClient();

    const { data, error } = await supabase.auth.getUser();

    // TODO: - 에러 핸들링

    return data;
}
