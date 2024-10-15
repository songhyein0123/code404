import { memo } from "react";

interface HashtagInputProps {
    hashtags: string[];
    currentTag: string;
    onTagChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onTagKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    removeTag: (tag: string) => void;
}

// 해시태그 입력 컴포넌트
const HashtagInput = ({ hashtags, currentTag, onTagChange, onTagKeyPress, removeTag }: HashtagInputProps) => {
    return (
        <div className="mb-4">
            <label className="block text-lg font-medium mb-2">해시태그</label>
            <div className="flex flex-wrap items-center gap-2 border border-gray-300 p-2 rounded">
                {hashtags.map((tag) => (
                    <div key={tag} className="bg-blue-200 text-blue-700 px-2 py-1 rounded-full flex items-center">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="ml-2 text-blue-500">
                            &times;
                        </button>
                    </div>
                ))}
                <input
                    type="text"
                    value={currentTag}
                    onChange={onTagChange}
                    onKeyPress={onTagKeyPress}
                    className="flex-grow p-2 outline-none"
                    placeholder="해시태그를 입력하고 엔터를 누르세요"
                />
            </div>
        </div>
    );
};

export default memo(HashtagInput);
