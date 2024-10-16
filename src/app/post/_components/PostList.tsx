import { useState } from "react";
import { Post } from "./PostMockData";
import Search from "../_components/Search";
import SortDropdown from "./SortDropdown";

const POSTS_PER_PAGE = 5; // 페이지당 보여줄 게시글 수

interface PostListProps {
    posts: Post[]; // Post 인터페이스를 PostMockData.ts에서 가져옴
}

const PostList = ({ posts }: PostListProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState<"latest" | "title">("latest"); // 정렬 상태

    // 정렬 함수
    const sortedPosts = () => {
        const sorted = [...posts]; // 원본 배열을 복사
        if (sortOrder === "latest") {
            return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else {
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        }
    };

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

    // 현재 페이지에 해당하는 게시글 가져오기
    const currentPosts = sortedPosts().slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

    // 페이지 이동 함수
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // 정렬 상태 업데이트 함수
    const handleSortChange = (newSortOrder: "latest" | "title") => {
        setSortOrder(newSortOrder);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                {/* 정렬 방식 선택 */}
                <SortDropdown sortOrder={sortOrder} onSortChange={handleSortChange} />
                <Search />
            </div>

            <div className="divide-y divide-gray-300">
                {currentPosts.map((post) => (
                    <div key={post.id} className="border-b-2 border-gray-500 py-4">
                        {/* 첫 번째 줄: 제목 */}
                        <h2 className="text-xl font-bold mb-1">{post.title}</h2>

                        {/* 두 번째 줄: 작성자, 날짜, 해시태그 */}
                        <div className="text-sm text-gray-600 flex flex-wrap items-center">
                            <span className="mr-2">{post.author}</span>
                            <span className="mr-2">· {post.date}</span>
                            <div className="flex flex-wrap">
                                {post.hashtags.map((tag, index) => (
                                    <span key={index} className="text-blue-500 mr-2">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 페이지네이션 */}
            <div className="flex justify-center items-center space-x-2 mt-4">
                {/* 이전 페이지로 이동 */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                >
                    이전
                </button>

                {/* 페이지 번호 */}
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                    <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 py-1 ${
                            currentPage === pageNumber ? "bg-blue-500 text-white" : "bg-gray-300"
                        } rounded hover:bg-gray-400`}
                    >
                        {pageNumber}
                    </button>
                ))}

                {/* 다음 페이지로 이동 */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default PostList;
