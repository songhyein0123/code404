// app/admin/_components/SideBar.tsx
import Link from "next/link";

const SideBar = () => {
    return (
        <div className="w-64 h-screen bg-gray-500 p-5 fixed top-[80px] border-solid border-2 border-black flex flex-col justify-center">
            <Link href="/admin/board">
                <div className="h-24 border-solid border-2 border-black text-center text-3xl text-black content-center">
                    게시글 목록
                </div>
            </Link>
            <Link href="/admin/user">
                <div className="h-24 border-solid border-2 border-black text-center mt-2 text-3xl text-black content-center">
                    유저관리
                </div>
            </Link>
            <Link href="/admin/report">
                <div className="h-24 border-solid border-2 border-black text-center mt-2 text-3xl text-black content-center">
                    신고된 게시글
                </div>
            </Link>
            <Link href="/admin/chart">
                <div className="h-24 border-solid border-2 border-black text-center mt-2 text-3xl text-black content-center">
                    데이터 차트
                </div>
            </Link>
        </div>
    );
};

export default SideBar;
