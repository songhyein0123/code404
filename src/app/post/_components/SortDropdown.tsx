import { useState } from "react";

interface SortOption {
    label: string;
    value: string;
}

const sortOptions: SortOption[] = [
    { label: "최신순", value: "latest" },
    { label: "게시글 이름 순", value: "title" }
];

interface SortDropdownProps {
    onSortChange: (value: string) => void;
}

export default function SortDropdown({ onSortChange }: SortDropdownProps) {
    const [selectedOption, setSelectedOption] = useState(sortOptions[0].value);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedOption(value);
        onSortChange(value);
    };

    return (
        <select value={selectedOption} onChange={handleChange} className="border rounded-md p-2 mr-4">
            {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}
