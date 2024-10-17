"use server";

import { AccountInfo, AccountLoginInfo } from "@/app/types/Account";
import { User } from "@/app/types/User";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getUserData } from "./dbService";
import { redirect } from "next/navigation";
import { BASE_PROFILE_URL } from "@/utils/network/config";
import { Provider } from "@supabase/supabase-js";

export async function signup(data: AccountInfo) {
    const { email, password } = data;
    const supabase = createClient();

    const info = {
        email: email as string,
        password: password as string
    };

    const { error } = await supabase.auth.signUp({
        ...info,
        options: {
            data: {
                user_name: data.nickname as string,
                profile_url: BASE_PROFILE_URL as string
            }
        }
    });

    return error ? { success: false, error: error.message } : { success: true };
}

export async function signinCheck(data: AccountLoginInfo) {
    const supabase = createClient();

    const info = {
        email: data.email as string,
        password: data.password as string
    };

    const { data: user } = await supabase.auth.signInWithPassword(info);

    const { data: res } = await supabase.from("User").select("activate").eq("id", user.user?.id).single();
    await supabase.auth.signOut();

    return res?.activate;
}

export async function signin(data: AccountLoginInfo) {
    const supabase = createClient();

    const info = {
        email: data.email as string,
        password: data.password as string
    };

    const { error } = await supabase.auth.signInWithPassword(info);
    revalidatePath("/", "layout");

    return error ? { success: false, error: error.message } : { success: true };
}

export async function signout() {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();
    if (error) return { success: false, error: error.message };

    return { success: true };
}

export async function getUser() {
    const supabase = createClient();

    const { data } = await supabase.auth.getUser();
    const userId: undefined | string = data.user?.id;

    const user: User | null = await getUserData(userId);

    return user;
}

// 임시 방편 함수
export async function navigate() {
    revalidatePath("/", "layout");
    redirect("/");
}

export async function signinWithProvider(path: Provider) {
    const supabase = createClient();

    const { data } = await supabase.auth.signInWithOAuth({
        provider: path,
        options: {
            redirectTo: "https://code404-murex.vercel.app/auth/callback"
        }
    });

    if (data.url) {
        redirect(data.url); // use the redirect API for your server framework
    }
}
