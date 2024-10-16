import { memo } from "react";

interface HashtagInputProps {
    hashtags: string[];
    setHashtags: (hashtags: string[]) => void; // 정확한 타입 정의
}

// 해시태그 입력 컴포넌트
const HashtagInput = ({ hashtags, setHashtags }: HashtagInputProps) => {
    return (
        <div className="mb-4">
            <label className="block text-lg font-medium mb-2">해시태그</label>
            <div className="flex flex-wrap items-center gap-2 border border-gray-300 p-2 rounded">
                {hashtags.map((tag, index) => (
                    <div key={index} className="bg-blue-200 text-blue-700 px-2 py-1 rounded-full flex items-center">
                        {tag}
                        <button
                            type="button"
                            onClick={() => setHashtags(hashtags.filter((_, i) => i !== index))}
                            className="ml-2 text-blue-500"
                        >
                            &times;
                        </button>
                    </div>
                ))}
                <input
                    type="text"
                    className="flex-grow p-2 outline-none"
                    placeholder="해시태그를 입력하고 엔터를 누르세요"
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            const newTag = (e.target as HTMLInputElement).value.trim();
                            if (newTag && !hashtags.includes(newTag)) {
                                setHashtags([...hashtags, newTag]);
                                (e.target as HTMLInputElement).value = "";
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default memo(HashtagInput);
