"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { PostType } from "@/app/(admin)/types/Post";
import { useState } from "react";
import Skeleton from "./_components/BoardSkeleton";
import Button from "../../_components/Button";
import Link from "next/link";

const pageSize = 5; // 페이지당 보여줄 게시글 수 5개 고정
const supabase = createClient();

// 게시글을 가져오는 함수
const fetchPosts = async (page: number, filter: string): Promise<PostType[]> => {
    let query = supabase
        .from("Post")
        .select(`*, user_id(*)`)
        .range((page - 1) * pageSize, page * pageSize - 1);

    // filter에 따라 조건 추가
    if (filter === "created_at") {
        query = query.order("created_at", { ascending: false }); // 최신순으로 정렬
    } else if (filter === "true") {
        query = query.eq("publicStatus", true).order("created_at", { ascending: false }); // publicStatus가 true인 게시글만
    } else if (filter === "false") {
        query = query.eq("publicStatus", false).order("created_at", { ascending: false }); // publicStatus가 false인 게시글만
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

//게시글을 삭제하는 함수
const deletePost = async (board_id: number) => {
    const { error } = await supabase.from("Post").delete().eq("board_id", board_id); // board_id 기준으로 게시글 삭제

    if (error) {
        throw new Error(error.message);
    }
};

// 총 게시글 수만 가져오기 위한 함수
const fetchTotalPosts = async (filter: string): Promise<number> => {
    let query = supabase.from("Post").select("*", { count: "exact", head: true });

    if (filter === "true") {
        query = query.eq("publicStatus", true); // publicStatus가 true인 게시글 수
    } else if (filter === "false") {
        query = query.eq("publicStatus", false); // publicStatus가 false인 게시글 수
    }

    const { count, error } = await query;

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
    const [filter, setFilter] = useState("created_at");
    // 게시글 가져오기
    const {
        data: posts,
        error,
        isLoading
    } = useQuery<PostType[], Error>({
        queryKey: ["posts", page, filter],
        queryFn: () => fetchPosts(page, filter)
    });

    const deleteMutation = useMutation({
        mutationFn: deletePost,
        onSuccess: async () => {
            // 삭제 후 게시글 목록을 다시 가져오기 위한 쿼리 무효화
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["totalPosts"] });

            const totalPosts = await fetchTotalPosts(filter); // 총 게시글 수 가져오기
            const totalPages = Math.ceil(totalPosts / pageSize); // 총 페이지 수 계산

            // 현재 페이지가 총 페이지 수보다 크면 이전 페이지로 이동
            if (page > totalPages && totalPages > 0) {
                setPage(totalPages);
            } else if (totalPages === 0) {
                // 게시글이 없으면 첫 페이지로 이동
                setPage(1);
            }
        }
    });
    const toggleVisibilityMutation = useMutation<void, Error, { boardId: number; currentStatus: boolean }>({
        mutationFn: togglePostVisibility,
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["totalPosts"] });

            const totalPosts = await fetchTotalPosts(filter); // 총 게시글 수 가져오기
            const totalPages = Math.ceil(totalPosts / pageSize); // 총 페이지 수 계산

            // 현재 페이지가 총 페이지 수보다 크면, 이전 페이지로 이동
            if (page > totalPages && totalPages > 0) {
                setPage(totalPages);
            } else if (totalPages === 0) {
                // 게시글이 없으면 첫 페이지로 이동
                setPage(1);
            }
        }
    });

    // 필터 변경 시
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(e.target.value);
        setPage(1); // 첫 페이지로 이동
        queryClient.invalidateQueries({ queryKey: ["posts", 1, e.target.value] }); // 새로운 필터로 게시글 요청
        queryClient.invalidateQueries({ queryKey: ["totalPosts", e.target.value] }); // 총 게시글 수 요청 무효화
    };

    // 총 게시글 수 가져오기
    const { data: totalPosts } = useQuery<number>({
        queryKey: ["totalPosts", filter],
        queryFn: () => fetchTotalPosts(filter)
    });

    const totalPages = totalPosts ? Math.ceil(totalPosts / pageSize) : 1; // 총 페이지 수 계산

    // 현재 페이지를 기준으로 보여줄 페이지 번호의 시작과 끝번호 계산
    const startPage = Math.floor((page - 1) / 5) * 5 + 1;
    const endPage = Math.min(startPage + 4, totalPages);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center flex-col min-h-screen bg-[#2b2d42]">
                {Array.from({ length: pageSize }).map((_, index) => (
                    <Skeleton key={index} />
                ))}
            </div>
        );
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const options = [
        { value: "created_at", label: "최신순" },
        { value: "true", label: "공개중" },
        { value: "false", label: "비공개중" }
    ];

    return (
        <>
            <div className="flex justify-center items-center flex-col min-h-screen bg-[#2b2d42]">
                <div className="flex items-end text-black mb-1 w-full max-w-[1000px]">
                    {/* 필터 선택 */}
                    <select value={filter} onChange={handleFilterChange} className="ml-auto text-center">
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                {posts?.map((post) => (
                    <div className="flex justify-between w-[1000px] h-[100px] my-3 bg-white p-4" key={post.board_id}>
                        <Link href={`/posts/${post.board_id}`}>
                            <div className="flex flex-col">
                                <div className="text-xl w-[800px] text-black">{post.title}</div>
                                <div className="flex space-x-2 text-gray-500">
                                    <div>{post.user_id?.user_name}님</div>
                                    <div>{new Date(post.created_at).toISOString().replace("T", " ").slice(0, -5)}</div>
                                </div>
                            </div>
                        </Link>
                        <div className="flex space-x-2 self-center">
                            <Button
                                confirmMessage={
                                    post.publicStatus
                                        ? "정말 공개로 전환하시겠습니까?"
                                        : "정말 비공개로 전환하시겠습니까?"
                                }
                                buttonText={post.publicStatus ? "비공개" : "공개"}
                                buttonColor="bg-[#00D084]"
                                onClick={() =>
                                    toggleVisibilityMutation.mutate({
                                        boardId: post.board_id,
                                        currentStatus: post.publicStatus
                                    })
                                }
                            />
                            <Button
                                confirmMessage="정말 삭제하시겠습니까?"
                                buttonText="삭제"
                                buttonColor="bg-red-500"
                                onClick={() => deleteMutation.mutate(post.board_id)}
                            />
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
