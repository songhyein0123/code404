"use client";

import React, { useCallback } from "react";

interface TitleInputProps {
    title: string;
    onTitleChange: (title: string) => void;
}

const TitleInput = ({ title, onTitleChange }: TitleInputProps) => {
    const handleTitleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onTitleChange(e.target.value);
        },
        [onTitleChange]
    );

    return (
        <div>
            <label>제목</label>
            <input type="text" value={title} onChange={handleTitleChange} placeholder="글 제목을 입력하세요" />
        </div>
    );
};

export default React.memo(TitleInput);
