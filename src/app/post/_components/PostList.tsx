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
    return (
        <div>
            {posts.map((post) => (
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
        </div>
    );
};

export default PostList;
