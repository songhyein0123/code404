"use client";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { Line } from "react-chartjs-2";
import { UserType } from "../../types/User";
import { Chart, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend } from "chart.js";
import { PostType } from "../../types/Post";

const supabase = createClient();

Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const fetchUserCounts = async () => {
    const { data, error } = await supabase
        .from("Users")
        .select("*")
        .order("created_at", { ascending: false })
        .eq("activate", true);

    if (error) throw new Error(error.message);

    return data as UserType[];
};

const fetchPosts = async () => {
    const { data, error } = await supabase
        .from("Post")
        .select("*")
        .order("created_at", { ascending: false })
        .eq("publicStatus", true);
    if (error) throw new Error(error.message);
    return data as PostType[];
};

const UserPostChart = () => {
    const {
        data: users,
        isLoading,
        error
    } = useQuery<UserType[], Error>({
        queryKey: ["userCounts"],
        queryFn: fetchUserCounts
    });

    const { data: posts } = useQuery<PostType[], Error>({
        queryKey: ["posts"],
        queryFn: fetchPosts
    });

    if (isLoading)
        return (
            <div className="flex justify-center items-center flex-col min-h-screen bg-gray-100">
                <div className="w-[800px] h-[300px] bg-gray-300"></div>
            </div>
        );

    if (error) return <div>Error: {error.message}</div>;

    if (!users) {
        return <div>데이터가 없습니다.</div>;
    }
    if (!posts) {
        return <div>데이터가 없습니다.</div>;
    }

    // 날짜별 유저 수 계산
    const userCountsByDate = users.reduce((acc, user) => {
        const date = new Date(user.created_at).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // 날짜별 게시글 수 계산
    const postCountsByDate = posts.reduce((acc, post) => {
        const date = new Date(post.created_at).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const chartUserData = {
        labels: Object.keys(userCountsByDate),
        datasets: [
            {
                label: "일자별 유저 가입 수",
                data: Object.values(userCountsByDate),
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1
            }
        ]
    };
    const chartPostData = {
        labels: Object.keys(postCountsByDate),
        datasets: [
            {
                label: "일자별 게시글 작성 수",
                data: Object.values(postCountsByDate),
                fill: false,
                borderColor: "rgb(75,192,192)",
                tension: 0.1
            }
        ]
    };

    return (
        <div className="flex justify-center items-center flex-col min-h-screen bg-gray-100">
            <div className="w-[800px]">
                <Line data={chartUserData} />
                <div className="w-[800px]">
                    <Line data={chartPostData} />
                </div>
            </div>
        </div>
    );
};

export default UserPostChart;
