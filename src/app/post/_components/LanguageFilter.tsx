import React, { useState } from "react";

const languages = ["All", "JavaScript", "TypeScript", "Python", "Java", "C++"];

const LanguageFilter = () => {
    const [selectedLanguage, setSelectedLanguage] = useState("All");

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLanguage(event.target.value);
    };

    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">언어 필터</h2>
            <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none"
            >
                {languages.map((language, index) => (
                    <option key={index} value={language}>
                        {language}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageFilter;
