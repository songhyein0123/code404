"use client";

import PostList from "./_components/PostList";
import LanguageFilter from "./_components/LanguageFilter";
import { useRouter } from "next/navigation"; // useRouter import 추가
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Post } from "../types/Post";

export default function PostPage() {
    const [postList, setPostList] = useState<Post[]>([]);
    const router = useRouter(); // useRouter 훅 사용
    // 글쓰기 페이지로 이동하는 함수
    const handleWriteClick = () => {
        router.push("/post/write"); // post/write 페이지로 이동
    };

    useEffect(() => {
        const fetchPosts = async () => {
            const supabase = createClient();

            const { data } = await supabase
                .from("Post")
                .select("*, user: User(*), hashTag: Hashtag(*)")
                .eq("publicStatus", true);

            setPostList(data as Post[]);
        };

        fetchPosts();
    }, []);

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-center my-8">게시판</h1>
            {/* 게시글 목록 */}
            <div className="mb-4">
                <PostList posts={postList} />
            </div>

            <div className="flex justify-between items-center mt-4">
                {/* 왼쪽: 언어 필터 */}
                <div className="w-1/4">
                    <LanguageFilter />
                </div>
                {/* 글쓰기 버튼 */}
                <button
                    onClick={handleWriteClick}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    글쓰기
                </button>
            </div>
        </div>
    );
}
