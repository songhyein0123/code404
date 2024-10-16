import { Dispatch, SetStateAction, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    email: string;
    user_name: string;
    profile_url: string;
}

interface ProfileFormProps {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
    fetchUserData: () => Promise<void>;
}

const ProfileForm = ({ user, setUser, fetchUserData }: ProfileFormProps) => {
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [newUserName, setNewUserName] = useState<string>(user?.user_name || "");
    const supabase = createClient();
    const router = useRouter();

    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePic(e.target.files[0]);
        }
    };

    const handleProfileUpdate = async () => {
        if (!user || !user.id) {
            console.error("User ID is not defined");
            return;
        }

        if (newUserName === user.user_name && !profilePic) {
            alert("수정한 사항이 없습니다.");
            return;
        }

        try {
            let profile_url = user.profile_url;

            if (profilePic) {
                const fileExt = profilePic.name.split(".").pop();
                const fileName = `${user.id}-${Date.now()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from("user_profile_img")
                    .upload(filePath, profilePic, { upsert: true });

                if (uploadError) {
                    throw uploadError;
                }

                const { data: publicUrlData } = supabase.storage.from("user_profile_img").getPublicUrl(filePath);
                profile_url = publicUrlData?.publicUrl || "";
            }

            const { error: updateError } = await supabase
                .from("User")
                .update({ user_name: newUserName, profile_url })
                .eq("id", user.id);

            if (updateError) {
                throw updateError;
            }

            // await fetchUserData(); // 최신 데이터 가져오기
            router.refresh();
            setUser({ ...user, user_name: newUserName, profile_url });
            alert("회원 정보가 성공적으로 업데이트되었습니다.");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("회원 정보 업데이트 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-2 text-black ">회원정보변경</h3>
            <div className="mb-4">
                <label htmlFor="profilePic" className="block text-black mb-1">
                    프로필 사진
                </label>
                <input type="file" id="profilePic" className="text-black" onChange={handleProfilePicChange} />
            </div>
            <div className="mb-4">
                <label htmlFor="userName" className="block text-black mb-1">
                    닉네임
                </label>
                <input
                    type="text"
                    id="userName"
                    className="border p-2 rounded w-full text-black"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                />
            </div>
            <button
                onClick={handleProfileUpdate}
                className="ml-2 px-4 py-2 bg-[#00D084] text-white rounded-md hover:bg-[#FF8A00] transition"
            >
                회원 정보 업데이트
            </button>
        </div>
    );
};

export default ProfileForm;
