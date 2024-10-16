"use client";

import { useState, useRef, useEffect } from "react";
import { User } from "../../types/User";
import Image from "next/image";
import { navigate } from "@/services/authService";
import Link from "next/link";

const RightItem = ({ user }: { user: User }) => {
    const [isOpen, setIsOpen] = useState(false);
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
            console.log("로그아웃 성공");
            navigate();
        } else {
            alert("로그아웃 하는데 오류가 발생하였습니다.");
            console.log("로그아웃 실패");
        }
    };

    return (
        <div
            className="relative flex flex-row items-center gap-4 cursor-pointer h-full"
            ref={popupRef}
            onClick={() => setIsOpen((isOpen) => !isOpen)}
        >
            <span className="text-white font-semibold">{user.user_name}</span>
            <Image
                className="rounded-full border-none bg-white"
                src={user.profile_url}
                alt={""}
                width={60}
                height={60}
            />
            {isOpen && (
                <div
                    className="absolute top-[110%] py-3 px-5 justify-start list-none leading-8 border-[1px] border-black border-solid rounded-md"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ul>
                        <li>
                            <Link href={"/profile"}>마이페이지</Link>
                        </li>
                        <li onClick={handleSignout}>로그아웃</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default RightItem;
