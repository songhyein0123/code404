# Code404

## 📌 프로젝트 소개

**Code404**는 개발자들이 공부하고 프로젝트를 관리할 수 있는 플랫폼입니다. 사용자들은 게시판을 통해 개발 관련 지식과 경험을 공유하고, 좋아요 순위 기반으로 인기 게시글을 확인할 수 있습니다. 관리자 기능을 통해 사용자 관리도 가능하며, 다양한 개발 언어를 선택하여 필터링할 수 있는 기능도 제공합니다.

### 주요 기능

-   **게시글 작성 및 관리**: Markdown 에디터를 통한 게시글 작성과 미리보기 기능.
-   **검색 및 정렬 기능**: 게시글 제목과 작성자를 검색할 수 있으며, 최신순/제목순으로 정렬 가능.
-   **좋아요 기반 순위**: 좋아요를 기반으로 게시글을 랭킹화.
-   **언어 필터링**: 다양한 프로그래밍 언어를 선택하여 관련 게시글을 필터링.
-   **관리자 기능**: 회원 차단 및 관리 기능.

## 🛠️ 기술 스택

-   **FrontEnd**: Next.js, React, TypeScript, Tanstack Query
-   **BackEnd**: Supabase
-   **Database**: PostgreSQL(Supabase)
-   **CSS 라이브러리**: TailwindCSS
-   **Markdown Editor**: ToastUI Editor

## 📂 폴더 구조

```
📦src
 ┣ 📂app
 ┃ ┣ 📂(admin)
 ┃ ┃ ┣ 📂admin
 ┃ ┃ ┃ ┣ 📂board
 ┃ ┃ ┃ ┃ ┣ 📂_components
 ┃ ┃ ┃ ┃ ┃ ┗ 📜BoardSkeleton.tsx
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┣ 📂chart
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┣ 📂report
 ┃ ┃ ┃ ┃ ┣ 📂_components
 ┃ ┃ ┃ ┃ ┃ ┗ 📜ReportSkeleton.tsx
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┣ 📂user
 ┃ ┃ ┃ ┃ ┣ 📂_components
 ┃ ┃ ┃ ┃ ┃ ┗ 📜UserSkeleton.tsx
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂types
 ┃ ┃ ┃ ┣ 📜Post.ts
 ┃ ┃ ┃ ┗ 📜User.ts
 ┃ ┃ ┣ 📂_components
 ┃ ┃ ┃ ┣ 📜Button.tsx
 ┃ ┃ ┃ ┗ 📜Sidebar.tsx
 ┃ ┃ ┗ 📜layout.tsx
 ┃ ┣ 📂api
 ┃ ┃ ┣ 📂signin
 ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┣ 📂signout
 ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┗ 📂signup
 ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┣ 📂auth
 ┃ ┃ ┣ 📂callback
 ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┣ 📂login
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┗ 📂register
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┣ 📂components
 ┃ ┃ ┗ 📂nav
 ┃ ┃ ┃ ┣ 📜Navibar.tsx
 ┃ ┃ ┃ ┗ 📜RightNavibartem.tsx
 ┃ ┣ 📂fonts
 ┃ ┃ ┣ 📜GeistMonoVF.woff
 ┃ ┃ ┗ 📜GeistVF.woff
 ┃ ┣ 📂post
 ┃ ┃ ┣ 📂write
 ┃ ┃ ┃ ┣ 📂_components
 ┃ ┃ ┃ ┃ ┣ 📜HashtagInput.tsx
 ┃ ┃ ┃ ┃ ┣ 📜MarkdownEditor.tsx
 ┃ ┃ ┃ ┃ ┗ 📜TitleInput.tsx
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂_components
 ┃ ┃ ┃ ┣ 📜LanguageFilter.tsx
 ┃ ┃ ┃ ┣ 📜PostList.tsx
 ┃ ┃ ┃ ┣ 📜PostMockData.ts
 ┃ ┃ ┃ ┣ 📜Search.tsx
 ┃ ┃ ┃ ┗ 📜SortDropdown.tsx
 ┃ ┃ ┗ 📜page.tsx
 ┃ ┣ 📂posts
 ┃ ┃ ┣ 📂edit
 ┃ ┃ ┃ ┗ 📂[postId]
 ┃ ┃ ┃ ┃ ┣ 📂_components
 ┃ ┃ ┃ ┃ ┃ ┣ 📜HashtagInput.tsx
 ┃ ┃ ┃ ┃ ┃ ┣ 📜MarkdownEditor.tsx
 ┃ ┃ ┃ ┃ ┃ ┗ 📜TitleInput.tsx
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂[postId]
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┗ 📜modal.tsx
 ┃ ┣ 📂profile
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┣ 📜LikePosts.tsx
 ┃ ┃ ┃ ┣ 📜Posts.tsx
 ┃ ┃ ┃ ┗ 📜ProfileForm.tsx
 ┃ ┃ ┗ 📜page.tsx
 ┃ ┣ 📂types
 ┃ ┃ ┣ 📜Account.ts
 ┃ ┃ ┗ 📜User.ts
 ┃ ┣ 📜favicon.ico
 ┃ ┣ 📜globals.css
 ┃ ┣ 📜layout.tsx
 ┃ ┣ 📜page.tsx
 ┃ ┗ 📜providers.tsx
 ┣ 📂services
 ┃ ┣ 📜authService.ts
 ┃ ┗ 📜dbService.ts
 ┣ 📂utils
 ┃ ┣ 📂network
 ┃ ┃ ┗ 📜config.ts
 ┃ ┗ 📂supabase
 ┃ ┃ ┣ 📜client.ts
 ┃ ┃ ┣ 📜middleware.ts
 ┃ ┃ ┗ 📜server.ts
 ┗ 📜middleware.ts
```
