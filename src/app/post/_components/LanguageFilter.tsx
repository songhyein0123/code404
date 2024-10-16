import React from "react";

interface LanguageFilterProps {
    languages?: string[]; // 필터링할 언어 배열
    onFilterChange: (language: string) => void; // 언어 변경 시 호출될 함수
}

const LanguageFilter = ({ languages = [], onFilterChange }: LanguageFilterProps) => {
    return (
        <div>
            <label htmlFor="language" className="mr-2">
                언어 선택:
            </label>
            <select
                id="language"
                onChange={(e) => onFilterChange(e.target.value)} // 언어 선택 시 호출
                className="border p-1"
            >
                <option value="">모두 보기</option>
                {languages.map((language) => {
                    return (
                        <option key={language} value={language}>
                            {language} {/* 언어 옵션 */}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default LanguageFilter;
