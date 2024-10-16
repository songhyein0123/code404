import { FC, ReactNode, useState } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { report: string; board_id: string }) => Promise<void>;
    boardId: string;
    children?: ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, onSubmit, boardId }) => {
    const [selectedReason, setSelectedReason] = useState<string>("");
    const [otherReason, setOtherReason] = useState<string>("");

    if (!isOpen) return null;

    const handleSubmit = () => {
        const reasonToSubmit = selectedReason === "기타" ? otherReason : selectedReason;
        onSubmit({ report: reasonToSubmit, board_id: boardId });
        setSelectedReason("");
        setOtherReason("");
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">신고 사유를 선택해주세요</h2>
                <div className="mb-4">
                    {/* 라디오 버튼 목록 */}
                    <label className="block">
                        <input
                            type="radio"
                            value="부적절한 주제"
                            checked={selectedReason === "부적절한 주제"}
                            onChange={(e) => setSelectedReason(e.target.value)}
                        />
                        부적절한 주제
                    </label>
                    <label className="block">
                        <input
                            type="radio"
                            value="부정확한 정보"
                            checked={selectedReason === "부정확한 정보"}
                            onChange={(e) => setSelectedReason(e.target.value)}
                        />
                        부정확한 정보
                    </label>
                    <label className="block">
                        <input
                            type="radio"
                            value="중복 게시물 도배"
                            checked={selectedReason === "중복 게시물 도배"}
                            onChange={(e) => setSelectedReason(e.target.value)}
                        />
                        중복 게시물 도배
                    </label>
                    <label className="block">
                        <input
                            type="radio"
                            value="주제와 맞지 않음"
                            checked={selectedReason === "주제와 맞지 않음"}
                            onChange={(e) => setSelectedReason(e.target.value)}
                        />
                        주제와 맞지 않음
                    </label>
                    <label className="block">
                        <input
                            type="radio"
                            value="욕설 및 비방"
                            checked={selectedReason === "욕설 및 비방"}
                            onChange={(e) => setSelectedReason(e.target.value)}
                        />
                        욕설 및 비방
                    </label>
                    <label className="block">
                        <input
                            type="radio"
                            value="기타"
                            checked={selectedReason === "기타"}
                            onChange={(e) => setSelectedReason(e.target.value)}
                        />
                        기타
                    </label>
                    {selectedReason === "기타" && (
                        <input
                            type="text"
                            className="w-full border rounded-md mt-2"
                            placeholder="신고 사유를 입력하세요."
                            value={otherReason}
                            onChange={(e) => setOtherReason(e.target.value)}
                        />
                    )}
                </div>
                <div className="flex justify-end">
                    <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded-md">
                        취소
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                        신고하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
