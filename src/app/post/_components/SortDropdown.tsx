import React from "react";

interface SortDropdownProps {
    sortOrder: "latest" | "title";
    onSortChange: (sortOrder: "latest" | "title") => void; // 정렬 상태 변경 핸들러
}

const SortDropdown = ({ sortOrder, onSortChange }: SortDropdownProps) => {
    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSortOrder = event.target.value as "latest" | "title"; // 타입 단언
        onSortChange(selectedSortOrder); // 정렬 상태 변경
    };

    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">정렬 기준</h2>
            <select
                value={sortOrder}
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
