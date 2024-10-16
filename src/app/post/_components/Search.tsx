import React, { useState } from "react";

const Search = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // 검색 기능 구현
        console.log("검색어:", searchTerm);
    };

    return (
        <form onSubmit={handleSearchSubmit} className="flex space-x-2">
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="검색어를 입력하세요"
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                검색
            </button>
        </form>
    );
};

export default Search;
