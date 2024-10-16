export function LanguageFilter({
    allHashtags,
    selectedTags,
    onTagChange
}: {
    allHashtags: string[];
    selectedTags: string[];
    onTagChange: (tag: string) => void;
}) {
    return (
        <div className="relative">
            {allHashtags.map((tag) => (
                <label key={tag} className="px-4 py-2">
                    <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => onTagChange(tag)}
                        className="mr-2"
                    />
                    <span className="text-gray-700">{tag}</span>
                </label>
            ))}
        </div>
    );
}
