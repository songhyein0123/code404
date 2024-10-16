"use client";

import { useState, useRef, useEffect } from "react";
import { User } from "../../types/User";
import { navigate } from "@/services/authService";
import { useRouter } from "next/navigation";

const RightItem = ({ user }: { user: User }) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const popupRef = useRef<HTMLDivElement | null>(null); // 팝업 요소를 참조하기 위한 ref

    const handleClickOutside = (event: MouseEvent) => {
        // 클릭한 요소가 팝업 요소가 아닌 경우에만 닫기
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        // 컴포넌트가 마운트되었을 때 전역 클릭 이벤트 리스너를 추가
        document.addEventListener("mousedown", handleClickOutside);

        // 컴포넌트가 언마운트되었을 때 전역 클릭 이벤트 리스너를 제거
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSignout = async () => {
        const response = await fetch("/api/signout", {
            method: "POST"
        });

        const result = await response.json();

        if (result.success) {
            navigate();
        } else {
            alert("로그아웃 하는데 오류가 발생하였습니다.");
        }
    };

    const handlieClickMypage = () => {
        router.push("/profile");
        setIsOpen((isOpen) => !isOpen);
    };

    const handlieClickAdminpage = () => {
        router.push("/admin");
        setIsOpen((isOpen) => !isOpen);
    };

    return (
        <div
            className="relative flex flex-row items-center gap-4 cursor-pointer h-full py-3"
            ref={popupRef}
            onClick={() => setIsOpen((isOpen) => !isOpen)}
        >
            <span className="text-white font-semibold">{user.user_name}</span>

            <img className="rounded-full border-none bg-white h-full aspect-square" src={user.profile_url} />
            {isOpen && (
                <div
                    className="absolute top-[110%] py-3 px-5 justify-start list-none leading-8 border-[1px] border-black border-solid rounded-md bg-white"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ul>
                        {user.admin && <li onClick={handlieClickAdminpage}>관리자 페이지</li>}
                        <li onClick={handlieClickMypage}>마이페이지</li>
                        <li onClick={handleSignout}>로그아웃</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default RightItem;
