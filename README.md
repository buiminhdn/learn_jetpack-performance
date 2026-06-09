# Compose Performance Academy

Website học tập **tương tác** minh hoạ toàn bộ kiến thức trong [`JETPACK_COMPOSE_PERFORMANCE_RULES.md`](./JETPACK_COMPOSE_PERFORMANCE_RULES.md) — 30 quy tắc tối ưu hiệu năng **Jetpack Compose**. 

Mỗi quy tắc đều có giải thích ngắn, code **Bad/Good** với syntax highlighting, và một **demo tương tác** để người dùng trực tiếp quan sát recomposition, phase, state, lazy list, stability, side effect, animation và benchmark.

> 🌐 **Trải nghiệm trực tuyến tại:** [https://buiminhdn.github.io/learn_jetpack-performance/](https://buiminhdn.github.io/learn_jetpack-performance/)
>
> Toàn bộ nội dung hiển thị bằng tiếng Việt, giữ nguyên thuật ngữ kỹ thuật bằng tiếng Anh. Font chữ: **Lexend** (UI) + **JetBrains Mono** (code).

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
- **Sidebar điều hướng** theo section với **search**, **active section** (theo cuộn) và **tiến độ học tập** (lưu trên `localStorage`).
- **Playground**: bật/tắt từng kỹ thuật tối ưu trên một màn hình mô phỏng, xem số recomposition và **đoạn code Kotlin sinh ra theo lựa chọn**.
- **Mini Quiz** (15 câu) có chấm điểm và link “ôn lại quy tắc”.
- **Checklist** review hiệu năng có thể tick và lưu tiến độ.
- **Dark mode**, **responsive** (desktop + mobile), animation có ý nghĩa (Framer Motion).

---

## 🛠️ Stack

| Thành phần | Công nghệ |
| ----------------- | ------------------------------------ |
| Build tool | [Vite](https://vitejs.dev) 5 |
| UI | React 18 + TypeScript (strict) |
| Styling | Tailwind CSS 3 (dark mode `class`) |
| Animation | Framer Motion |
| Routing | React Router (HashRouter) |
| Syntax highlight | react-syntax-highlighter (PrismLight) |

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
