import { getUser } from "@/services/authService";
import { User } from "../../types/User";
import Link from "next/link";
import RightItem from "./RightNavibartem";

const Navibar = async () => {
    const user: User | null = await getUser();

    return (
        <header className="fixed top-0 w-full">
            <nav className="flex flex-row justify-between items-center w-full h-[80px] px-16 bg-[#181F38]">
                <div className="w-[50px] h-[50px] bg-white"></div>
                {user ? (
                    <RightItem user={user} />
                ) : (
                    <div className="relative flex flex-row items-center gap-6">
                        <Link className="flex items-center" href={"/auth/login"}>
                            <button className="rounded-md text-white font-bold bg-[#00D084] py-2 px-3 hover:bg-[#FFBA00]">
                                로그인
                            </button>
                        </Link>
                        <Link href={"/auth/register"}>
                            <button className="rounded-md text-white font-bold bg-[#00D084] py-2 px-3 hover:bg-[#FFBA00]">
                                회원가입
                            </button>
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navibar;
