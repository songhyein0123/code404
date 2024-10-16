import type { Config } from "tailwindcss";

const config: Config = {
    // Tailwind CSS가 적용될 파일 경로 설정
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)", // 커스텀 변수 색상 사용
                foreground: "var(--foreground)"
            }
        }
    },
    plugins: [],
    mode: "jit" // JIT 모드 활성화
};

export default config;
