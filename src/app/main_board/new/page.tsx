"use client";

import { useState } from "react";

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

export default function NewPostPage() {
    const [state, setState] = useState<PostPageState>({
        title: "",
        hashtags: [],
        currentTag: "",
        markdownContent: ""
    });

    // 해시태그 삭제 함수
    const removeTag = (tagToRemove: string) => {
        setState((prevState) => ({
            ...prevState,
            // 선택된 해시태그 제거
            hashtags: prevState.hashtags.filter((tag) => tag !== tagToRemove)
        }));
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
        </div>
    );
}
