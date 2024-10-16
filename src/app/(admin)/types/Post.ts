export type PostType = {
    board_id: number;
    title: string;
    content: string;
    img_url?: string;
    publicStatus: boolean;
    created_at: string;
    user_id: {
        id: string;
        email: string;
        profile_url: string;
        user_name: string;
        created_at: string;
        admin?: boolean;
        activate: boolean;
    };
};

export type ReportedPostType = {
    report_id: number;
    report: string;
    created_at: string;
    board_id: {
        board_id: number;
        title: string;
        content: string;
        img_url?: string;
        publicStatus: boolean;
        created_at: string;
        user_id: {
            id: string;
            email: string;
            profile_url: string;
            user_name: string;
            created_at: string;
            admin?: boolean;
            activate: boolean;
        };
    };
    user_id: {
        id: string;
        email: string;
        profile_url: string;
        user_name: string;
        created_at: string;
        admin?: boolean;
        activate: boolean;
    };
};
