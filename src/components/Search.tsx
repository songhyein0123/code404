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
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="검색어를 입력하세요."
                className="border rounded-1 px-2 py-1"
            />
            <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-1 rounded-r">
                검색
            </button>
        </div>
    );
}
