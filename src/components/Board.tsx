"use client";

import { useState } from "react";

interface Post {
    id: number;
    title: string;
    author: string;
    date: string;
    hashtags: string[];
}

const mockPosts: Post[] = [
    {
        id: 1,
        title: "첫 번째 게시글",
        author: "작성자1",
        date: "2024-10-11",
        hashtags: ["#TypeScript", "#Nextjs", "#React"]
    },
    {
        id: 2,
        title: "두 번째 게시글",
        author: "작성자2",
        date: "2024-10-11",
        hashtags: ["#JavaScript", "#TailwindCSS", "#Nextjs"]
    }
];

const PostsPerPage = 5;

export default function Board() {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPosts = mockPosts.length;
    const totalPages = Math.ceil(totalPosts / PostsPerPage);

    const paginatedPosts = mockPosts.slice((currentPage - 1) * PostsPerPage, currentPage * PostsPerPage);

    const handlePageChange = (page: number) => {
        // 페이지가 변경될 때, currentPage 상태를 업데이트
        setCurrentPage(page);
    };

    return (
        <div>
            {/* 게시글 목록 */}
            {paginatedPosts.map((post) => (
                <div key={post.id}>
                    <div>{post.title}</div>
                    <div>
                        <span>{post.author}</span> | <span>{post.date}</span> |
                        {post.hashtags.slice(0, 3).map((tag, idx) => (
                            <span key={idx}>{tag}</span>
                        ))}
                    </div>
                </div>
            ))}

            {/* 페이지네이션 */}
            <div>
                {/* 이전 페이지 버튼 */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded ${
                        currentPage === 1 ? "bg-gray-300 text-gray-500" : "bg-gray-200 text-gray-800"
                    }`}
                >
                    이전
                </button>

                {/* 페이지 번호 버튼 */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded ${
                            page === currentPage ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                        }`}
                    >
                        {page}
                    </button>
                ))}

                {/* 다음 페이지 버튼 */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded ${
                        currentPage === totalPages ? "bg-gray-300 text-gray-500" : "bg-gray-200 text-gray-800"
                    }`}
                >
                    다음
                </button>
            </div>
        </div>
    );
}
