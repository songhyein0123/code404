export function Search({ onSearch }: { onSearch: (query: string) => void }) {
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const query = formData.get("search")?.toString() || "";
        onSearch(query);
    };

    return (
        <form onSubmit={handleSearch} className="relative">
            <input type="text" name="search" placeholder="검색어를 입력하세요" className="border rounded p-2" />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded ml-2">
                검색
            </button>
        </form>
    );
}
