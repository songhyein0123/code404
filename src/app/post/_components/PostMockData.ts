export interface Post {
    id: number;
    title: string;
    author: string;
    date: string;
    hashtags: string[];
    content: string; // 추가된 content 속성
}

// mock data 예시
export const PostMockData: Post[] = [
    {
        id: 1,
        title: "React Hooks 완벽 가이드",
        author: "개발자1",
        date: "2024-10-10T10:00:00Z",
        hashtags: ["#React", "#Hooks", "#JavaScript"],
        content: "React Hooks에 대한 심층적인 이해와 다양한 사용법을 소개합니다."
    },
    {
        id: 2,
        title: "TypeScript로 안전한 코드 작성하기",
        author: "개발자2",
        date: "2024-10-11T10:00:00Z",
        hashtags: ["#TypeScript", "#JavaScript", "#프로그래밍"],
        content: "TypeScript를 사용하여 타입 안전성을 확보하는 방법에 대해 다룹니다."
    },
    {
        id: 3,
        title: "CSS Flexbox와 Grid Layout 비교",
        author: "개발자3",
        date: "2024-10-12T10:00:00Z",
        hashtags: ["#CSS", "#Flexbox", "#Grid"],
        content: "Flexbox와 Grid Layout의 차이점과 각각의 장단점에 대해 알아봅니다."
    },
    {
        id: 4,
        title: "Node.js를 활용한 REST API 개발",
        author: "개발자4",
        date: "2024-10-13T10:00:00Z",
        hashtags: ["#Nodejs", "#API", "#Backend"],
        content: "Node.js로 REST API를 개발하는 방법에 대해 설명합니다."
    },
    {
        id: 5,
        title: "Git을 이용한 협업 방법",
        author: "개발자5",
        date: "2024-10-14T10:00:00Z",
        hashtags: ["#Git", "#협업", "#버전관리"],
        content: "Git을 활용하여 팀 프로젝트에서 협업하는 방법에 대해 소개합니다."
    },
    {
        id: 6,
        title: "React와 Redux로 상태 관리하기",
        author: "개발자6",
        date: "2024-10-15T10:00:00Z",
        hashtags: ["#React", "#Redux", "#StateManagement"],
        content: "Redux를 사용하여 React 애플리케이션의 상태를 효과적으로 관리하는 방법을 다룹니다."
    },
    {
        id: 7,
        title: "Python과 Flask로 웹 애플리케이션 만들기",
        author: "개발자7",
        date: "2024-10-16T10:00:00Z",
        hashtags: ["#Python", "#Flask", "#WebDevelopment"],
        content: "Flask를 활용하여 Python으로 웹 애플리케이션을 만드는 과정을 소개합니다."
    },
    {
        id: 8,
        title: "Vue.js로 SPA 만들기",
        author: "개발자8",
        date: "2024-10-17T10:00:00Z",
        hashtags: ["#Vue", "#SPA", "#JavaScript"],
        content: "Vue.js를 사용하여 단일 페이지 애플리케이션(SPA)을 만드는 방법을 다룹니다."
    },
    {
        id: 9,
        title: "Java로 RESTful 웹 서비스 구축하기",
        author: "개발자9",
        date: "2024-10-18T10:00:00Z",
        hashtags: ["#Java", "#REST", "#WebServices"],
        content: "Java로 RESTful 웹 서비스를 구축하는 방법을 상세히 설명합니다."
    },
    {
        id: 10,
        title: "React Native로 모바일 앱 개발하기",
        author: "개발자10",
        date: "2024-10-19T10:00:00Z",
        hashtags: ["#ReactNative", "#MobileDevelopment", "#JavaScript"],
        content: "React Native를 사용하여 모바일 애플리케이션을 개발하는 방법을 다룹니다."
    },
    {
        id: 11,
        title: "Docker를 이용한 컨테이너화",
        author: "개발자11",
        date: "2024-10-20T10:00:00Z",
        hashtags: ["#Docker", "#Containerization", "#DevOps"],
        content: "Docker를 활용하여 애플리케이션을 컨테이너화하는 방법을 소개합니다."
    },
    {
        id: 12,
        title: "GraphQL과 REST API의 차이",
        author: "개발자12",
        date: "2024-10-21T10:00:00Z",
        hashtags: ["#GraphQL", "#REST", "#API"],
        content: "GraphQL과 REST API의 주요 차이점과 사용 사례를 설명합니다."
    },
    {
        id: 13,
        title: "AWS를 이용한 클라우드 배포",
        author: "개발자13",
        date: "2024-10-22T10:00:00Z",
        hashtags: ["#AWS", "#Cloud", "#Deployment"],
        content: "AWS를 활용하여 애플리케이션을 클라우드에 배포하는 방법을 다룹니다."
    },
    {
        id: 14,
        title: "테스트 주도 개발(TDD) 실천하기",
        author: "개발자14",
        date: "2024-10-23T10:00:00Z",
        hashtags: ["#TDD", "#Testing", "#SoftwareDevelopment"],
        content: "테스트 주도 개발(TDD)의 원칙과 실천 방법에 대해 소개합니다."
    },
    {
        id: 15,
        title: "CSS Preprocessors: SASS의 사용법",
        author: "개발자15",
        date: "2024-10-24T10:00:00Z",
        hashtags: ["#CSS", "#SASS", "#Preprocessors"],
        content: "CSS Preprocessor인 SASS를 사용하는 방법과 이점에 대해 다룹니다."
    },
    {
        id: 16,
        title: "MERN 스택으로 풀스택 애플리케이션 만들기",
        author: "개발자16",
        date: "2024-10-25T10:00:00Z",
        hashtags: ["#MERN", "#FullStack", "#JavaScript"],
        content: "MERN 스택을 활용하여 풀스택 애플리케이션을 만드는 과정을 소개합니다."
    },
    {
        id: 17,
        title: "Machine Learning Basics",
        author: "개발자17",
        date: "2024-10-26T10:00:00Z",
        hashtags: ["#MachineLearning", "#AI", "#DataScience"],
        content: "기계 학습의 기초와 알고리즘에 대해 알아봅니다."
    },
    {
        id: 18,
        title: "Web Accessibility의 중요성",
        author: "개발자18",
        date: "2024-10-27T10:00:00Z",
        hashtags: ["#Accessibility", "#WebDevelopment", "#UX"],
        content: "웹 접근성의 중요성과 이를 구현하는 방법에 대해 다룹니다."
    },
    {
        id: 19,
        title: "Performance Optimization in Web Apps",
        author: "개발자19",
        date: "2024-10-28T10:00:00Z",
        hashtags: ["#Performance", "#Optimization", "#WebDevelopment"],
        content: "웹 애플리케이션 성능 최적화의 기법과 전략에 대해 설명합니다."
    },
    {
        id: 20,
        title: "DevOps란 무엇인가?",
        author: "개발자20",
        date: "2024-10-29T10:00:00Z",
        hashtags: ["#DevOps", "#Collaboration", "#CI/CD"],
        content: "DevOps의 개념과 효과적인 협업 방안에 대해 알아봅니다."
    },
    {
        id: 21,
        title: "NoSQL 데이터베이스 개요",
        author: "개발자21",
        date: "2024-10-30T10:00:00Z",
        hashtags: ["#NoSQL", "#Database", "#Data"],
        content: "NoSQL 데이터베이스의 종류와 사용 사례를 다룹니다."
    },
    {
        id: 22,
        title: "JavaScript 비동기 처리 이해하기",
        author: "개발자22",
        date: "2024-10-31T10:00:00Z",
        hashtags: ["#JavaScript", "#Async", "#Programming"],
        content: "JavaScript에서 비동기 처리를 이해하고 활용하는 방법에 대해 설명합니다."
    },
    {
        id: 23,
        title: "Microservices Architecture의 장점",
        author: "개발자23",
        date: "2024-11-01T10:00:00Z",
        hashtags: ["#Microservices", "#Architecture", "#Software"],
        content: "Microservices Architecture의 개념과 이점에 대해 알아봅니다."
    },
    {
        id: 24,
        title: "Cybersecurity Best Practices",
        author: "개발자24",
        date: "2024-11-02T10:00:00Z",
        hashtags: ["#Cybersecurity", "#Security", "#BestPractices"],
        content: "사이버 보안을 위한 모범 사례와 적용 방법에 대해 설명합니다."
    },
    {
        id: 25,
        title: "UI/UX 디자인 원칙",
        author: "개발자25",
        date: "2024-11-03T10:00:00Z",
        hashtags: ["#UI", "#UX", "#Design"],
        content: "효과적인 UI/UX 디자인의 원칙과 적용 방법에 대해 알아봅니다."
    }
];
