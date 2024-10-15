"use client";

import React, { useCallback, useState } from "react";

interface HashtagInputProps {
    hashtags: string[];
    currentTag: string;
    onTagChange: (newHashtags: string[], currentTag: string) => void;
}

const HashtagInput = ({ hashtags, currentTag, onTagChange }: HashtagInputProps) => {
    const [tagInput, setTagInput] = useState(currentTag);

    // 해시태그 입력 핸들러
    const handleTagInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
    }, []);

    // 엔터 키 입력 시 해시태그 추가
    const handleTagKeyPress = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (tagInput && e.key === "Enter") {
                e.preventDefault();
                const formattedTag = `#${tagInput.trim()}`;
                if (!hashtags.includes(formattedTag)) {
                    onTagChange([...hashtags, formattedTag], "");
                }
                setTagInput("");
            }
        },
        [tagInput, hashtags, onTagChange]
    );

    // 해시태그 삭제 핸들러
    const removeTag = useCallback(
        (tagToRemove: string) => {
            const newTags = hashtags.filter((tag) => tag !== tagToRemove);
            onTagChange(newTags, currentTag);
        },
        [hashtags, currentTag, onTagChange]
    );
    return (
        <div>
            <label>해시태그</label>
            <div>
                {hashtags.map((tag) => (
                    <div key={tag}>
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)}>
                            &times;
                        </button>
                    </div>
                ))}
                <input
                    type="text"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onKeyPress={handleTagKeyPress}
                    placeholder="해시태그를 입력하고 엔터를 누르세요"
                />
            </div>
        </div>
    );
};

export default React.memo(HashtagInput);
