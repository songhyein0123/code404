"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import TitleInput from "@/app/posts/edit/[postId]/_components/TitleInput";
import MarkdownEditor from "@/app/posts/edit/[postId]/_components/MarkdownEditor";
import HashtagInput from "@/app/posts/edit/[postId]/_components/HashtagInput";

interface PostData {
    title: string;
    content: string;
    hashtags: string[];
}

const EditPostPage = () => {
    const { postId } = useParams() as { postId: string };
    const router = useRouter();
    const supabase = createClient();

    const [post, setPost] = useState<PostData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (postId) {
            fetchPostData();
        }
    }, [postId]);

    const fetchPostData = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from("Post")
                .select("title, content")
                .eq("board_id", Number(postId)) // postId를 숫자로 변환하여 사용
                .single();

            if (error) throw error;

            if (data) {
                const { data: hashtagData, error: hashtagError } = await supabase
                    .from("Hashtag")
                    .select("hashtag")
                    .eq("board_id", Number(postId));

                if (hashtagError) throw hashtagError;

                setPost({
                    title: data.title,
                    content: data.content,
                    hashtags: hashtagData ? hashtagData.map((h: { hashtag: string }) => h.hashtag) : []
                });
            }
        } catch (err) {
            console.error("Error fetching post data:", err);
            setError("게시글 정보를 가져오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePost = async () => {
        if (!post) return;

        try {
            // Post 테이블에서 제목과 내용을 업데이트
            const { error: postError } = await supabase
                .from("Post")
                .update({
                    title: post.title,
                    content: post.content
                })
                .eq("board_id", Number(postId)); // postId를 숫자로 변환하여 사용

            if (postError) {
                console.error("Error updating post:", postError);
                alert("게시글 수정 중 오류가 발생했습니다.");
                return;
            }

            // 기존 해시태그 삭제
            const { error: deleteError } = await supabase.from("Hashtag").delete().eq("board_id", Number(postId)); // 해당 게시글의 해시태그 삭제

            if (deleteError) {
                console.error("Error deleting hashtags:", deleteError);
                alert("해시태그 삭제 중 오류가 발생했습니다.");
                return;
            }

            // 새로운 해시태그 추가
            const newHashtags = post.hashtags.map((hashtag) => ({
                board_id: Number(postId),
                hashtag: hashtag
            }));

            const { error: insertError } = await supabase.from("Hashtag").insert(newHashtags);

            if (insertError) {
                console.error("Error inserting hashtags:", insertError);
                alert("해시태그 추가 중 오류가 발생했습니다.");
                return;
            }

            alert("게시글이 성공적으로 수정되었습니다.");
            router.push(`/posts/${postId}`); // 게시글 상세 페이지로 리다이렉트
        } catch (err) {
            console.error("Error updating post:", err);
            alert("게시글 수정 중 오류가 발생했습니다.");
        }
    };

    if (loading) {
        return <p className="text-black">로딩 중...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="bg-[#2B2D42] min-h-screen py-10">
            <div className="container mx-auto mt-32 bg-white text-black p-6 rounded-lg">
                <h1 className="text-2xl font-bold mb-6">게시글 수정</h1>
                {post && (
                    <>
                        <TitleInput title={post.title} setTitle={(title) => setPost({ ...post, title })} />
                        <MarkdownEditor
                            content={post.content}
                            setContent={(content: string) => setPost({ ...post, content })} // content 상태를 업데이트
                        />
                        <HashtagInput
                            hashtags={post.hashtags}
                            setHashtags={(hashtags: string[]) => setPost({ ...post, hashtags })} // 정확한 타입 전달
                        />
                        <button
                            onClick={handleUpdatePost}
                            className="mt-4 px-4 py-2 bg-neonGreen text-black rounded hover:bg-orange transition duration-300"
                        >
                            게시글 수정
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default EditPostPage;
