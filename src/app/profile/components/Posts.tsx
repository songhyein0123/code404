import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Post {
    board_id: string;
    title: string;
    created_at: string;
    user_id: string;
}

interface PostsProps {
    userId: string;
}

const Posts = ({ userId }: PostsProps) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        if (userId) {
            fetchUserPosts();
        }
    }, [userId]);

    const fetchUserPosts = async () => {
        try {
            const { data: userPosts, error } = await supabase.from("Post").select("*").eq("user_id", userId);

            if (error) throw error;

            setPosts(userPosts || []);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    return (
        <div className="p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-2 text-black">작성한 게시글</h3>
            {posts.length === 0 ? (
                <p className="text-black">작성한 게시물이 없습니다.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {posts.map((post) => (
                        <div
                            key={post.board_id}
                            className="border-2 border-neonGreen p-4 rounded-lg bg-gray-800 text-white"
                            onClick={() => router.push(`/posts/${post.board_id}`)}
                        >
                            <h4 className="font-bold mb-2">{post.title}</h4>
                            <p>{new Date(post.created_at).toLocaleString()}</p>
                            <button
                                className="text-neonGreen hover:text-orange transition duration-300 ml-auto block"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/posts/edit/${post.board_id}`);
                                }}
                            ></button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Posts;
