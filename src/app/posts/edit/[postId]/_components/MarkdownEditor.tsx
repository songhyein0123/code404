"use client";

import dynamic from "next/dynamic";
import React, { useRef, useImperativeHandle, forwardRef } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor as ToastEditor } from "@toast-ui/react-editor";

// ToastUI Editor를 동적으로 불러오기
const Editor = dynamic(() => import("@toast-ui/react-editor").then((mod) => mod.Editor), { ssr: false });

// 인터페이스 정의
interface MarkdownEditorProps {
    content: string;
    setContent: (content: string) => void; // content를 string 타입으로 받음
}

// forwardRef를 사용하여 ref를 받을 수 있도록 설정
const MarkdownEditor = forwardRef((props: MarkdownEditorProps, ref) => {
    const editorRef = useRef<ToastEditor>(null); // ToastEditor 타입으로 설정

    useImperativeHandle(ref, () => ({
        getInstance: () => editorRef.current?.getInstance()
        // 추가적인 메서드가 필요하다면 여기에 정의
    }));

    // 에디터 내용 변경 핸들러
    const handleEditorChange = () => {
        const editorInstance = editorRef.current?.getInstance();
        if (editorInstance) {
            props.setContent(editorInstance.getMarkdown()); // setContent로 변경된 내용을 전달
        }
    };

    return (
        <div>
            <label className="block text-lg font-medium mb-2">내용 작성</label>
            <Editor
                initialValue={props.content} // content를 initialValue로 설정
                previewStyle="vertical"
                height="400px"
                initialEditType="markdown"
                useCommandShortcut={false}
                onChange={handleEditorChange} // ref 대신 onChange 이벤트로 에디터 핸들링
            />
        </div>
    );
});

// displayName 설정
MarkdownEditor.displayName = "MarkdownEditor";

export default React.memo(MarkdownEditor);
