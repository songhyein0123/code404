import { getUser } from "@/services/authService";
import { User } from "../../types/User";
import Link from "next/link";
import RightItem from "./RightNavibartem";

const Navibar = async () => {
    const user: User | null = await getUser();

    return (
        <header className="fixed top-0 w-full">
            <nav className="fixed top-0 flex flex-row justify-between items-center w-full h-[80px] bg-gray-500">
                <div></div>
                <div>
                    {user ? (
                        <RightItem user={user} />
                    ) : (
                        <div className="flex flex-row gap-[15px]">
                            <Link href={"/auth/login"}>
                                <button>로그인</button>
                            </Link>
                            <Link href={"/auth/register"}>
                                <button>회원가입</button>
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navibar;
