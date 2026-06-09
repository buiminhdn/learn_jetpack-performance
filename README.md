# Compose Performance Academy

Website học tập **tương tác** minh hoạ toàn bộ kiến thức trong
[`JETPACK_COMPOSE_PERFORMANCE_RULES.md`](./JETPACK_COMPOSE_PERFORMANCE_RULES.md) —
30 quy tắc tối ưu hiệu năng **Jetpack Compose**. Mỗi quy tắc đều có giải thích
ngắn, code **Bad/Good** với syntax highlighting, và một **demo tương tác** để
người dùng trực tiếp quan sát recomposition, phase, state, lazy list, stability,
side effect, animation và benchmark.

> Toàn bộ nội dung hiển thị bằng tiếng Việt, giữ nguyên thuật ngữ kỹ thuật bằng
> tiếng Anh. Font chữ: **Lexend** (UI) + **JetBrains Mono** (code).

---

## ✨ Tính năng chính

- **30 quy tắc** chia thành 9 nhóm chủ đề, render từ dữ liệu có cấu trúc.
- **16 demo tương tác** — không phải bài viết tĩnh:
  - Ba phase **Composition → Layout → Draw** và nơi đọc state.
  - Phạm vi **recomposition**, `remember` & key, `derivedStateOf`.
  - **Lazy list**: key ổn định giữ identity, `contentType` tái dùng composition.
  - Trì hoãn đọc state, **skip** khi truyền dữ liệu tối thiểu.
  - **Stability & skippability**, backwards write (loop vô hạn).
  - **Side effect** matcher, `rememberUpdatedState`.
  - **Modifier lambda** vs `offset(dp)`, animation transform vs relayout.
  - **Benchmark** frame timing (đếm jank, p90).
- **Sidebar điều hướng** theo section với **search**, **active section** (theo
  cuộn) và **tiến độ học tập** (lưu trên `localStorage`).
- **Playground**: bật/tắt từng kỹ thuật tối ưu trên một màn hình mô phỏng, xem
  số recomposition và **đoạn code Kotlin sinh ra theo lựa chọn**.
- **Mini Quiz** (15 câu) có chấm điểm và link “ôn lại quy tắc”.
- **Checklist** review hiệu năng có thể tick và lưu tiến độ.
- **Dark mode**, **responsive** (desktop + mobile), animation có ý nghĩa
  (Framer Motion).

---

## 🛠️ Stack

| Thành phần        | Công nghệ                            |
| ----------------- | ------------------------------------ |
| Build tool        | [Vite](https://vitejs.dev) 5         |
| UI                | React 18 + TypeScript (strict)       |
| Styling           | Tailwind CSS 3 (dark mode `class`)   |
| Animation         | Framer Motion                        |
| Routing           | React Router (HashRouter)            |
| Syntax highlight  | react-syntax-highlighter (PrismLight)|

---

## 🚀 Chạy dự án

Yêu cầu: **Node.js ≥ 18**.

```bash
# Cài dependencies
npm install

# Chạy môi trường phát triển (mặc định http://localhost:5173)
npm run dev

# Build production (tsc -b && vite build) → thư mục dist/
npm run build

# Xem thử bản build (http://localhost:4173)
npm run preview

# Kiểm tra lint
npm run lint
```

---

## 🗂️ Cấu trúc website

```
learnjetpack/
├── JETPACK_COMPOSE_PERFORMANCE_RULES.md   # Tài liệu nguồn
├── index.html                             # Nạp font Lexend + JetBrains Mono
├── src/
│   ├── main.tsx                           # Entry: Router + Theme + Progress provider
│   ├── App.tsx                            # Khai báo route
│   ├── index.css                          # Tailwind + style toàn cục
│   ├── types.ts                           # Kiểu dữ liệu dùng chung
│   │
│   ├── data/                              # Dữ liệu thuần (data-driven)
│   │   ├── sections.ts                    #   Metadata 30 quy tắc + 9 nhóm
│   │   ├── quiz.ts                        #   15 câu hỏi quiz
│   │   └── checklist.ts                   #   Checklist review theo nhóm
│   │
│   ├── context/
│   │   ├── ThemeContext.tsx               # Dark/light mode (persisted)
│   │   └── ProgressContext.tsx            # Tiến độ học + checklist (persisted)
│   │
│   ├── hooks/
│   │   ├── useLocalStorage.ts             # State đồng bộ localStorage
│   │   └── useActiveSection.ts            # Active section theo IntersectionObserver
│   │
│   ├── components/
│   │   ├── layout/                        # Topbar, Sidebar, Layout (drawer mobile)
│   │   ├── ui/                            # CodeBlock, BadGoodCompare, Callout,
│   │   │                                  #   Toggle, DemoFrame, ProgressRing,
│   │   │                                  #   RecomposeCounter, ApiTable
│   │   ├── learn/SectionView.tsx          # Render 1 quy tắc: nội dung + demo
│   │   └── demos/                         # 16 demo tương tác + registry.ts
│   │       └── shared/FlashBox.tsx        #   Hiệu ứng "nhấp nháy khi recompose"
│   │
│   ├── content/                           # Nội dung giải thích (tiếng Việt)
│   │   ├── blocks.tsx                     #   Khối tái dùng (P, T, UL, H)
│   │   ├── <nhóm>Content.tsx              #   Nội dung theo từng nhóm chủ đề
│   │   └── index.tsx                      #   Gộp thành SECTION_CONTENT
│   │
│   └── pages/
│       ├── HomePage.tsx                   # Trang chủ / landing
│       ├── LearnPage.tsx                  # Cẩm nang đầy đủ + sidebar
│       ├── PlaygroundPage.tsx             # Bật/tắt kỹ thuật tối ưu
│       ├── QuizPage.tsx                   # Quiz có chấm điểm
│       └── ChecklistPage.tsx             # Checklist tương tác
```

### Nguyên tắc tổ chức

- **Data-driven**: điều hướng, search, tiến độ và quiz đều đọc từ `src/data/`.
- **Tách component rõ ràng**: mỗi demo, mỗi khối UI là một file riêng; nội dung
  tách theo nhóm chủ đề trong `src/content/`.
- **Demo registry** (`components/demos/registry.ts`) ánh xạ `section id → demo`,
  nên thêm/sửa demo không đụng tới phần render chung.

---

## ➕ Mở rộng

- **Thêm quy tắc**: thêm một mục vào `src/data/sections.ts`, thêm nội dung trong
  file nhóm tương ứng ở `src/content/`. Nếu có demo, tạo component trong
  `src/components/demos/` và đăng ký ở `registry.ts`.
- **Thêm câu quiz**: thêm vào `src/data/quiz.ts` (gắn `rule` để có link ôn lại).
- **Đổi màu thương hiệu**: chỉnh palette `android` / `brand` trong
  `tailwind.config.js`.

---

Dựa trên tài liệu chính thức
[Jetpack Compose Performance](https://developer.android.com/develop/ui/compose/performance).
