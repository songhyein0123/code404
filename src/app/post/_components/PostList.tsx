import React, { useState } from "react";

interface Post {
    id: number;
    title: string;
    author: string;
    date: string;
    hashtags: string[];
}

interface PostListProps {
    posts: Post[];
}

const PostList = ({ posts }: PostListProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(posts.length / postsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">게시글 목록</h2>

            {/* 게시글 리스트 상단 두꺼운 가로선 */}
            <div className="border-b-2 mb-2" />

            <ul className="space-y-4">
                {currentPosts.map((post) => (
                    <li key={post.id} className="pb-2">
                        {/* 제목 섹션 */}
                        <div className="font-semibold text-lg mb-1">{post.title}</div>

                        {/* 작성자, 작성 날짜, 해시태그 섹션 */}
                        <div className="text-sm text-gray-600 space-x-2">
                            <span>작성자: {post.author}</span>
                            <span>| {post.date}</span>
                            <span>| {post.hashtags.join(", ")}</span>
                        </div>

                        {/* 각 게시글 간의 얇은 가로선 */}
                        <div className="border-b border-gray-300 mt-2" />
                    </li>
                ))}
            </ul>

            {/* 게시글 리스트 하단 두꺼운 가로선 */}
            <div className="border-b-2 mt-2" />

            {/* 페이지네이션 */}
            <div className="flex justify-center mt-4 items-center">
                <button onClick={prevPage} disabled={currentPage === 1} className="mx-1 px-4 py-2 border rounded-md">
                    &lt;
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`mx-1 px-4 py-2 border rounded-md ${
                            currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white text-blue-500"
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="mx-1 px-4 py-2 border rounded-md"
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default PostList;
