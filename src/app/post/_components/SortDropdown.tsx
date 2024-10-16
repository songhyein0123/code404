export function SortDropdown({ onSortChange }: { onSortChange: (value: string) => void }) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSortChange(e.target.value);
    };

    return (
        <select onChange={handleChange} className="border rounded p-2">
            <option value="latest">최신순</option>
            <option value="title">제목순</option>
        </select>
    );
}
