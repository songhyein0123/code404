"use client";

import dynamic from "next/dynamic";
import React, { useRef } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor as ToastEditor } from "@toast-ui/react-editor";

// 인터페이스 정의
interface MarkdownEditorProps {
    inEditorChange: (content: string) => void;
}

// ToastUI Editor를 동적으로 불러오기
const Editor = dynamic(() => import("@toast-ui/react-editor").then((mod) => mod.Editor), { ssr: false });

const MarkdownEditor = ({ onEditorChange }: MarkdownEditorProps) => {
    // 'useRef'에서 'ToastEditor' 타입을 사용
    const editorRef = useRef<ToastEditor>(null);

    const handleEditorChange = () => {
        const editorInstance = editorRef.current?.getInstance();
        if (editorInstance) {
            onEditorChange(editorInstance.getMarkdown());
        }
    };

    return (
        <div>
            <label>내용 작성</label>
            <Editor
                ref={editorRef}
                initialValue="내용을 작성하세요."
                previewStyle="vertical"
                height="400px"
                initialEditType="markdown"
                useCommandShortcut={false}
                onChange={handleEditorChange}
            />
        </div>
    );
};

export default React.memo(MarkdownEditor);
