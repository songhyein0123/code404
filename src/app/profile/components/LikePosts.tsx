import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { FaHeart } from "react-icons/fa";

interface Post {
    board_id: string;
    title: string;
    created_at: string;
    user_id: string;
}

interface LikedPostsProps {
    userId: string;
}

const LikedPosts = ({ userId }: LikedPostsProps) => {
    const [likedPostData, setLikedPostData] = useState<Post[]>([]);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        if (userId) {
            fetchLikedPosts();
        }
    }, [userId]);

    const fetchLikedPosts = async () => {
        try {
            // 사용자 좋아요 데이터 가져오기
            const { data: userLikedPosts, error } = await supabase
                .from("Like")
                .select("board_id")
                .eq("user_id", userId);

            if (error) throw error;

            const postIds = userLikedPosts?.map((likedPost) => likedPost.board_id) || [];

            if (postIds.length === 0) {
                setLikedPostData([]);
                return;
            }

            // 좋아요한 게시글 데이터 가져오기
            const { data: likedPostData, error: postDataError } = await supabase
                .from("Post")
                .select("*")
                .in("board_id", postIds);

            if (postDataError) throw postDataError;

            setLikedPostData(likedPostData || []);
        } catch (error) {
            console.error("Error fetching liked posts:", error);
        }
    };

    const handleUnlike = async (postId: string) => {
        try {
            const { error } = await supabase.from("Like").delete().eq("board_id", postId).eq("user_id", userId);

            if (error) throw error;

            setLikedPostData((prevLikedPostData) => prevLikedPostData.filter((post) => post.board_id !== postId));
        } catch (error) {
            console.error("Error unliking post:", error);
        }
    };

    return (
        <div className="p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-2 text-black">좋아요한 게시글</h3>
            {likedPostData.length === 0 ? (
                <p className="text-black">좋아요한 게시물이 없습니다.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {likedPostData.map((likedPost) => (
                        <div
                            key={likedPost.board_id}
                            className="border-2 border-neonGreen p-4 rounded-lg bg-gray-800 text-white cursor-pointer"
                            onClick={() => router.push(`/posts/${likedPost.board_id}`)}
                        >
                            <h4 className="font-bold mb-2">{likedPost.title}</h4>
                            <p className="mb-4">{new Date(likedPost.created_at).toLocaleString()}</p>
                            <button
                                className="text-red-500 hover:text-orange transition duration-300 ml-auto block"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleUnlike(likedPost.board_id);
                                }}
                            >
                                <FaHeart />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LikedPosts;
