"use client";

import { useState } from "react";

export default function NewPostPage() {
    const [title, setTitle] = useState("");
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState("");
    return (
        <div>
            {/* 제목 입력 */}
            <div>
                <label>제목</label>
                <input type="text" value={title} onChange={} className="" placeholder="글 제목을 입력하세요" />
            </div>
            {/* 해시태그 입력 */}
            <div>
                <label>해시태그</label>
                <div>
                    {/* 해시태그 배지 */}
                    {hashtags.map((tag) => {
                        <div key={tag}>
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="">
                                &times;
                            </button>
                        </div>;
                    })}

                    {/* 해시태그 입력 필드 */}
                    <input
                        type="text"
                        value={currentTag}
                        onChange={handleTagInputChange}
                        onKeyPress={handleTagKeyPress}
                        className=""
                        placeholder="해시태그를 입력하고 엔터를 누르세요!"
                    />
                </div>
            </div>
        </div>
    );
}
