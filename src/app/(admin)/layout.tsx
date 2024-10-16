// app/admin/layout.tsx
import { ReactNode } from "react";
import SideBar from "./_components/Sidebar";

type LayoutProps = {
    children: ReactNode;
};

const AdminLayout = ({ children }: LayoutProps) => {
    return (
        <div className="flex">
            <SideBar />
            <div className="ml-64 mt-[80px] flex-grow ">{children}</div>
        </div>
    );
};

export default AdminLayout;
