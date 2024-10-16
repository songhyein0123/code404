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
                <div key={post.id}>
                    <div>{post.title}</div>
                    <div>
                        <span>{post.author}</span> <span>{post.date}</span>
                        {post.hashtags.slice(0, 3).map((tag, idx) => (
                            <span key={idx}>{tag}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PostList;
