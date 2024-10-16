import { getUser } from "@/services/authService";
import { User } from "../../types/User";
import Link from "next/link";
import RightItem from "./RightNavibartem";

const Navibar = async () => {
    const user: User | null = await getUser();

    return (
        <header className="fixed top-0 w-full">
            <nav className="px-8 flex flex-row justify-between w-full h-[80px] bg-[#181F38]">
                <div></div>
                <div>
                    {user ? (
                        <RightItem user={user} />
                    ) : (
                        <div className="relative flex flex-row items-center gap-8 w-auto h-full">
                            <Link className="flex h-full items-center" href={"/auth/login"}>
                                <button className="h-1/2 bg-[#00D084] ">로그인</button>
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
