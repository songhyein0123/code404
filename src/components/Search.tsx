import { useState } from "react";

interface SearchComponentProps {
    onSearch: (term: string) => void;
}

export function Search({ onSearch }: SearchComponentProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = () => {
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
