"use client";

import PostList from "./_components/PostList";
import Search from "./_components/Search";
import SortDropdown from "./_components/SortDropdown";
import LanguageFilter from "./_components/LanguageFilter";
import { PostMockData } from "./_components/PostMockData";
import { useRouter } from "next/navigation"; // useRouter import 추가

export default function PostPage() {
    const router = useRouter(); // useRouter 훅 사용
    // 글쓰기 페이지로 이동하는 함수
    const handleWriteClick = () => {
        router.push("/post/write"); // post/write 페이지로 이동
    };
    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-center my-8">게시판</h1>

            <div className="flex justify-between items-center mb-4">
                {/* 최신순, 제목순 정렬 드롭다운 */}
                <div className="flex space-x-4">
                    <SortDropdown />
                </div>

                {/* 검색 인풋과 버튼 */}
                <Search />
            </div>

            {/* 게시글 목록 */}
            <div className="mb-4">
                <PostList posts={PostMockData} />
            </div>

            <div className="flex justify-between items-center mt-4">
                {/* 왼쪽: 언어 필터 */}
                <div className="w-1/4">
                    <LanguageFilter />
                </div>

                {/* 오른쪽: 글쓰기 버튼 */}

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
