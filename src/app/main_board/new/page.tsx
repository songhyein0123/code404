"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaHeart, FaEdit } from "react-icons/fa";

interface User {
    email: string;
    id: string; // 사용자 ID (UUID)
    user_name: string; // 사용자 이름
    profile_url: string; // 프로필 이미지 URL
}

interface Post {
    board_id: string; // 게시물 ID (UUID)
    title: string;
    created_at: string;
    user_id: string; // 작성자 사용자 ID (UUID)
}

interface LikedPost {
    board_id: string; // 좋아요한 게시물의 ID (UUID)
    created_at: string; // 좋아요 생성 시간
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
                    .from("Post")
                    .select("*")
                    .eq("user_id", userId);
                if (postsError) throw postsError;
                setPosts(userPosts || []);

                // 좋아요한 게시물 가져오기
                const { data: userLikedPosts, error: likesError } = await supabase
                    .from("Like")
                    .select("board_id, created_at")
                    .eq("user_id", userId);
                if (likesError) throw likesError;
                setLikedPosts(userLikedPosts || []);

                // 좋아요한 게시물 데이터 가져오기
                const postIds = userLikedPosts?.map((likedPost) => likedPost.board_id).filter(Boolean) || [];
                if (postIds.length > 0) {
                    const { data: likedPostData, error: postDataError } = await supabase
                        .from("Post")
                        .select("*")
                        .in("board_id", postIds);
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

        // likedPosts에서 board_id가 postId와 같은 항목이 있는지 확인
        const isLiked = likedPosts.some((likedPost) => likedPost.board_id === postId);

        // UI 업데이트: 좋아요 목록에서 해당 게시물 제거 또는 추가
        if (isLiked) {
            // 좋아요 취소: 목록에서 게시물 제거
            setLikedPostData((prevLikedPostData) => prevLikedPostData.filter((post) => post.board_id !== postId));
            setLikedPosts((prevLikedPosts) => prevLikedPosts.filter((post) => post.board_id !== postId));
        } else {
            // 좋아요 추가: 게시물 데이터 추가
            const { data: addedPost, error: postError } = await supabase
                .from("Post")
                .select("*")
                .eq("board_id", postId)
                .single();

            if (postError) {
                console.error("Error fetching post data:", postError);
            } else {
                setLikedPostData((prevLikedPostData) => [...prevLikedPostData, addedPost]);
                setLikedPosts((prevLikedPosts) => [
                    ...prevLikedPosts,
                    { board_id: postId, created_at: new Date().toISOString() }
                ]);
            }
        }

        try {
            if (isLiked) {
                // 좋아요 취소: 서버에서 삭제
                await supabase.from("Like").delete().eq("board_id", postId).eq("user_id", user.id);
            } else {
                // 좋아요 추가: 서버에 삽입
                await supabase.from("Like").insert([{ board_id: postId, user_id: user.id }]);
            }
        } catch (error) {
            console.error(`Error ${isLiked ? "unliking" : "liking"} post:`, error);

            // 오류 발생 시 원래 상태로 복원
            if (isLiked) {
                const { data: restoredPost, error: restoreError } = await supabase
                    .from("Post")
                    .select("*")
                    .eq("board_id", postId)
                    .single();

                if (restoreError) {
                    console.error("Error restoring post data:", restoreError);
                } else {
                    setLikedPostData((prevLikedPostData) => [...prevLikedPostData, restoredPost]);
                    setLikedPosts((prevLikedPosts) => [
                        ...prevLikedPosts,
                        { board_id: postId, created_at: new Date().toISOString() }
                    ]);
                }
            } else {
                setLikedPostData((prevLikedPostData) => prevLikedPostData.filter((post) => post.board_id !== postId));
                setLikedPosts((prevLikedPosts) => prevLikedPosts.filter((post) => post.board_id !== postId));
            }
        }
    };

    // 게시글 클릭 시 해당 게시글로 이동
    const handlePostClick = (postId: string) => {
        router.push(`/posts/${postId}`); // 게시글 상세 페이지로 이동
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
                                    <div
                                        key={post.board_id}
                                        className="border p-4 rounded-lg"
                                        onClick={() => handlePostClick(post.board_id)}
                                    >
                                        <h4 className="font-bold">{post.title}</h4>
                                        <p>{new Date(post.created_at).toLocaleString()}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <button
                                                className="text-blue-500"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/posts/edit/${post.board_id}`);
                                                }}
                                            >
                                                <FaEdit /> 수정하기
                                            </button>
                                            <button
                                                className="text-red-500"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLikeToggle(post.board_id);
                                                }}
                                            >
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
                                    <div
                                        key={likedPost.board_id}
                                        className="border p-4 rounded-lg"
                                        onClick={() => handlePostClick(likedPost.board_id)}
                                    >
                                        <h4 className="font-bold">{likedPost.title}</h4>
                                        <p>{new Date(likedPost.created_at).toLocaleString()}</p>
                                        <button
                                            className="text-red-500"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleLikeToggle(likedPost.board_id);
                                            }}
                                        >
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
        <div className="container mx-auto mt-36 ">
            {" "}
            <div className="flex flex-col items-center mb-4">
                <div className="w-60 h-60 rounded-full bg-gray-200 flex items-center justify-center">
                    {" "}
                    {/* 프로필 이미지 크기를 키움 */}
                    {user?.profile_url ? (
                        <img src={user.profile_url} alt="Profile" className="rounded-full w-full h-full object-cover" />
                    ) : (
                        <p>사진 없음</p>
                    )}
                </div>
                <h1 className="text-2xl font-bold mt-4">{user?.user_name}</h1>
                <p className="text-gray-600">{user?.email}</p>
            </div>
            <div className="flex mb-8">
                <button
                    onClick={() => setActiveTab("profile")}
                    className={`px-4 py-2 ${
                        activeTab === "profile" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                    }`}
                >
                    프로필
                </button>
                <button
                    onClick={() => setActiveTab("myPosts")}
                    className={`px-4 py-2 ${
                        activeTab === "myPosts" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                    }`}
                >
                    작성한 게시글
                </button>
                <button
                    onClick={() => setActiveTab("likedPosts")}
                    className={`px-4 py-2 ${
                        activeTab === "likedPosts" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                    }`}
                >
                    좋아요한 게시글
                </button>
            </div>
            <div>{renderContent()}</div>
        </div>
    );
};

export default MyPage;
