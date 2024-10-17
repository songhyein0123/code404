"use client";

import { useState, useCallback } from "react";
import TitleInput from "./_components/TitleInput";
import HashtagInput from "./_components/HashtagInput";
import MarkdownEditor from "./_components/MarkdownEditor";
import { useRouter } from "next/navigation";
import { Post } from "../_components/PostMockData"; // Post 인터페이스 import

// 글쓰기 페이지
export default function WritePostPage() {
    const [title, setTitle] = useState("");
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState("");
    const [content, setContent] = useState("");
    const router = useRouter();

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

    // 작성 완료 함수
    const handleSubmit = () => {
        const newPost: Post = {
            id: Date.now(), // 고유 ID 생성
            title,
            author: "작성자 이름", // 작성자 이름 설정
            date: new Date().toISOString(), // 현재 날짜
            hashtags,
            content
        };

        // 추가적인 게시글 저장 로직 (예: API 호출 등)을 여기에 추가

        console.log("게시글 작성 완료:", newPost); // 게시글 정보 로그
        router.push("/post"); // 게시글 목록 페이지로 이동
    };

    return (
        <div className="container mx-auto p-4 mt-20">
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
                <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
                    작성 완료
                </button>
            </div>
        </div>
    );
}
