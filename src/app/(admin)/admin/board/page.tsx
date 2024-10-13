"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { PostType } from "@/types/Post";
import { useState } from "react";
import Skeleton from "./_components/BoardSkeleton";

const pageSize = 5; // 페이지당 보여줄 게시글 수 5개 고정

// 게시글을 가져오는 함수
const fetchPosts = async (page: number): Promise<PostType[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("Post")
        .select(`* , user_id(*)`)
        .order("board_id", { ascending: true })
        .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

//게시글을 삭제하는 함수
const deletePost = async (board_id: number) => {
    const supabase = createClient();
    const { error } = await supabase.from("Post").delete().eq("board_id", board_id); // board_id 기준으로 게시글 삭제

    if (error) {
        throw new Error(error.message);
    }
};

// 총 게시글 수만 가져오기 위한 함수
const fetchTotalPosts = async (): Promise<number> => {
    const supabase = createClient();
    const { count, error } = await supabase.from("Post").select("*", { count: "exact", head: true });

    if (error) {
        throw new Error(error.message);
    }

    return count || 0;
};

const togglePostVisibility = async ({
    boardId,
    currentStatus
}: {
    boardId: number;
    currentStatus: boolean;
}): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase.from("Post").update({ publicStatus: !currentStatus }).eq("board_id", boardId);
    if (error) {
        throw new Error(error.message);
    }
};

const PostPage = () => {
    const [page, setPage] = useState(1); // 현재 페이지 번호
    const queryClient = useQueryClient();

    // 게시글 가져오기
    const {
        data: posts,
        error,
        isLoading
    } = useQuery<PostType[], Error>({
        queryKey: ["posts", page],
        queryFn: () => fetchPosts(page) // 페이지 번호 별로 게시글 가져옴
    });

    const deleteMutation = useMutation({
        mutationFn: deletePost,
        onSuccess: () => {
            // 삭제 후 게시글 목록을 다시 가져오기 위한 쿼리 무효화
            queryClient.invalidateQueries({ queryKey: ["posts", page] });
        }
    });

    const toggleVisibilityMutation = useMutation<void, Error, { boardId: number; currentStatus: boolean }>({
        mutationFn: togglePostVisibility, // togglePostVisibility 함수
        onSuccess: () => {
            // 공개/비공개 변경 후 게시글 목록을 다시 가져오기 위한 쿼리 무효화
            queryClient.invalidateQueries({ queryKey: ["posts", page] });
        }
    });

    // 총 게시글 수 가져오기
    const { data: totalPosts } = useQuery<number>({
        queryKey: ["totalPosts"],
        queryFn: fetchTotalPosts
    });

    const totalPages = totalPosts ? Math.ceil(totalPosts / pageSize) : 1; // 총 페이지 수 계산

    // 현재 페이지를 기준으로 보여줄 페이지 번호의 시작과 끝 계산
    const startPage = Math.floor((page - 1) / 5) * 5 + 1;
    const endPage = Math.min(startPage + 4, totalPages); // 페이지 번호 5개씩 보여줌

    if (isLoading) {
        return (
            <div className="flex justify-center items-center flex-col min-h-screen bg-gray-100">
                {Array.from({ length: pageSize }).map((_, index) => (
                    <Skeleton key={index} />
                ))}
            </div>
        );
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <>
            <div className="flex justify-center items-center flex-col min-h-screen bg-gray-100">
                {posts?.map((post) => (
                    <div className="flex justify-between w-[1000px] h-[100px] my-3 bg-white p-4" key={post.board_id}>
                        <div className="flex flex-col">
                            <div className="text-xl w-[800px] text-black">{post.title}</div>
                            <div className="flex space-x-2 text-gray-500">
                                <div>{post.user_id.user_name}님</div>
                                <div>{new Date(post.created_at).toLocaleDateString()}</div>
                            </div>
                        </div>

                        <div className="flex space-x-2 self-center">
                            <button
                                className="bg-gray-500 text-white p-2 rounded"
                                onClick={() =>
                                    toggleVisibilityMutation.mutate({
                                        boardId: post.board_id,
                                        currentStatus: post.publicStatus
                                    })
                                }
                            >
                                {post.publicStatus ? "비공개" : "공개"}
                            </button>
                            <button
                                className="bg-red-500 text-white p-2 rounded"
                                onClick={() => deleteMutation.mutate(post.board_id)}
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                ))}

                {/* 페이지네이션 출력 */}
                <div className="flex space-x-2 my-5">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(1)}
                        className="p-2 bg-gray-500 text-white rounded disabled:opacity-50"
                    >
                        &lt;&lt;
                    </button>

                    <button
                        disabled={page === 1}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        className="p-2 bg-gray-500 text-white rounded disabled:opacity-50"
                    >
                        &lt;
                    </button>
                    {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`p-2 rounded ${page === pageNum ? "bg-gray-800 text-white" : "bg-gray-300"}`}
                        >
                            {pageNum}
                        </button>
                    ))}

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        className="p-2 bg-gray-500 text-white rounded disabled:opacity-50"
                    >
                        &gt;
                    </button>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(totalPages)}
                        className="p-2 bg-gray-500 text-white rounded disabled:opacity-50"
                    >
                        &gt;&gt;
                    </button>
                </div>
            </div>
        </>
    );
};

export default PostPage;
