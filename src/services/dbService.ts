"use server";

import { User } from "@/app/types/User";
import { createClient } from "@/utils/supabase/server";

export async function getUserData(userId: undefined | string): Promise<User | null> {
    if (userId === undefined) return null;

    const supabase = createClient();

    const { data, error } = await supabase.from("User").select().eq("id", userId).single();

    if (error) {
        console.log("사용자 데이터 불러오기 오류", error);
        return null;
    }

    return data;
}
