"use client";

import { useState, useCallback } from "react";
import TItleInput from "./_components/TItleInput";
import HashtagInput from "./_components/HashtagInput";
import MarkdownEditor from "./_components/MarkdownEditor";

export default function WritePostPage() {
    const [title, setTitle] = useState("");
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState("");
    const [markdownContent, setMarkdownContent] = useState("");

    // 제목 변경 함수
    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    }, []);

    // 해시태그 추가 및 삭제 함수
    const handleTagChange = useCallback((newHashtags: string[], currentTag: string) => {
        setHashtags(newHashtags);
        setCurrentTag(currentTag);
    }, []);

    // 마크다운 에디터 내용 변경 함수
    const handleEditorChange = useCallback((content: string) => {
        setMarkdownContent(content);
    }, []);

    return (
        <div>
            {/* 제목 입력 */}
            <TItleInput title={title} onTitleChange={handleTitleChange} />

            {/* 해시태그 입력 */}
            <HashtagInput hashtags={hashtags} currentTag={currentTag} onTagChange={handleTagChange} />

            {/* 마트다운 에디터 */}
            <MarkdownEditor onEditorChange={handleEditorChange} />

            {/* 작성 완료 버튼 */}
            <div>
                <button>작성 완료</button>
            </div>
        </div>
    );
}
