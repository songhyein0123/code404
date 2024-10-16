"use client";

import { createClient } from "@/utils/supabase/client";
import { ReportedPostType } from "../../types/Post";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Skeleton from "./_components/ReportSkeleton";

const supabase = createClient();

const fetchReportedPosts = async (): Promise<ReportedPostType[]> => {
    const { data, error } = await supabase.from("Reported_Post").select(`* , user_id(*), board_id(*, user_id(*))`);

    if (error) {
        throw new Error(error.message);
    }
    return data;
};

const ReportedPostPage = () => {
    const queryClient = useQueryClient();

    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림/닫힘 상태
    const [selectedReports, setSelectedReports] = useState<ReportedPostType[]>([]); // 선택된 신고 게시글들

    const {
        data: reportedPosts,
        error,
        isLoading
    } = useQuery<ReportedPostType[], Error>({
        queryKey: ["reportedPosts"],
        queryFn: () => fetchReportedPosts()
    });

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

    const toggleVisibilityMutation = useMutation<void, Error, { boardId: number; currentStatus: boolean }>({
        mutationFn: togglePostVisibility,
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ["reportedPosts"] });
        }
    });

    const deletePost = async (board_id: number) => {
        await supabase.from("Reported_Post").delete().eq("board_id", board_id);
        const { error } = await supabase.from("Post").delete().eq("board_id", board_id); // board_id 기준으로 게시글 삭제

        if (error) {
            throw new Error(error.message);
        }
    };

    const deleteMutation = useMutation({
        mutationFn: deletePost,
        onSuccess: async () => {
            // 삭제 후 게시글 목록을 다시 가져오기 위한 쿼리 무효화
            queryClient.invalidateQueries({ queryKey: ["reportedPosts"] });
        }
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center flex-col min-h-screen bg-gray-100">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} />
                ))}
            </div>
        );
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    // board_id로 그룹화
    const groupedPosts = reportedPosts?.reduce((acc, post) => {
        const boardId = post.board_id.board_id;

        if (!acc[boardId]) {
            acc[boardId] = {
                ...post.board_id,
                reportCount: 0 // 신고 건수 초기화
            };
        }
        acc[boardId].reportCount += 1; // 동일한 board_id를 가진 신고 건수 증가

        return acc;
    }, {} as Record<number, ReportedPostType["board_id"] & { reportCount: number }>);

    // 모달 열기
    const openModal = (boardId: number) => {
        // 선택한 게시글의 모든 신고 내역을 필터링
        const reportsForBoard = reportedPosts?.filter((report) => report.board_id.board_id === boardId) || [];
        setSelectedReports(reportsForBoard);
        setIsModalOpen(true);
    };

    // 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedReports([]); // 선택된 신고 목록 초기화
    };

    return (
        <>
            <div className="flex justify-center items-center flex-col min-h-screen bg-[#2b2d42]">
                {Object.values(groupedPosts || {}).map((post) => (
                    <div className="flex justify-between w-[1000px] h-[100px] my-3 bg-white p-4" key={post.board_id}>
                        <div className="flex flex-col">
                            <div className="text-xl w-[800px] text-black">{post.title}</div>
                            <div className="flex space-x-2 text-gray-500">
                                <div>{post.user_id.user_name}님</div>
                                <div>{new Date(post.created_at).toISOString().replace("T", " ").slice(0, -5)}</div>
                                <div
                                    className="flex rounded-3xl bg-red-600 text-white font-bold w-[150px] justify-center cursor-pointer"
                                    onClick={() => openModal(post.board_id)}
                                >
                                    누적신고된수 : {post.reportCount}건
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-2 self-center">
                            <button
                                className="bg-gray-500 text-white p-2 rounded"
                                onClick={() => {
                                    if (
                                        window.confirm(
                                            post.publicStatus
                                                ? "정말 공개로 전환하시겠습니까?"
                                                : "정말 비공개로 전환하시겠습니까?"
                                        )
                                    ) {
                                        toggleVisibilityMutation.mutate({
                                            boardId: post.board_id,
                                            currentStatus: post.publicStatus
                                        });
                                    }
                                }}
                            >
                                {post.publicStatus ? "비공개" : "공개"}
                            </button>
                            <button
                                className="bg-red-500 text-white p-2 rounded"
                                onClick={() => {
                                    if (window.confirm("정말 삭제하시겠습니까?")) {
                                        deleteMutation.mutate(post.board_id);
                                    }
                                }}
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* 모달 */}
            {isModalOpen && selectedReports.length > 0 && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                        <h2 className="text-2xl mb-4 text-black font-bold text-center">신고 내역</h2>
                        {selectedReports.map((report) => (
                            <div key={report.report_id} className="mb-4">
                                <p className="text-black">신고 사유: {report.report}</p>
                                <p className="text-black">신고자: {report.user_id.user_name} 님</p>
                                <hr className="my-2" />
                            </div>
                        ))}
                        <div className="text-center">
                            <button
                                className="mt-4 w-[100px] font-bold text-xl bg-white text-black border-solid border-2 border-gray-700 p-2 rounded"
                                onClick={closeModal}
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ReportedPostPage;
