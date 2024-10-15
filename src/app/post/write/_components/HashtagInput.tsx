"use client";

import React from "react";

interface HashtagInputProps {
    hashtags: string[];
    currentTag: string;
    onTagInputChange: (tag: string) => void;
    onTagKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onRemoveTag: (tag: string) => void;
}

const HashtagInput = ({ hashtags, currentTag, onTagInputChange, onTagKeyPress, onRemoveTag }: HashtagInputProps) => {
    return (
        <div>
            <label>해시태그</label>
            <div>
                {hashtags.map((tag) => (
                    <div key={tag}>
                        {tag}
                        <button type="button" onClick={() => onRemoveTag(tag)}>
                            &times;
                        </button>
                    </div>
                ))}
                <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => onTagInputChange(e.target.value)}
                    onKeyPress={onTagKeyPress}
                    placeholder="해시태그를 입력하고 엔터를 누르세요"
                />
            </div>
        </div>
    );
};

export default React.memo(HashtagInput);
