import { useState } from "react";

// Search 컴포넌트 props의 타입을 인터페이스로 정의
interface SearchProps {
    onSearch: (searchTerm: string) => void;
}

export function Search({ onSearch }: SearchProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = () => {
        // 입력되 검색어를 부모 컴포넌트로 전달
        onSearch(searchTerm);
    };
    return (
        <div className="flex items-center mb-4">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="검색어를 입력하세요."
                className="w-full p-2 border border-gray-300 rounded-1-md focus:outline-none"
            />
            <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-1 rounded-r-md">
                검색
            </button>
        </div>
    );
}
