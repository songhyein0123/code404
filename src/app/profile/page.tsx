"use client";

import "../../app/globals.css";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import ProfileForm from "./components/ProfileForm";
import Posts from "./components/Posts";
import LikedPosts from "./components/LikePosts";
import Image from "next/image";

interface User {
    id: string;
    email: string;
    user_name: string;
    profile_url: string;
}

const ProfilePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"profile" | "myPosts" | "likedPosts">("profile");
    const supabase = createClient();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.error("Error fetching user info:", error);
                return;
            }
            if (data.user) {
                const { user: supabaseUser } = data;
                const { data: userProfile, error: profileError } = await supabase
                    .from("User")
                    .select("user_name, profile_url, email")
                    .eq("id", supabaseUser.id)
                    .single();

                if (profileError) {
                    console.error("Error fetching user profile:", profileError);
                    return;
                }

                setUser({
                    id: supabaseUser.id,
                    email: supabaseUser.email ?? "",
                    user_name: userProfile.user_name ?? "",
                    profile_url: userProfile.profile_url ?? ""
                });
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p className="text-black">로딩 중...</p>;
    }

    return (
        <div className="bg-[#2B2D42] min-h-screen py-10">
            <div className="container mx-auto mt-14 bg-white text-white p-6 rounded-lg">
                <div className="flex flex-col items-center mb-4">
                    <div className="w-40 h-40 rounded-full bg-white flex items-center justify-center">
                        {user?.profile_url ? (
                            <Image
                                src={user.profile_url}
                                alt="Profile"
                                className="rounded-full w-full h-full object-cover"
                                width={160}
                                height={160}
                            />
                        ) : (
                            <p>사진 없음</p>
                        )}
                    </div>
                    <h1 className="text-2xl font-bold mt-4 text-black">{user?.user_name}</h1>
                </div>
                <div className="flex mb-8">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`px-4 py-2 rounded ${
                            activeTab === "profile" ? "bg-neonGreen text-black" : "bg-gray-600 text-white"
                        } hover:bg-orange transition duration-300 shadow-md hover:shadow-lg`}
                    >
                        프로필
                    </button>
                    <button
                        onClick={() => setActiveTab("myPosts")}
                        className={`px-4 py-2 rounded ml-2 ${
                            activeTab === "myPosts" ? "bg-neonGreen text-black" : "bg-gray-600 text-white"
                        } hover:bg-orange transition duration-300 shadow-md hover:shadow-lg`}
                    >
                        작성한 게시글
                    </button>
                    <button
                        onClick={() => setActiveTab("likedPosts")}
                        className={`px-4 py-2 rounded ml-2 ${
                            activeTab === "likedPosts" ? "bg-neonGreen text-black" : "bg-gray-600 text-white"
                        } hover:bg-orange transition duration-300 shadow-md hover:shadow-lg`}
                    >
                        좋아요한 게시글
                    </button>
                </div>
                {activeTab === "profile" && <ProfileForm user={user} setUser={setUser} fetchUserData={fetchUserData} />}
                {activeTab === "myPosts" && user?.id && <Posts userId={user.id} />}
                {activeTab === "likedPosts" && user?.id && <LikedPosts userId={user.id} />}
            </div>
        </div>
    );
};

export default ProfilePage;
