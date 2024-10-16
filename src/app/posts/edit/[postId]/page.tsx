"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import TitleInput from "@/app/post/write/_components/TitleInput";
import MarkdownEditor from "@/app/post/write/_components/MarkdownEditor";
import HashtagInput from "@/app/post/write/_components/HashtagInput";

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
                .select("title, content, hashtags")
                .eq("board_id", Number(postId)) // 숫자로 변환하여 비교
                .single();

            if (error) throw error;
            if (data) {
                setPost({
                    title: data.title,
                    content: data.content,
                    hashtags: data.hashtags || []
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
            const { error } = await supabase
                .from("Post")
                .update({
                    title: post.title,
                    content: post.content,
                    hashtags: post.hashtags
                })
                .eq("board_id", Number(postId)); // 숫자로 변환하여 비교

            if (error) throw error;

            alert("게시글이 성공적으로 수정되었습니다.");
            router.push(`/posts/${postId}`);
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
                            setContent={(content) => setPost({ ...post, content })}
                        />
                        <HashtagInput
                            hashtags={post.hashtags}
                            setHashtags={(hashtags) => setPost({ ...post, hashtags })}
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
