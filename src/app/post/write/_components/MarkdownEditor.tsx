"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useRef } from "react";

interface MarkdownEditorProps {
    markdownContent: string;
    onMarkdownChange: (content: string) => void;
}

const Editor = dynamic(() => import("@toast-ui/react-editor").then((mod) => mod.Editor), { ssr: false });

const MarkdownEditor = ({ markdownContent, onMarkdownChange }: MarkdownEditorProps) => {
    const editorRef = useRef<any>(null);

    useEffect(() => {
        const editorInstance = editorRef.current?.getInstance();
        if (editorInstance) {
            editorInstance.Instance.setMarkdown(markdownContent);
        }
    }, [markdownContent]);

    const handleEditorChange = () => {
        const editorInstance = editorRef.current?.getInstance();
        const newMarkdownContent = editorInstance.getMarkdown();
        onMarkdownChange(newMarkdownContent);
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
