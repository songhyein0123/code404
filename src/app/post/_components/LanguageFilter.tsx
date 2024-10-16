interface LanguageFilterProps {
    allHashtags: string[];
    selectedTags: string[];
    onTagChange: (tag: string) => void;
}

const LanguageFilter = ({ allHashtags, selectedTags, onTagChange }: LanguageFilterProps) => {
    return (
        <div>
            {allHashtags.map((tag) => (
                <div key={tag}>
                    <label>
                        <input type="checkbox" checked={selectedTags.includes(tag)} onChange={() => onTagChange(tag)} />
                        <span>{tag}</span>
                    </label>
                </div>
            ))}
        </div>
    );
};

export default LanguageFilter;
