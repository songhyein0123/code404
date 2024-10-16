interface TitleInputProps {
    title: string;
    setTitle: (title: string) => void; // title을 string으로 받음
}

const TitleInput = ({ title, setTitle }: TitleInputProps) => {
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value); // 입력된 값을 setTitle로 전달
    };

    return (
        <div>
            <label className="block text-lg font-medium mb-2">제목</label>
            <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="제목을 입력하세요."
            />
        </div>
    );
};

export default TitleInput;
