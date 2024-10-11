export default function Board() {
    return (
        <div>
            {/* 게시글 목록 */}
            {pagenatedPosts.map((post) => (
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
