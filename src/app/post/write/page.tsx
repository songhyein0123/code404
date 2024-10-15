"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor as ToastEditor } from "@toast-ui/react-editor";

// 인터페이스 정의
interface PostPageState {
    title: string;
    hashtags: string[];
    currentTag: string;
    markdownContent: string;
}

export default function WritePostPage() {
    const [state, setState] = useState<PostPageState>({
        title: "",
        hashtags: [],
        currentTag: "",
        markdownContent: ""
    });

    // 에디터 참조
    const editorRef = useRef<ToastEditor | null>(null);

    // 제목 입력 핸들러
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState((prevState) => ({ ...prevState, title: e.target.value }));
    };

    // 해시태그 입력 핸들러
    const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState((prevState) => ({ ...prevState, currentTag: e.target.value }));
    };

    // 해시태그 입력 시 엔터 키 처리
    const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (state.currentTag && e.key === "Enter") {
            e.preventDefault(); // 기본 엔터 키 동작 방지
            const formattedTag = `#${state.currentTag.trim()}`; // 해시태그 포맷
            if (!state.hashtags.includes(formattedTag)) {
                setState((prevState) => ({
                    ...prevState,
                    hashtags: [...prevState.hashtags, formattedTag], // 새로운 해시태그 추가
                    currentTag: "" // 입력 필드 초기화
                }));
            }
        }
    };

    // 해시태그 삭제 함수
    const removeTag = (tagToRemove: string) => {
        setState((prevState) => ({
            ...prevState,
            // 선택된 해시태그 제거
            hashtags: prevState.hashtags.filter((tag) => tag !== tagToRemove)
        }));
    };

    // 마크다운 에디터 내용 변경 함수
    const handleEditorChange = () => {
        const editorInstance = editorRef.current?.getInstance();
        if (editorInstance) {
            setState((prevState) => ({
                ...prevState,
                // 에디터의 마크다운 내용을 상태에 저장
                markdownContent: editorInstance.getMarkdown()
            }));
        }
    };

    // 에디터 컴포넌트 로드
    const Editor = dynamic(() => import("@toast-ui/react-editor").then((mod) => mod.Editor), { ssr: false });

    return (
        <div className="container mx-auto p-4">
            {/* 제목 입력 */}
            <div className="mb-4">
                <label className="block text-lg font-medium mb-2">제목</label>
                <input
                    type="text"
                    value={state.title}
                    onChange={handleTitleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="글 제목을 입력하세요"
                />
            </div>
            {/* 해시태그 입력 */}
            <div className="mb-4">
                <label className="block text-lg font-medium mb-2">해시태그</label>
                <div className="flex flex-wrap items-center gap-2 border border-gray-300 p-2 rounded">
                    {/* 해시태그 배지 */}
                    {state.hashtags.map((tag) => (
                        <div key={tag} className="bg-blue-200 text-blue-700 px-2 py-1 rounded-full flex items-center">
                            {tag}
                            <button
                                type="button"
                                // 해시태그 삭제 버튼 클릭 시
                                onClick={() => removeTag(tag)}
                                className="ml-2 text-blue-500"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    <input
                        type="text"
                        value={state.currentTag}
                        onChange={handleTagInputChange}
                        onKeyPress={handleTagKeyPress}
                        className="flex-grow p-2 outline-none"
                        placeholder="해시태그를 입력하고 엔터를 누르세요"
                    />
                </div>
            </div>

            {/* 마크다운 에디터 */}
            <div className="flex">
                <div className="flex-grow">
                    <label className="block text-lg font-medium mb-2">내용 작성</label>
                    <Editor
                        ref={editorRef}
                        initialValue="내용을 작성하세요."
                        previewStyle="vertical"
                        height="400px"
                        initialEditType="markdown"
                        useCommandShortcut={false}
                        autofocus={false}
                        onChange={handleEditorChange} // 에디터 내용 변경 시 핸들러
                    />
                </div>
            </div>
            {/* 작성 완료 버튼 */}
            <div className="mt-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded">작성 완료</button>
            </div>
        </div>
    );
}
