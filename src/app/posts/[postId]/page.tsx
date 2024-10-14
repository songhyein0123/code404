"use client"; // 클라이언트 컴포넌트로 설정

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Modal from "../modal";

interface User {
    user_name: string;
}

interface Post {
    board_id: string;
    title: string;
    content: string;
    created_at: string; // 작성 시간 추가
    hashtags: string[]; // 해시태그 추가
    user_id: string; // 작성자 ID
    user_name?: string; // 작성자 이름 (선택적)
}

interface PostWithUser extends Post {
    users?: User; // users 속성 추가
}

const PostDetailPage = () => {
    const { postId } = useParams() as { postId: string };
    const router = useRouter();
    const [post, setPost] = useState<PostWithUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [reportContent, setReportContent] = useState<string>("");

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        if (postId) {
            fetchPost();
        }
    }, [postId]);

    // 게시물 가져오기
    const fetchPost = async () => {
        setLoading(true);
        setError(null); // 에러 상태 초기화

        const { data, error } = await supabase
            .from("Post")
            .select(
                `
                *,
                users:user_id (user_name)
            `
            )
            .eq("board_id", postId)
            .single();

        if (error) {
            console.error("Error fetching post:", error);
            setError("게시물을 불러오는 중 에러가 발생했습니다.");
        } else if (data) {
            const postData: PostWithUser = {
                ...data,
                user_name: data.users?.user_name // 작성자 이름 추가
            };
            setPost(postData);
        } else {
            setError("게시물을 찾을 수 없습니다.");
        }
        setLoading(false);
    };

    // 신고 처리 함수
    const handleReportSubmit = async () => {
        const {
            data: { user }
        } = await supabase.auth.getUser();

        if (!user) {
            alert("로그인 후 신고할 수 있습니다.");
            return;
        }

        if (window.confirm("정말 신고하시겠습니까?")) {
            const { error } = await supabase.from("Reported_Post").insert([
                {
                    user_id: user.id,
                    board_id: postId, // 신고하려는 게시물의 ID
                    report: reportContent // 신고 내용
                }
            ]);

            if (error) {
                console.error("Error reporting post:", error);
                alert("신고하는 중 에러가 발생했습니다.");
            } else {
                alert("신고가 완료되었습니다.");
                setIsModalOpen(false); // 모달 닫기
            }
        }
    };

    // 게시물 삭제 처리 함수
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

    // 뒤로 가기
    const handleGoBack = () => {
        if (window.confirm("정말 뒤로 돌아가시겠습니까?")) {
            router.back();
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen py-10">
            <main className="container mx-auto bg-white shadow-lg rounded-lg p-6 mt-16">
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : post ? (
                    <>
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="mr-2 px-2 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition"
                            >
                                신고하기
                            </button>
                            <button
                                onClick={handleDeletePost}
                                className={`px-2 py-1 ${
                                    deleting ? "bg-gray-400" : "bg-gray-300"
                                } text-black rounded-md text-sm hover:bg-gray-400 transition`}
                                disabled={deleting}
                            >
                                {deleting ? "삭제 중..." : "삭제"}
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
                            {post.hashtags && post.hashtags.length > 0 && (
                                <p className="text-sm text-gray-500">해시태그: {post.hashtags.join(", ")}</p>
                            )}
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
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                            >
                                수정하기
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-center text-gray-500">게시물을 찾을 수 없습니다.</p>
                )}
            </main>

            {/* 신고하기 모달 */}
            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleReportSubmit} // 신고하기
                >
                    <h2 className="text-xl font-bold mb-4">신고 사유를 작성해주세요</h2>
                    <textarea
                        value={reportContent}
                        onChange={(e) => setReportContent(e.target.value)}
                        className="w-full h-40 p-2 border rounded-lg"
                        placeholder="신고 사유를 입력하세요."
                    />
                    <button
                        onClick={handleReportSubmit}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    >
                        신고하기
                    </button>
                </Modal>
            )}
        </div>
    );
};

export default PostDetailPage;
