import React, { useState } from "react";

const SortDropdown = () => {
    const [sortOption, setSortOption] = useState("latest");

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(event.target.value);
    };

    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">정렬 기준</h2>
            <select
                value={sortOption}
                onChange={handleSortChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none"
            >
                <option value="latest">최신순</option>
                <option value="title">제목순</option>
            </select>
        </div>
    );
};

export default SortDropdown;
