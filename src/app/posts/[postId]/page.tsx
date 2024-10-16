"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Modal from "../modal";
import { FaFlag, FaTrash, FaHeart } from "react-icons/fa";

interface User {
    user_name: string;
}

interface Post {
    board_id: string;
    title: string;
    content: string;
    created_at: string;
    hashtags: string[];
    user_id: string;
    user_name?: string;
}

interface PostWithUser extends Post {
    users?: User;
    likes?: number; // 좋아요 수 추가
}

const PostDetailPage = () => {
    const { postId } = useParams() as { postId: string };
    const router = useRouter();
    const [post, setPost] = useState<PostWithUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [likes, setLikes] = useState<number>(0); // 좋아요 수 상태 추가
    const [userLikesPost, setUserLikesPost] = useState<boolean>(false); // 사용자가 좋아요를 눌렀는지 상태 추가

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        if (postId) {
            fetchPost();
            fetchLikes();
        }
    }, [postId]);

    const fetchPost = async () => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
            .from("Post")
            .select(
                `
                *,
                users:user_id (user_name),
                hashtags:Hashtag (hashtag)
            `
            )
            .eq("board_id", postId)
            .single();

        if (error) {
            setError("게시물을 불러오는 중 에러가 발생했습니다.");
        } else if (data) {
            const postData: PostWithUser = {
                ...data,
                user_name: data.users?.user_name,
                hashtags: data.hashtags ? data.hashtags.map((h: any) => h.hashtag) : [] // 해시태그 배열 설정
            };
            setPost(postData);
            setLikes(data.likes || 0); // 초기 좋아요 수 설정
        } else {
            setError("게시물을 찾을 수 없습니다.");
        }
        setLoading(false);
    };

    const fetchLikes = async () => {
        const { data: userData, error: userError } = await supabase.auth.getUser();

        const userId = userData.user?.id;

        const { data, error } = await supabase.from("Like").select("*").eq("board_id", postId);

        if (data) {
            setLikes(data.length);
            const { data: userLikesData } = await supabase
                .from("Like")
                .select("*")
                .eq("board_id", postId)
                .eq("user_id", userId)
                .single();

            setUserLikesPost(!!userLikesData);
        } else if (error) {
            console.error("Error fetching likes:", error);
            setError("좋아요 정보를 가져오는 중 에러가 발생했습니다.");
        }
    };

    const handleReportClick = async () => {
        const {
            data: { user }
        } = await supabase.auth.getUser();

        if (!user) {
            alert("로그인 후 신고할 수 있습니다.");
            router.push("/auth/login");
        } else {
            setIsModalOpen(true);
        }
    };

    const handleReportSubmit = async ({ report, board_id }: { report: string; board_id: string }) => {
        const {
            data: { user }
        } = await supabase.auth.getUser();

        if (!user) {
            alert("로그인 후 신고할 수 있습니다.");
            return;
        }

        const { error } = await supabase.from("Reported_Post").insert([
            {
                user_id: user.id,
                board_id: board_id,
                report: report
            }
        ]);

        if (error) {
            console.error("Error reporting post:", error);
            alert("신고하는 중 에러가 발생했습니다.");
        } else {
            alert("신고가 완료되었습니다.");
            setIsModalOpen(false);
        }
    };

    const handleDeletePost = async () => {
        if (!postId) return;

        if (window.confirm("정말 삭제하시겠습니까?")) {
            setDeleting(true);
            const { error } = await supabase.from("Post").delete().eq("board_id", postId);

            if (error) {
                console.error("Error deleting post:", error);
                setError("게시물 삭제 중 에러가 발생했습니다.");
            } else {
                console.log("게시물 삭제 성공");
                router.back();
            }
            setDeleting(false);
        }
    };

    const handleGoBack = () => {
        if (window.confirm("정말 뒤로 돌아가시겠습니까?")) {
            router.back();
        }
    };

    const handleLike = async () => {
        const {
            data: { user }
        } = await supabase.auth.getUser();

        if (!user) {
            alert("로그인 후 좋아요를 누를 수 있습니다.");
            return;
        }

        if (userLikesPost) {
            const { error } = await supabase.from("Like").delete().eq("board_id", postId).eq("user_id", user.id);

            if (error) {
                alert("좋아요 취소 중 에러가 발생했습니다.");
            } else {
                setLikes(likes - 1);
                setUserLikesPost(false);
            }
        } else {
            const { error } = await supabase.from("Like").insert([
                {
                    board_id: postId,
                    user_id: user.id
                }
            ]);

            if (error) {
                console.error("Error adding like:", error);
                alert("좋아요 중 에러가 발생했습니다.");
            } else {
                setLikes(likes + 1);
                setUserLikesPost(true);
            }
        }
    };

    return (
        <div className="bg-[#2B2D42] min-h-screen py-10">
            {" "}
            {/* 배경색을 다크 그레이로 설정 */}
            <main className="container mx-auto bg-white shadow-lg rounded-lg p-6 mt-16">
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : post ? (
                    <>
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={handleReportClick}
                                className="mr-2 p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                            >
                                <FaFlag /> {/* 신고하기 아이콘 */}
                            </button>
                            <button
                                onClick={handleDeletePost}
                                className={`p-2 ${
                                    deleting ? "bg-gray-400" : "bg-gray-300"
                                } text-black rounded-md hover:bg-gray-400 transition`}
                                disabled={deleting}
                            >
                                <FaTrash /> {/* 삭제 아이콘 */}
                            </button>
                        </div>
                        <div className="mb-4 p-4 bg-gray-200 rounded-lg">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">{post.title}</h1>
                            <p className="text-sm text-gray-600">
                                작성자: {post.user_name} | 작성 시간: {new Date(post.created_at).toLocaleString()}
                            </p>
                        </div>
                        <p className="text-lg mb-6 text-gray-700 leading-relaxed">{post.content}</p>
                        <div className="mb-4">
                            {post.hashtags.length > 0 && (
                                <p className="text-sm text-gray-500">해시태그: {post.hashtags.join(", ")}</p>
                            )}
                        </div>
                        <div className="flex items-center mb-4">
                            <button onClick={handleLike} className="flex items-center text-[#00D084]">
                                {" "}
                                {/* 버튼 배경색을 네온 그린으로 설정 */}
                                <FaHeart className={`mr-1 ${userLikesPost ? "text-red-600" : "text-gray-400"}`} />
                                {likes}
                            </button>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={handleGoBack}
                                className="mr-2 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                            >
                                뒤로 돌아가기
                            </button>
                            <button
                                onClick={() => {
                                    console.log("수정하기 버튼 클릭됨");
                                }}
                                className="px-4 py-2 bg-[#00D084] text-white rounded-md hover:bg-[#FF8A00] transition" // 버튼 배경색을 네온 그린으로 설정, 호버 색상을 오렌지로 설정
                            >
                                수정하기
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-center text-gray-500">게시물이 없습니다.</p>
                )}
            </main>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleReportSubmit}
                boardId={postId}
            />
        </div>
    );
};

export default PostDetailPage;
