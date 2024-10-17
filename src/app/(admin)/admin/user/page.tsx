"use client";

import { createClient } from "@/utils/supabase/client";
import { UserType } from "../../types/User";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Skeleton from "./_components/UserSkeleton";
import Button from "../../_components/Button";

const pageSize = 16; // 페이지당 보여줄 게시글 수 5개 고정
const supabase = createClient();

const fetchUsers = async (page: number, filter: string): Promise<UserType[]> => {
    let query = supabase
        .from("User")
        .select(`* `)
        .range((page - 1) * pageSize, page * pageSize - 1);

    if (filter === "created_at") {
        query = query.order("created_at", { ascending: false });
    } else if (filter === "true") {
        query = query.eq("activate", true).order("created_at", { ascending: false });
    } else if (filter === "false") {
        query = query.eq("activate", false).order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

const fetchTotalUsers = async (filter: string): Promise<number> => {
    let query = supabase.from("User").select("*", { count: "exact", head: true });

    if (filter === "true") {
        query = query.eq("activate", true);
    } else if (filter === "false") {
        query = query.eq("activate", false);
    }
    const { count, error } = await query;
    if (error) {
        throw new Error(error.message);
    }

    return count || 0;
};

const toggleUserVisibility = async ({
    user_id,
    currentStatus
}: {
    user_id: string;
    currentStatus: boolean;
}): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase.from("User").update({ activate: !currentStatus }).eq("id", user_id);
    if (error) {
        throw new Error(error.message);
    }
};

const UserPage = () => {
    const [page, setPage] = useState(1); // 현재 페이지 번호
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState("created_at");

    const {
        data: users,
        error,
        isLoading
    } = useQuery<UserType[], Error>({
        queryKey: ["users", page, filter],
        queryFn: () => fetchUsers(page, filter) // 페이지 번호 별로 게시글 가져옴
    });

    // 총 게시글 수 가져오기
    const { data: totalUsers } = useQuery<number>({
        queryKey: ["totalUsers", filter],
        queryFn: () => fetchTotalUsers(filter)
    });

    const totalPages = totalUsers ? Math.ceil(totalUsers / pageSize) : 1; // 총 페이지 수 계산

    // 현재 페이지를 기준으로 보여줄 페이지 번호의 시작과 끝 계산
    const startPage = Math.floor((page - 1) / 5) * 5 + 1;
    const endPage = Math.min(startPage + 4, totalPages); // 페이지 번호 5개씩 보여줌

    const adjustPageAfterMutation = async () => {
        const updatedTotalUsers = await fetchTotalUsers(filter);
        const updatedTotalPages = Math.ceil(updatedTotalUsers / pageSize);

        if (page > updatedTotalPages && updatedTotalPages > 0) {
            setPage(updatedTotalPages); // 마지막 페이지로 이동
        } else if (updatedTotalPages === 0) {
            setPage(1); // 사용자 없음 -> 첫 페이지로 이동
        }
    };
    const handleFilterChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newFilter = e.target.value;
        setFilter(newFilter);

        // 상태 변경이 완료된 후에 페이지를 1로 설정
        setPage(1); // 페이지를 1로 변경

        // 페이지 변경 후에 쿼리 무효화
        queryClient.invalidateQueries({ queryKey: ["users", page, newFilter] });
        queryClient.invalidateQueries({ queryKey: ["totalUsers", newFilter] });
    };

    const toggleVisibilityMutation = useMutation<void, Error, { user_id: string; currentStatus: boolean }>({
        mutationFn: toggleUserVisibility,
        onSuccess: async () => {
            await adjustPageAfterMutation(); // 페이지가 변경되면 그에 맞춰 처리
            queryClient.invalidateQueries({ queryKey: ["users"] }); // 현재 페이지에 대한 쿼리 무효화
            queryClient.invalidateQueries({ queryKey: ["totalUsers"] });
        }
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center flex-col min-h-screen bg-[#2b2d42]">
                <div className="grid grid-cols-4 gap-4">
                    {Array.from({ length: pageSize }).map((_, index) => (
                        <Skeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }
    if (error) return <div>Error: {error.message}</div>;

    const options = [
        { value: "created_at", label: "최신순" },
        { value: "true", label: "활성화중" },
        { value: "false", label: "비활성화중" }
    ];

    return (
        <>
            <div className="flex justify-center items-center flex-col min-h-screen bg-[#2b2d42]">
                <div className="flex items-end text-black mb-3 w-full max-w-[850px]">
                    {/* 필터 선택 */}
                    <select value={filter} onChange={handleFilterChange} className="ml-auto text-center">
                        {options.map((option) => (
                            <option key={option.value} value={option.value} className="">
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {users?.map((user) => (
                        <div
                            key={user.id}
                            className="border border-solid bg-white border-teal-800 rounded p-4 hover:shadow-lg"
                        >
                            <div className="flex justify-center h-[100px]">
                                <Image
                                    src={user.profile_url}
                                    alt="profile"
                                    className="rounded-full"
                                    width={100}
                                    height={100}
                                />
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-black text-xl">{user.user_name}님</div>
                            </div>
                            <div className="text-center text-black">
                                <div>{user.email}</div>
                            </div>
                            <div className="flex justify-around">
                                {user.activate ? (
                                    <Button
                                        confirmMessage="정말 탈퇴하시겠습니까?"
                                        buttonText="탈퇴"
                                        buttonColor="bg-red-400"
                                        onClick={() =>
                                            toggleVisibilityMutation.mutate({
                                                user_id: user.id,
                                                currentStatus: user.activate
                                            })
                                        }
                                    />
                                ) : (
                                    ""
                                )}

                                <Button
                                    confirmMessage={
                                        user.activate ? "정말 비활성화 하시겠습니까?" : "정말 활성화 하시겠습니까?"
                                    }
                                    buttonText={user.activate ? "비활성화" : "활성화"}
                                    buttonColor="bg-gray-400"
                                    onClick={() =>
                                        toggleVisibilityMutation.mutate({
                                            user_id: user.id,
                                            currentStatus: user.activate
                                        })
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </div>
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
export default UserPage;
