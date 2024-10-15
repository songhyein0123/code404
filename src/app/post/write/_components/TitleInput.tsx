"use client";

import React from "react";

// 인터페이스 정의
interface TitleInputProps {
    title: string;
    onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TitleInput = ({ title, onTitleChange }: TitleInputProps) => {
    return (
        <div className="mb-4">
            <label className="block text-lg font-medium mb-2">제목</label>
            <input
                type="text"
                value={title}
                onChange={onTitleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="글 제목을 입력하세요"
            />
        </div>
    );
};

export default React.memo(TitleInput);
