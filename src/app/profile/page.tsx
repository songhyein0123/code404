"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaHeart, FaEdit } from "react-icons/fa";

interface User {
    email: string;
    id: string; // 사용자 ID
    user_name: string; // 사용자 이름
    profile_url: string; // 프로필 이미지 URL
}

interface Post {
    id: string; // 게시물 ID
    title: string;
    created_at: string;
}

interface LikedPost {
    board_id: string; // 좋아요한 게시물의 ID
    created_at: string;
}

const MyPage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [posts, setPosts] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<LikedPost[]>([]);
    const [likedPostData, setLikedPostData] = useState<Post[]>([]);
    const [activeTab, setActiveTab] = useState<"profile" | "myPosts" | "likedPosts">("profile");

    const router = useRouter();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const fetchUserData = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.error("Error fetching user info:", error);
                return;
            }
            if (data.user) {
                const { user: supabaseUser } = data;
                const { data: userProfile, error: profileError } = await supabase
                    .from("User")
                    .select("user_name, profile_url")
                    .eq("id", supabaseUser.id)
                    .single();

                if (profileError) {
                    console.error("Error fetching user profile:", profileError);
                    return;
                }

                setUser({ ...supabaseUser, ...userProfile } as User);
                await fetchPostsAndLikes(supabaseUser.id); // 게시물과 좋아요 데이터 가져오기
            }
            setLoading(false);
        };

        const fetchPostsAndLikes = async (userId: string) => {
            try {
                // 사용자 게시물 가져오기
                const { data: userPosts, error: postsError } = await supabase
                    .from("Post") // 테이블 이름 변경
                    .select("*")
                    .eq("user_id", userId);
                if (postsError) throw postsError;
                setPosts(userPosts || []);

                // 좋아요한 게시물 가져오기
                const { data: userLikedPosts, error: likesError } = await supabase
                    .from("Like")
                    .select("board_id") // board_id 사용
                    .eq("user_id", userId); // user_id 사용
                if (likesError) throw likesError;
                setLikedPosts(userLikedPosts || []);

                // 좋아요한 게시물 데이터 가져오기
                const postIds = userLikedPosts?.map((likedPost) => likedPost.board_id).filter(Boolean) || []; // board_id 사용
                if (postIds.length > 0) {
                    // 배열이 비어있지 않을 때만 쿼리 실행
                    const { data: likedPostData, error: postDataError } = await supabase
                        .from("Post") // 테이블 이름 변경
                        .select("*")
                        .in("id", postIds); // 여기를 board_id로 변경
                    if (postDataError) throw postDataError;
                    setLikedPostData(likedPostData || []);
                }
            } catch (error) {
                console.error("Error fetching posts and likes:", error);
            }
        };

        fetchUserData();
    }, [supabase]);

    const handleLikeToggle = async (postId: string) => {
        if (!user) return;

        const isLiked = likedPosts.some((likedPost) => likedPost.board_id === postId);
        const newLikedPosts = isLiked
            ? likedPosts.filter((likedPost) => likedPost.board_id !== postId)
            : [...likedPosts, { board_id: postId, created_at: new Date().toISOString() }];

        setLikedPosts(newLikedPosts);

        try {
            if (isLiked) {
                await supabase.from("Like").delete().eq("board_id", postId).eq("user_id", user.id);
            } else {
                await supabase.from("Like").insert([{ board_id: postId, user_id: user.id }]);
            }
        } catch (error) {
            console.error(`Error ${isLiked ? "unliking" : "liking"} post:`, error);
            setLikedPosts(likedPosts); // 오류 시 원래 상태로 복원
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return (
                    <div>
                        <h3 className="text-lg font-bold mb-2">회원정보변경</h3>
                        <p>여기에 회원정보변경 폼이 들어갈 예정입니다.</p>
                    </div>
                );
            case "myPosts":
                return (
                    <div>
                        <h3 className="text-lg font-bold mb-2">작성한 게시글</h3>
                        {posts.length === 0 ? (
                            <p>작성한 게시물이 없습니다.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {posts.map((post) => (
                                    <div key={post.id} className="border p-4 rounded-lg">
                                        <h4 className="font-bold">{post.title}</h4>
                                        <p>{new Date(post.created_at).toLocaleString()}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <button
                                                className="text-blue-500"
                                                onClick={() => router.push(`/posts/edit/${post.id}`)}
                                            >
                                                <FaEdit /> 수정하기
                                            </button>
                                            <button className="text-red-500" onClick={() => handleLikeToggle(post.id)}>
                                                <FaHeart />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case "likedPosts":
                return (
                    <div>
                        <h3 className="text-lg font-bold mb-2">좋아요한 게시글</h3>
                        {likedPostData.length === 0 ? (
                            <p>좋아요한 게시물이 없습니다.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {likedPostData.map((likedPost) => (
                                    <div key={likedPost.id} className="border p-4 rounded-lg">
                                        <h4 className="font-bold">{likedPost.title}</h4>
                                        <p>{new Date(likedPost.created_at).toLocaleString()}</p>
                                        <button className="text-red-500" onClick={() => handleLikeToggle(likedPost.id)}>
                                            <FaHeart />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return <p>로딩 중...</p>;
    }

    return (
        <div className="container mx-auto mt-20">
            <div className="flex flex-col items-center mb-4">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    {user?.profile_url ? (
                        <img src={user.profile_url} alt="Profile" className="rounded-full w-full h-full object-cover" />
                    ) : (
                        <p>사진 없음</p>
                    )}
                </div>
                <h1 className="text-2xl font-bold mt-4">{user?.user_name}</h1>
                <p className="text-gray-600">{user?.email}</p>
            </div>
            <div className="flex mb-4">
                {["profile", "myPosts", "likedPosts"].map((tab) => (
                    <button
                        key={tab}
                        className={`flex-1 py-2 ${
                            activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"
                        } rounded`}
                        onClick={() => setActiveTab(tab as "profile" | "myPosts" | "likedPosts")}
                    >
                        {tab === "profile" ? "회원정보" : tab === "myPosts" ? "내 게시글" : "좋아요한 게시글"}
                    </button>
                ))}
            </div>
            <div>{renderContent()}</div>
        </div>
    );
};

export default MyPage;
