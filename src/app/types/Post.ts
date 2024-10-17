import type { User } from "./User";

export type Post = {
    board_id: number;
    created_at: string;
    user_id: string;
    title: string;
    content: string;
    img_url: string;
    publicStatus: boolean;
    hashTag: HashTag[];
    user: User;
};

type HashTag = {
    tag_id: number;
    created_at: string;
    board_id: number;
    hashtag: string;
};
