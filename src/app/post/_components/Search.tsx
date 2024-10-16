import { useState } from "react";

// Search 컴포넌트 props의 타입을 인터페이스로 정의
interface SearchProps {
    onSearch: (searchTerm: string) => void;
}

export function Search({ onSearch }: SearchProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = () => {
        // 입력된 검색어를 부모 컴포넌트로 전달
        onSearch(searchTerm);
    };
    return (
        <div className="flex items-center">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="검색어를 입력하세요."
                className="border border-gray-300 rounded px-4 py-2 h-10"
            />
            <button
                onClick={handleSearch}
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded h-10 flex items-center justify-center"
            >
                검색
            </button>
        </div>
    );
}
