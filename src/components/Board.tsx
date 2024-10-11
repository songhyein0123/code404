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

    return (
        <div>
            {/* 게시글 목록 */}
            {paginatedPosts.map((post) => (
                <div key={post.id}>
                    <div>{post.title}</div>
                    <div>
                        <span>{post.author}</span> | <span>{post.date}</span> | <span key={idx}>{tag}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
