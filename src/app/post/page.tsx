"use client";

import { useState } from "react";
import { Search } from "./_components/Search";
import { SortDropdown } from "./_components/SortDropdown";
import LanguageFilter from "./_components/LanguageFilter";
import PostList from "./_components/PostList";

interface Post {
    id: number;
    title: string;
    author: string;
    date: string;
    hashtags: string[];
}

export default function post() {
    // Mock_data
    const mock_data: Post[] = [
        {
            id: 1,
            title: "TypeScript를 시작하는 방법",
            author: "개발자1",
            date: "2024-10-01",
            hashtags: ["#TypeScript", "#JavaScript", "#프로그래밍"]
        },
        {
            id: 2,
            title: "React와 Redux로 상태 관리하기",
            author: "개발자2",
            date: "2024-10-02",
            hashtags: ["#React", "#Redux", "#웹개발"]
        },
        {
            id: 3,
            title: "Next.js로 SSR 구현하기",
            author: "개발자3",
            date: "2024-10-03",
            hashtags: ["#Nextjs", "#SSR", "#React"]
        },
        {
            id: 4,
            title: "Node.js로 REST API 만들기",
            author: "개발자4",
            date: "2024-10-04",
            hashtags: ["#Nodejs", "#API", "#백엔드"]
        },
        {
            id: 5,
            title: "Tailwind CSS로 디자인 쉽게 하기",
            author: "개발자5",
            date: "2024-10-05",
            hashtags: ["#TailwindCSS", "#디자인", "#프론트엔드"]
        },
        {
            id: 6,
            title: "Python으로 데이터 분석 시작하기",
            author: "개발자6",
            date: "2024-10-06",
            hashtags: ["#Python", "#데이터분석", "#AI"]
        },
        {
            id: 7,
            title: "Git과 GitHub로 협업하기",
            author: "개발자7",
            date: "2024-10-07",
            hashtags: ["#Git", "#GitHub", "#협업"]
        },
        {
            id: 8,
            title: "Docker를 활용한 배포 전략",
            author: "개발자8",
            date: "2024-10-08",
            hashtags: ["#Docker", "#배포", "#DevOps"]
        },
        {
            id: 9,
            title: "GraphQL로 효율적인 데이터 가져오기",
            author: "개발자9",
            date: "2024-10-09",
            hashtags: ["#GraphQL", "#데이터", "#API"]
        },
        {
            id: 10,
            title: "Jest로 유닛 테스트하기",
            author: "개발자10",
            date: "2024-10-10",
            hashtags: ["#Jest", "#테스트", "#프론트엔드"]
        },
        {
            id: 11,
            title: "Firebase로 인증 시스템 구축하기",
            author: "개발자11",
            date: "2024-10-11",
            hashtags: ["#Firebase", "#인증", "#백엔드"]
        },
        {
            id: 12,
            title: "CSS Grid와 Flexbox 비교하기",
            author: "개발자12",
            date: "2024-10-12",
            hashtags: ["#CSS", "#Grid", "#Flexbox"]
        },
        {
            id: 13,
            title: "웹 접근성을 고려한 개발",
            author: "개발자13",
            date: "2024-10-13",
            hashtags: ["#웹접근성", "#UX", "#디자인"]
        },
        {
            id: 14,
            title: "API 보안을 위한 Best Practices",
            author: "개발자14",
            date: "2024-10-14",
            hashtags: ["#API", "#보안", "#백엔드"]
        },
        {
            id: 15,
            title: "Sass로 CSS를 더 쉽게 관리하기",
            author: "개발자15",
            date: "2024-10-15",
            hashtags: ["#Sass", "#CSS", "#프론트엔드"]
        },
        {
            id: 16,
            title: "Angular로 SPA 개발하기",
            author: "개발자16",
            date: "2024-10-16",
            hashtags: ["#Angular", "#SPA", "#웹개발"]
        },
        {
            id: 17,
            title: "Kubernetes로 컨테이너 관리하기",
            author: "개발자17",
            date: "2024-10-17",
            hashtags: ["#Kubernetes", "#컨테이너", "#DevOps"]
        },
        {
            id: 18,
            title: "React Native로 모바일 앱 개발하기",
            author: "개발자18",
            date: "2024-10-18",
            hashtags: ["#ReactNative", "#모바일앱", "#프로그래밍"]
        },
        {
            id: 19,
            title: "기계 학습의 기초 이해하기",
            author: "개발자19",
            date: "2024-10-19",
            hashtags: ["#MachineLearning", "#AI", "#데이터"]
        },
        {
            id: 20,
            title: "Cloud Computing의 장점",
            author: "개발자20",
            date: "2024-10-20",
            hashtags: ["#Cloud", "#컴퓨팅", "#IT"]
        }
    ];

    const allHashtags = [
        "#TypeScript",
        "#JavaScript",
        "#프로그래밍",
        "#React",
        "#Redux",
        "#웹개발",
        "#Nextjs",
        "#SSR",
        "#React",
        "#Nodejs",
        "#API",
        "#백엔드",
        "#TailwindCSS",
        "#디자인",
        "#프론트엔드"
    ];

    // 상태 관리
    const [posts, setPosts] = useState(mock_data);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortOption, setSortOption] = useState<string>("latest");

    // 검색 기능
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const filteredPosts = mock_data.filter(
            (post) => post.title.includes(query) || post.hashtags.some((tag) => tag.includes(query))
        );
        setPosts(filteredPosts);
    };

    // 해시태그 필터링
    const handleTagChange = (tag: string) => {
        const updatedTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag];
        setSelectedTags(updatedTags);
    };

    // 정렬 기능
    const handleSortChange = (value: string) => {
        setSortOption(value);
        const sortedPosts = [...posts].sort((a, b) => {
            if (value === "title") {
                return a.title.localeCompare(b.title);
            } else {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            }
        });
        setPosts(sortedPosts);
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-center my-8">Main Page</h1>

            {/* 정렬 및 검색 컴포넌트 */}
            <div className="flex justify-between mb-4">
                <div className="flex space-x-4">
                    <SortDropdown onSortChange={handleSortChange} />
                    <SortDropdown onSortChange={handleSortChange} />
                </div>
                <div>
                    <Search onSearch={handleSearch} />
                </div>
            </div>

            {/* 게시글 리스트 컴포넌트 */}
            <div className="mb-4">
                <PostList posts={mock_data} />
            </div>

            {/* 언어 필터 및 글쓰기 버튼 컴포넌트 */}
            <div className="flex justify-between mb-4">
                <LanguageFilter />
                <button className="btn-primary">글쓰기</button>
            </div>
        </div>
    );
}
