"use client";

import { useState } from "react";

export default function NewPostPage() {
    const [title, setTitle] = useState("");
    return (
        <div>
            {/* 제목 입력 */}
            <div>
                <label>제목</label>
                <input type="text" value={title} onChange={} className="" placeholder="글 제목을 입력하세요" />
            </div>
        </div>
    );
}
