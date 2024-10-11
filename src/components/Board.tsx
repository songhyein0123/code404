"use client";

import { useState } from "react";
import SortDropdown from "./SortDropdown";
import { Search } from "./Search";

interface Post {
    id: number;
    title: string;
    author: string;
    date: string;
    hashtags: string[];
}

const mock_data: Post[] = [
    {
        id: 1,
        title: "TypeScript를 시작하는 방법",
        author: "개발자1",
        date: "2024-10-01",
        hashtags: ["#TypeScript", "#JavaScript", "#프로그래밍"]
    },
    {
        id: 2,
        title: "React와 Redux로 상태 관리하기",
        author: "개발자2",
        date: "2024-10-02",
        hashtags: ["#React", "#Redux", "#웹개발"]
    },
    {
        id: 3,
        title: "Next.js로 SSR 구현하기",
        author: "개발자3",
        date: "2024-10-03",
        hashtags: ["#Nextjs", "#SSR", "#React"]
    },
    {
        id: 4,
        title: "Node.js로 REST API 만들기",
        author: "개발자4",
        date: "2024-10-04",
        hashtags: ["#Nodejs", "#API", "#백엔드"]
    },
    {
        id: 5,
        title: "Tailwind CSS로 디자인 쉽게 하기",
        author: "개발자5",
        date: "2024-10-05",
        hashtags: ["#TailwindCSS", "#디자인", "#프론트엔드"]
    },
    {
        id: 6,
        title: "Python으로 데이터 분석 시작하기",
        author: "개발자6",
        date: "2024-10-06",
        hashtags: ["#Python", "#데이터분석", "#AI"]
    },
    {
        id: 7,
        title: "Git과 GitHub로 협업하기",
        author: "개발자7",
        date: "2024-10-07",
        hashtags: ["#Git", "#GitHub", "#협업"]
    },
    {
        id: 8,
        title: "Docker를 활용한 배포 전략",
        author: "개발자8",
        date: "2024-10-08",
        hashtags: ["#Docker", "#배포", "#DevOps"]
    },
    {
        id: 9,
        title: "GraphQL로 효율적인 데이터 가져오기",
        author: "개발자9",
        date: "2024-10-09",
        hashtags: ["#GraphQL", "#데이터", "#API"]
    },
    {
        id: 10,
        title: "Jest로 유닛 테스트하기",
        author: "개발자10",
        date: "2024-10-10",
        hashtags: ["#Jest", "#테스트", "#프론트엔드"]
    },
    {
        id: 11,
        title: "Firebase로 인증 시스템 구축하기",
        author: "개발자11",
        date: "2024-10-11",
        hashtags: ["#Firebase", "#인증", "#백엔드"]
    },
    {
        id: 12,
        title: "CSS Grid와 Flexbox 비교하기",
        author: "개발자12",
        date: "2024-10-12",
        hashtags: ["#CSS", "#Grid", "#Flexbox"]
    },
    {
        id: 13,
        title: "웹 접근성을 고려한 개발",
        author: "개발자13",
        date: "2024-10-13",
        hashtags: ["#웹접근성", "#UX", "#디자인"]
    },
    {
        id: 14,
        title: "API 보안을 위한 Best Practices",
        author: "개발자14",
        date: "2024-10-14",
        hashtags: ["#API", "#보안", "#백엔드"]
    },
    {
        id: 15,
        title: "Sass로 CSS를 더 쉽게 관리하기",
        author: "개발자15",
        date: "2024-10-15",
        hashtags: ["#Sass", "#CSS", "#프론트엔드"]
    },
    {
        id: 16,
        title: "Angular로 SPA 개발하기",
        author: "개발자16",
        date: "2024-10-16",
        hashtags: ["#Angular", "#SPA", "#웹개발"]
    },
    {
        id: 17,
        title: "Kubernetes로 컨테이너 관리하기",
        author: "개발자17",
        date: "2024-10-17",
        hashtags: ["#Kubernetes", "#컨테이너", "#DevOps"]
    },
    {
        id: 18,
        title: "React Native로 모바일 앱 개발하기",
        author: "개발자18",
        date: "2024-10-18",
        hashtags: ["#ReactNative", "#모바일앱", "#프로그래밍"]
    },
    {
        id: 19,
        title: "기계 학습의 기초 이해하기",
        author: "개발자19",
        date: "2024-10-19",
        hashtags: ["#MachineLearning", "#AI", "#데이터"]
    },
    {
        id: 20,
        title: "Cloud Computing의 장점",
        author: "개발자20",
        date: "2024-10-20",
        hashtags: ["#Cloud", "#컴퓨팅", "#IT"]
    }
];

const PostsPerPage = 5;

export default function Board() {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState("latest");
    const totalPosts = mock_data.length;
    const totalPages = Math.ceil(totalPosts / PostsPerPage);

    // 페이지 변경 함수
    const handlePageChange = (page: number) => {
        // 페이지 범위를 벗어나면 아무 것도 하지 않음
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const paginatedPosts = mock_data.slice((currentPage - 1) * PostsPerPage, currentPage * PostsPerPage);

    // 정렬 로직 추가: 최신순 또는 좋아요 순으로 정렬
    const handleSortChange = (value: string) => {
        setSortOrder(value);
    };

    return (
        <div className="p-4 max-w-3xl mx-auto">
            {/* 드롭 박스와 검색 컴포넌트 */}
            <div className="flex justify-between mb-4 h-10">
                <SortDropdown onSortChange={handleSortChange} />
                <Search onSearch={(query) => console.log(query)} />
            </div>
            {/* 게시글 목록 */}
            {paginatedPosts.map((post) => (
                <div key={post.id} className="mb-6 border-b pb-4 last:border-none">
                    <div className="text-xl font-bold text-gray-800 mb-2">{post.title}</div>
                    <div className="text-sm text-gray-600 space-x-2">
                        <span>{post.author}</span> <span>{post.date}</span>
                        {post.hashtags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-blue-600">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            ))}

            {/* 페이지네이션 */}
            <div className="flex justify-center mt-6 space-x-2">
                {/* 이전 페이지 버튼 */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded ${
                        currentPage === 1 ? "bg-gray-300 text-gray-500" : "bg-gray-200 text-gray-800"
                    }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
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
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
