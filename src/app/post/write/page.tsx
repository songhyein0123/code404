"use client";

import { useState, useCallback } from "react";
import TitleInput from "./_components/TItleInput";
import HashtagInput from "./_components/HashtagInput";
import MarkdownEditor from "./_components/MarkdownEditor";

// 글쓰기 페이지
export default function WritePostPage() {
    const [title, setTitle] = useState("");
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState("");
    const [content, setContent] = useState("");

    // 제목 변경 함수
    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    }, []);

    // 해시태그 입력 함수
    const handleTagInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentTag(e.target.value);
    }, []);

    // 해시태그 입력 후 엔터 처리 함수
    const handleTagKeyPress = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (currentTag && e.key === "Enter") {
                e.preventDefault();
                const formattedTag = `#${currentTag.trim()}`;
                if (!hashtags.includes(formattedTag)) {
                    setHashtags((prevTags) => [...prevTags, formattedTag]);
                    setCurrentTag("");
                }
            }
        },
        [currentTag, hashtags]
    );

    // 해시태그 삭제 함수
    const removeTag = useCallback((tagToRemove: string) => {
        setHashtags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
    }, []);

    // 마크다운 에디터 내용 변경 함수
    const handleEditorChange = useCallback((newContent: string) => {
        setContent(newContent);
    }, []);

    return (
        <div className="container mx-auto p-4">
            <TitleInput title={title} onTitleChange={handleTitleChange} />
            <HashtagInput
                hashtags={hashtags}
                currentTag={currentTag}
                onTagChange={handleTagInputChange}
                onTagKeyPress={handleTagKeyPress}
                removeTag={removeTag}
            />
            <MarkdownEditor onEditorChange={handleEditorChange} />
            <div className="mt-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded">작성 완료</button>
            </div>
        </div>
    );
}
