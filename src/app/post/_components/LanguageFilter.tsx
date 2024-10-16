interface LanguageFilterProps {
    allHashtags: string[];
    selectedTags: string[];
    onTagChange: (tag: string) => void;
}

const LanguageFilter = ({ allHashtags, selectedTags, onTagChange }: LanguageFilterProps) => {
    return (
        <div className="relative">
            {allHashtags.map((tag) => (
                <div key={tag} className="px-4 py-2">
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedTags.includes(tag)}
                            onChange={() => onTagChange(tag)}
                            className="mr2"
                        />
                        <span className="text-gray-700">{tag}</span>
                    </label>
                </div>
            ))}
        </div>
    );
};

export default LanguageFilter;
