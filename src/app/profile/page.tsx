"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const MyPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                setUser(session.user);
            } else {
                setUser(null);
                router.push("/login"); // 로그인이 필요한 경우 로그인 페이지로 리다이렉트
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [router, supabase]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const {
                data: { user },
                error
            } = await supabase.auth.getUser();

            if (error) {
                console.error("Error fetching user info:", error);
                return;
            }

            if (user) {
                setUser(user);
            } else {
                router.push("/login"); // 로그인 페이지로 리다이렉트
            }
            setLoading(false);
        };

        fetchUserInfo();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>{user ? `${user.email}님의 마이페이지` : "로그인해주세요."}</h1>
            {/* 추가적인 사용자 정보 또는 게시물 섹션 */}
        </div>
    );
};

export default MyPage;
