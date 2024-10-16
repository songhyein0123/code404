"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaHeart, FaEdit } from "react-icons/fa";

interface User {
    email: string;
    id: string;
    user_name: string;
    profile_url: string;
}

interface Post {
    board_id: string;
    title: string;
    created_at: string;
    user_id: string;
}

interface LikedPost {
    board_id: string;
    created_at: string;
}

const MyPage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [profilePic, setProfilePic] = useState<File | null>(null); // 프로필 사진 변경용
    const [newUserName, setNewUserName] = useState<string>(""); // 닉네임 변경용
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
                    .select("user_name, profile_url, email")
                    .eq("id", supabaseUser.id)
                    .single();

                if (profileError) {
                    console.error("Error fetching user profile:", profileError);
                    return;
                }

                setUser({ ...supabaseUser, ...userProfile } as User);
                setNewUserName(userProfile.user_name);
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

    // 프로필 사진 변경 처리
    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePic(e.target.files[0]);
        }
    };

    // 회원 정보 변경 처리
    // ...
    const handleProfileUpdate = async () => {
        if (!user || !user.id) {
            console.error("User ID is not defined");
            return;
        }

        try {
            let profile_url = user.profile_url;
            if (profilePic) {
                const fileExt = profilePic.name.split(".").pop();
                const fileName = `${user.id}.${fileExt}`;
                const filePath = `user_profile_img/${user.id}/${fileName}`;

                const { data, error } = await supabase.storage.from("user_profile_img").upload(filePath, profilePic, {
                    upsert: true
                });
                if (error) throw error;

                const { publicURL } = supabase.storage.from("user_profile_img").getPublicUrl(filePath);
                profile_url = publicURL || "";
            }

            const { error: updateError } = await supabase
                .from("User")
                .update({
                    user_name: newUserName,
                    profile_url
                })
                .eq("id", user.id);

            if (updateError) throw updateError;

            const { data: updatedUser, error: fetchError } = await supabase
                .from("User")
                .select("user_name, profile_url")
                .eq("id", user.id)
                .single();

            if (fetchError) throw fetchError;

            setUser(updatedUser);
            alert("회원 정보가 성공적으로 업데이트되었습니다.");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("회원 정보 업데이트 중 오류가 발생했습니다.");
        }
    };

    const handlePostClick = (postId: string) => {
        router.push(`/posts/${postId}`);
    };

    const handleLikeToggle = async (postId: string) => {
        if (!user) return;

        const isLiked = likedPosts.some((likedPost) => likedPost.board_id === postId);

        if (isLiked) {
            setLikedPostData((prevLikedPostData) => prevLikedPostData.filter((post) => post.board_id !== postId));
            setLikedPosts((prevLikedPosts) => prevLikedPosts.filter((post) => post.board_id !== postId));
        } else {
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
                await supabase.from("Like").delete().eq("board_id", postId).eq("user_id", user.id);
            } else {
                await supabase.from("Like").insert([{ board_id: postId, user_id: user.id }]);
            }
        } catch (error) {
            console.error(`Error ${isLiked ? "unliking" : "liking"} post:`, error);
        }
    };

    const renderProfileForm = () => {
        return (
            <div>
                <h3 className="text-lg font-bold mb-2">회원정보변경</h3>
                <div className="mb-4">
                    <label htmlFor="profilePic" className="block text-gray-700">
                        프로필 사진
                    </label>
                    <input type="file" id="profilePic" onChange={handleProfilePicChange} />
                </div>
                <div className="mb-4">
                    <label htmlFor="userName" className="block text-gray-700">
                        닉네임
                    </label>
                    <input
                        type="text"
                        id="userName"
                        className="border p-2 rounded w-full"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                    />
                </div>
                <button onClick={handleProfileUpdate} className="bg-blue-500 text-white px-4 py-2 rounded">
                    회원 정보 업데이트
                </button>
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return renderProfileForm();
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
        <div className="container mx-auto mt-32">
            <div className="flex flex-col items-center mb-4">
                <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center">
                    {user?.profile_url ? (
                        <img src={user.profile_url} alt="Profile" className="rounded-full w-full h-full object-cover" />
                    ) : (
                        <p>사진 없음</p>
                    )}
                </div>
                <h1 className="text-2xl font-bold mt-4">{user?.user_name}</h1>
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
