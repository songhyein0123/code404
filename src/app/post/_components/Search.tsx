import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface SearchProps {
    onSearch: (searchTerm: string) => void; // 검색어를 상위 컴포넌트로 전달하는 함수
}

const Search = ({ onSearch }: SearchProps) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        onSearch(value); // 입력이 바뀔 때마다 상위 컴포넌트에 검색어 전달
    };

    return (
        <div className="flex items-center">
            <FontAwesomeIcon icon={faSearch} className="text-gray-500 mr-2" />
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="제목 또는 작성자 검색"
                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none"
            />
        </div>
    );
};

export default Search;
