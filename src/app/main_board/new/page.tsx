"use client";

import Editor from "@toast-ui/react-editor";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";

// 인터페이스 정의
interface PostPageState {
    title: string;
    hashtags: string[];
    currentTag: string;
    markdownContent: string;
}

interface ChangeEvent {
    currentTarget: {
        value: string;
    };
}

const Editor = dynamic(() => import("@toast-ui/react-editor").then((mod) => mod.Editor), { ssr: false });

export default function NewPostPage() {
    const [state, setState] = useState<PostPageState>({
        title: "",
        hashtags: [],
        currentTag: "",
        markdownContent: ""
    });

    // 에디터 참조
    const editorRef = useRef<any>(null);

    // 해시태그 입력 함수
    const handleTagInputChange = (e: ChangeEvent) => {
        // 해시태그 상태 업데이트
        setState((prevState) => ({ ...prevState, currentTag: e.currentTarget.value }));
    };

    // 해시태그 입력 시 엔터 키 처리
    const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // 엔터 기와 빈 문자열이 아닐 경우
        if (state.currentTag && e.key === "Enter") {
            // 기본 엔터 키 동작 방지
            e.preventDefault();
            // 해시태그 모양을 나타내는 포맷
            const formattedTag = `#${state.currentTag.trim()}`;
            if (!state.hashtags.includes(formattedTag)) {
                setState((prevState) => ({
                    ...prevState,
                    // 새로운 해시태그 추가
                    hashtags: [...prevState.hashtags, formattedTag]
                }));
            }
            // 입력 필드를 초기화
            setState((prevState) => ({ ...prevState, currentTag: "" }));
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
        // 에디터 인스턴스 가져오기
        const editorInstance = editorRef.current?.getInstance();
        if (editorInstance) {
            setState((prevState) => ({
                ...prevState,
                // 에디터의 마크다운 내용을 상태에 저장
                markdownContent: editorInstance.getMarkdown()
            }));
        }
    };

    return (
        <div>
            {/* 제목 입력 */}
            <div>
                <label>제목</label>
                <input type="text" value={state.title} onChange={} className="" placeholder="글 제목을 입력하세요" />
            </div>
            {/* 해시태그 입력 */}
            <div>
                <label>해시태그</label>
                <div>
                    {/* 해시태그 배지 */}
                    {state.hashtags.map((tag) => {
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
                        value={state.currentTag}
                        onChange={handleTagInputChange}
                        onKeyPress={handleTagKeyPress}
                        className=""
                        placeholder="해시태그를 입력하고 엔터를 누르세요!"
                    />
                </div>
            </div>

            {/* 마크다운 에디터 */}
            <div>
                <div>
                    <label>내용 작성</label>
                    <Editor
                        ref={editorRef}
                        initialValue="내용을 작성하세요."
                        previewStyle="vertical"
                        height="400px"
                        initialEditType="markdown"
                        useCommandShortcut={true}
                        onChange={handleEditorChange}
                    />
                </div>

                {/* 미리보기 */}
                <div>
                    <label>미리보기</label>
                    <div>
                        {/* 마크다운으로 작성한 내용 미리보기 */}
                        <div dangerouslySetInnerHTML={{ __html: state.markdownContent }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
