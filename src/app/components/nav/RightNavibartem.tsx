"use client";

import { useState } from "react";
import { User } from "../../types/User";
import Image from "next/image";
import { navigate } from "@/services/authService";
import Link from "next/link";

const RightItem = ({ user }: { user: User }) => {
    const [menuIsOn, setMenuIsOn] = useState<boolean>(false);

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
            className="relative flex flex-row items-center gap-[15px] cursor-pointer bg-blue-300"
            onClick={() => setMenuIsOn(!menuIsOn)}
        >
            <span className="text-black">{user.user_name}</span>
            <Image className="flex rounded-full border-none" src={user.profile_url} alt={""} width={70} height={70} />
            {menuIsOn && (
                <div
                    className="absolute top-full w-[100px] h-auto flex flex-col justify-start items-center bg-red-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Link href={"/profile"}>
                        <span>마이페이지</span>
                    </Link>
                    <hr className="w-full h-[2px] bg-gray-50"></hr>
                    <button onClick={handleSignout}>로그아웃</button>
                </div>
            )}
        </div>
    );
};

export default RightItem;
