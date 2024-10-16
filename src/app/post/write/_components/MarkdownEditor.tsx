"use client";

import dynamic from "next/dynamic";
import React, { useRef } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor as ToastEditor } from "@toast-ui/react-editor";

// 인터페이스 정의
interface MarkdownEditorProps {
    onEditorChange: (content: string) => void;
}

// ToastUI Editor를 동적으로 불러오기
const Editor = dynamic(() => import("@toast-ui/react-editor").then((mod) => mod.Editor), { ssr: false });

const MarkdownEditor = ({ onEditorChange }: MarkdownEditorProps) => {
    // 'useRef'에서 'ToastEditor' 타입을 사용
    const editorRef = useRef<ToastEditor | null>(null);

    // 에디터 내용 변경 핸들러
    const handleEditorChange = () => {
        const editorInstance = editorRef.current?.getInstance();
        if (editorInstance) {
            onEditorChange(editorInstance.getMarkdown());
        }
    };

    return (
        <div>
            <label className="block text-lg font-medium mb-2">내용 작성</label>
            <Editor
                initialValue="내용을 작성하세요."
                previewStyle="vertical"
                height="400px"
                initialEditType="markdown"
                useCommandShortcut={false}
                onChange={handleEditorChange} // ref 대신 onChange 이벤트로 에디터 핸들링
            />
        </div>
    );
};

export default React.memo(MarkdownEditor);
