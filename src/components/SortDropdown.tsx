import { useState } from "react";

interface SortOption {
    label: string;
    value: string;
}

const sortOptions: SortOption[] = [
    { label: "최신순", value: "latest" },
    { label: "좋아요 순", value: "likes" }
];

interface SortDropdownProps {
    onSortChange: (value: string) => void;
}

export default function SortDropdown({ onSortChange }: SortDropdownProps) {
    const [selectedOption, setSelectedOption] = useState(sortOptions[0].value);

    return <div>SortDropdown</div>;
}
