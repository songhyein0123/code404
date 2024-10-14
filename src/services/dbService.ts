"use server";

import { AccountInfo } from "@/app/types/Account";
import { BASE_PROFILE_URL } from "@/utils/network/config";
import { createClient } from "@/utils/supabase/server";

export async function addUser(data: AccountInfo) {
    const supabase = createClient();

    const { error } = await supabase.from("Users").insert({
        user_name: data.nickname as string,
        profile_url: BASE_PROFILE_URL as string,
        email: data.email as string,
        admin: false as boolean,
        activate: true as boolean
    });

    return error ? { success: false, error: error.message } : { success: true };
}
