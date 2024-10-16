import React, { useState } from "react";

interface Post {
    id: number;
    title: string;
    author: string;
    date: string;
    hashtags: string[];
}

interface PostListProps {
    posts: Post[]; // 게시글 배열
}

const PostList = ({ posts }: PostListProps) => {
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
    const postsPerPage = 5; // 한 페이지에 표시할 게시글 수

    // 현재 페이지에 해당하는 게시글을 가져오는 함수
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    // 총 페이지 수
    const totalPages = Math.ceil(posts.length / postsPerPage);

    // 페이지네이션 버튼 클릭 시 페이지 변경 함수
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // 페이지 이전/다음 함수
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">게시글 목록</h2>
            <ul className="space-y-4">
                {currentPosts.map((post) => (
                    <li key={post.id} className="border p-4 rounded-md">
                        <h3 className="text-lg font-semibold">{post.title}</h3>
                        <p className="text-gray-600">{post.author}</p>
                        <p className="text-gray-400">{post.date}</p>
                        <p className="text-sm">{post.hashtags.join(", ")}</p>
                    </li>
                ))}
            </ul>

            {/* 페이지네이션 */}
            <div className="flex justify-center mt-4 items-center">
                <button
                    onClick={prevPage}
                    className={`mx-1 px-4 py-2 border rounded-md ${currentPage === 1 ? "disabled:opacity-50" : ""}`}
                    disabled={currentPage === 1} // 첫 페이지에서는 비활성화
                >
                    &lt; {/* 이전 페이지 화살표 */}
                </button>

                {/* 페이지 번호 */}
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`mx-1 px-4 py-2 border rounded-md ${
                            currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white text-blue-500"
                        }`}
                    >
                        {index + 1} {/* 페이지 번호 */}
                    </button>
                ))}

                <button
                    onClick={nextPage}
                    className={`mx-1 px-4 py-2 border rounded-md ${
                        currentPage === totalPages ? "disabled:opacity-50" : ""
                    }`}
                    disabled={currentPage === totalPages} // 마지막 페이지에서는 비활성화
                >
                    &gt; {/* 다음 페이지 화살표 */}
                </button>
            </div>
        </div>
    );
};

export default PostList;
