import type { PromptItem } from '../types'

/**
 * Thư viện prompt để nhờ AI review code Jetpack Compose.
 *
 * Hai phạm vi (scope):
 *  - 'project': audit toàn bộ codebase, thường xuất một file .md báo cáo.
 *  - 'feature': review một feature cụ thể — dùng token {{FEATURE}} làm chỗ trống,
 *    người dùng chỉ cần điền tên feature là prompt hoàn chỉnh.
 *
 * Trong mỗi scope, prompt được nhóm theo `category` (chủ đề).
 */
export const PROMPTS: PromptItem[] = [
  // ────────────────────────────── TOÀN DỰ ÁN ──────────────────────────────
  {
    id: 'project-full',
    scope: 'project',
    category: 'Toàn diện',
    icon: '📦',
    title: 'Audit toàn diện dự án',
    description:
      'Quét cả codebase trên 4 trục — kiến trúc, clean code, hiệu năng, bug — và xuất báo cáo tổng hợp có điểm số và lộ trình.',
    tags: ['Architecture', 'Clean Code', 'Performance', 'Bug'],
    output: 'PROJECT_REVIEW.md',
    body: `Bạn là Android Principal Engineer. Hãy thực hiện một cuộc AUDIT TOÀN DIỆN trên TOÀN BỘ project Jetpack Compose trong workspace này (không chỉ một file). Đánh giá đồng thời trên 4 trục.

== PHẠM VI QUÉT ==
Đọc và lập bản đồ codebase trước: module/package, các màn hình & Composable chính, ViewModel, lớp data/repository, DI, navigation, model state. Sau đó soi từng trục:

A) KIẾN TRÚC & STATE
- Phân tầng UI / domain / data và hướng phụ thuộc.
- Unidirectional Data Flow, single source of truth, ViewModel lộ state immutable hay mutable.
- DI nhất quán; lifecycle (collectAsStateWithLifecycle, rememberSaveable, SavedStateHandle, config change/process death).

B) CLEAN CODE & THIẾT KẾ
- Đặt tên, hàm/Composable quá dài, tách stateful/stateless, slot API, quy ước modifier.
- Trùng lặp (DRY), dead code, magic number, hardcode chuỗi/màu/dimen nên đưa vào resource/theme, comment lỗi thời.

C) HIỆU NĂNG
- Recomposition thừa, stability của param, LazyList (key/contentType), deferred state read.
- Công việc nặng / I/O / decode trong thân Composable; side-effect & coroutine sai chỗ; collect Flow theo lifecycle.

D) BUG & LỖI TIỀM ẨN
- Bug logic, null/empty chưa xử lý, off-by-one, điều kiện sai.
- Race condition, state lệch, thao tác không idempotent; rò rỉ listener/coroutine; edge case bị bỏ sót.

== NGUYÊN TẮC ==
- Mỗi phát hiện PHẢI gắn \`file.kt:dòng\` và mức độ: 🔴 Cao / 🟡 Trung bình / 🟢 Thấp.
- Chỉ báo vấn đề có bằng chứng từ code; nếu là giả định phải ghi rõ "giả định".
- Không đổi hành vi khi đề xuất refactor; nêu rủi ro nếu có.
- Với hiệu năng, nhắc cần đo (Layout Inspector / Macrobenchmark) trước khi kết luận.

== XUẤT KẾT QUẢ ==
Tạo file \`PROJECT_REVIEW.md\` ở thư mục gốc project theo đúng cấu trúc:

# Báo cáo Audit Toàn diện — <tên project>

## 1. Tóm tắt điều hành
- Điểm từng trục (1–5): Kiến trúc __ · Clean code __ · Hiệu năng __ · Độ ổn định __
- 5 việc nên làm ngay (tác động cao, rủi ro thấp)
- Tổng số phát hiện: 🔴 x · 🟡 y · 🟢 z

## 2. Bản đồ codebase
\`\`\`mermaid
flowchart TD
\`\`\`

## 3. Bảng tổng hợp phát hiện
| # | Trục | Mức độ | File:dòng | Vấn đề | Đề xuất |
|---|------|--------|-----------|--------|---------|

## 4. Chi tiết theo trục
### 4.A Kiến trúc & State
### 4.B Clean Code
### 4.C Hiệu năng
### 4.D Bug & Lỗi tiềm ẩn

## 5. Lộ trình cải thiện (theo đợt)

Trả lời và viết toàn bộ báo cáo bằng tiếng Việt.`,
  },
  {
    id: 'project-performance',
    scope: 'project',
    category: 'Hiệu năng',
    icon: '⚡',
    title: 'Audit hiệu năng toàn dự án',
    description: 'Quét toàn bộ codebase Compose, chấm điểm hiệu năng và xuất báo cáo Markdown có ưu tiên.',
    tags: ['Performance', 'Recomposition', 'Stability'],
    output: 'PERFORMANCE_REVIEW.md',
    body: `Bạn là chuyên gia hiệu năng Jetpack Compose. Hãy AUDIT TOÀN BỘ project Android trong workspace này (không chỉ một file).

PHẠM VI QUÉT:
- Mọi file .kt chứa @Composable, ViewModel, và lớp state/model UI.
- Ưu tiên: recomposition thừa, stability của param, LazyList (key/contentType), deferred state read, side-effect/coroutine sai chỗ, công việc nặng trong thân Composable.

CÁCH LÀM:
1. Liệt kê các màn hình/Composable chính và đánh giá nhanh từng cái.
2. Tìm vấn đề cụ thể, mỗi vấn đề gắn file + dòng (vd \`HomeScreen.kt:42\`).
3. Phân loại 🔴 Cao / 🟡 Trung bình / 🟢 Thấp. Chỉ báo lỗi có bằng chứng; giả định phải ghi rõ.
4. Mỗi vấn đề: nguyên nhân, tác động, bản sửa "trước/sau".
5. Nhắc cần đo bằng Layout Inspector / Macrobenchmark trước khi kết luận.

XUẤT KẾT QUẢ — tạo file \`PERFORMANCE_REVIEW.md\` ở gốc project:

# Báo cáo Audit Hiệu năng Compose
## Tóm tắt (số vấn đề 🔴/🟡/🟢 + 3 việc làm trước)
## Bảng vấn đề
| # | Mức độ | File:dòng | Vấn đề | Đề xuất |
|---|--------|-----------|--------|---------|
## Chi tiết (nguyên nhân / tác động / sửa trước-sau)
## Cần đo lường

Trả lời bằng tiếng Việt.`,
  },
  {
    id: 'project-architecture',
    scope: 'project',
    category: 'Kiến trúc & State',
    icon: '🏛️',
    title: 'Audit kiến trúc & state toàn dự án',
    description: 'Đánh giá layering, UDF, ViewModel, DI, single source of truth toàn dự án và xuất Markdown.',
    tags: ['Architecture', 'State', 'DI'],
    output: 'ARCHITECTURE_REVIEW.md',
    body: `Bạn là kiến trúc sư Android. Hãy AUDIT KIẾN TRÚC toàn bộ project trong workspace.

PHẠM VI:
- Phân tầng (UI / domain / data) và hướng phụ thuộc.
- Unidirectional Data Flow: state đi xuống, event đi lên; single source of truth.
- ViewModel lộ StateFlow/State immutable hay mutable? Business logic có lẫn trong Composable không?
- DI (Hilt/Koin/manual) nhất quán? Lifecycle: collectAsStateWithLifecycle, rememberSaveable, SavedStateHandle.
- Tách navigation, mapping model UI <-> domain.

CÁCH LÀM:
1. Vẽ sơ đồ luồng dữ liệu hiện tại (mermaid) và chỉ điểm gãy.
2. Liệt kê vấn đề, gắn file + dòng, mức độ 🔴/🟡/🟢.
3. Đề xuất hướng sửa và rủi ro khi refactor.

XUẤT KẾT QUẢ — tạo file \`ARCHITECTURE_REVIEW.md\` ở gốc project:

# Báo cáo Audit Kiến trúc
## Sơ đồ luồng dữ liệu hiện tại
\`\`\`mermaid
flowchart TD
\`\`\`
## Tóm tắt + Top vấn đề
## Bảng vấn đề
| # | Mức độ | File:dòng | Vấn đề | Đề xuất |
|---|--------|-----------|--------|---------|
## Chi tiết & lộ trình cải thiện

Trả lời bằng tiếng Việt.`,
  },
  {
    id: 'project-cleancode',
    scope: 'project',
    category: 'Clean Code',
    icon: '🧹',
    title: 'Clean code / Refactor toàn dự án',
    description: 'Rà soát chất lượng code, đặt tên, tách module, dead code... và xuất kế hoạch refactor ra Markdown.',
    tags: ['Clean Code', 'Refactor'],
    output: 'CLEAN_CODE_REVIEW.md',
    body: `Bạn là Android tech lead. Hãy AUDIT CHẤT LƯỢNG CODE toàn bộ project trong workspace.

PHẠM VI:
- Đặt tên, cấu trúc package/module, hàm quá dài, Composable quá to, lặp code (DRY), magic number, dead code, comment lỗi thời.
- Tách stateful/stateless, slot API, truyền \`modifier\` đúng quy ước.
- Hardcode (chuỗi, màu, dimen) nên đưa vào resource/theme.

CÁCH LÀM:
1. Đánh giá tổng quan cấu trúc thư mục, điểm mạnh/yếu.
2. Liệt kê điểm cần dọn, mỗi điểm gắn file + dòng và mức ưu tiên 🔴/🟡/🟢.
3. Ưu tiên đề xuất tác động cao, ít rủi ro trước.
4. KHÔNG đổi hành vi — chỉ refactor an toàn; nếu rủi ro phải ghi rõ.

XUẤT KẾT QUẢ — tạo file \`CLEAN_CODE_REVIEW.md\` ở gốc project:

# Báo cáo Clean Code & Refactor
## Tóm tắt + Top 5 refactor nên làm trước
## Bảng việc cần làm
| # | Mức độ | File:dòng | Vấn đề | Hành động |
|---|--------|-----------|--------|-----------|
## Chi tiết theo nhóm (Đặt tên / Cấu trúc / Trùng lặp / Hardcode...)
## Kế hoạch refactor theo đợt

Trả lời bằng tiếng Việt.`,
  },

  // ─────────────────────────────── FEATURE ────────────────────────────────
  {
    id: 'feature-full',
    scope: 'feature',
    category: 'Toàn diện',
    icon: '📦',
    title: 'Review toàn diện feature',
    description:
      'Tự tìm mọi file của feature, review trên 4 trục (kiến trúc, clean code, hiệu năng, bug) và xuất báo cáo .md riêng cho feature.',
    tags: ['Architecture', 'Clean Code', 'Performance', 'Bug'],
    output: '{{FEATURE}}_REVIEW.md',
    body: `Bạn là Android Principal Engineer. Hãy review TOÀN DIỆN feature **{{FEATURE}}** trong project này.

BƯỚC 1 — KHOANH VÙNG FEATURE:
Tự tìm tất cả file thuộc feature {{FEATURE}}: Composable/màn hình, ViewModel, state/UI model, repository/use case, navigation, DI liên quan. Liệt kê danh sách file tìm được trước khi review.

BƯỚC 2 — REVIEW 4 TRỤC:
A) Kiến trúc & State: UDF, single source of truth, ViewModel lộ state immutable, lifecycle (config change/process death).
B) Clean code: đặt tên, tách stateful/stateless, DRY, hardcode → theme/resource, dead code.
C) Hiệu năng: recomposition thừa, stability param, LazyList (key/contentType), deferred read, công việc nặng / I/O trong Composable, effect/coroutine đúng chỗ.
D) Bug & lỗi: logic sai, null/empty, race condition, rò rỉ listener/coroutine, edge case (mất mạng, double-tap, xoay màn hình, list rỗng).

NGUYÊN TẮC: mỗi phát hiện gắn \`file.kt:dòng\` + mức độ 🔴/🟡/🟢; chỉ báo lỗi có bằng chứng, giả định phải ghi rõ; không đổi hành vi khi refactor.

BƯỚC 3 — XUẤT KẾT QUẢ:
Tạo file \`{{FEATURE}}_REVIEW.md\` theo cấu trúc:

# Review Feature: {{FEATURE}}
## Phạm vi (danh sách file)
## Tóm tắt (điểm 4 trục 1–5 + việc nên làm ngay + số 🔴/🟡/🟢)
## Bảng phát hiện
| # | Trục | Mức độ | File:dòng | Vấn đề | Đề xuất |
|---|------|--------|-----------|--------|---------|
## Chi tiết theo trục (sửa trước/sau)
## Đề xuất ưu tiên

Trả lời bằng tiếng Việt.`,
  },
  {
    id: 'feature-performance',
    scope: 'feature',
    category: 'Hiệu năng',
    icon: '⚡',
    title: 'Review hiệu năng feature',
    description: 'Soi recomposition, stability, lazy list, effect của riêng một feature.',
    tags: ['Performance', 'Recomposition'],
    body: `Bạn là chuyên gia hiệu năng Jetpack Compose. Hãy review HIỆU NĂNG của feature **{{FEATURE}}**.

1. Tự tìm các file của feature {{FEATURE}} (Composable, ViewModel, state) và liệt kê ra.
2. Soi: recomposition thừa (đọc state thay đổi nhanh quá sớm, lambda/object mới mỗi lần, param unstable), stability, LazyList (key/contentType), deferred state read (lambda modifier), công việc nặng/decode/I/O trong thân Composable, side-effect & coroutine đặt đúng chỗ, Flow collect theo lifecycle.
3. Mỗi vấn đề: gắn \`file.kt:dòng\`, mức độ 🔴/🟡/🟢, nguyên nhân, tác động, bản sửa "trước/sau".
4. Chỉ báo có bằng chứng; nhắc đo bằng Layout Inspector / Macrobenchmark trước khi kết luận.

Trả lời bằng tiếng Việt, sắp xếp theo mức nghiêm trọng.`,
  },
  {
    id: 'feature-architecture',
    scope: 'feature',
    category: 'Kiến trúc & State',
    icon: '🏛️',
    title: 'Review kiến trúc & state feature',
    description: 'Đánh giá UDF, ViewModel, single source of truth, lifecycle của một feature.',
    tags: ['Architecture', 'State'],
    body: `Bạn là kiến trúc sư Android. Hãy review KIẾN TRÚC & STATE của feature **{{FEATURE}}** theo Unidirectional Data Flow.

1. Tự tìm các file của feature {{FEATURE}} (màn hình, ViewModel, state model, repository/use case, navigation) và liệt kê.
2. Đánh giá:
   - State hoist đúng tầng? Có single source of truth không?
   - ViewModel lộ state immutable (StateFlow/State) hay mutable? Business logic có lẫn trong Composable không?
   - Event đi lên / state đi xuống rành mạch chưa?
   - UI state nên gom thành data class immutable không?
   - State sống sót qua config change / process death (rememberSaveable, SavedStateHandle)?
3. Vẽ sơ đồ luồng state hiện tại (mermaid) và chỉ điểm gãy.
4. Mỗi vấn đề gắn \`file.kt:dòng\` + mức độ 🔴/🟡/🟢 + đề xuất refactor (kèm rủi ro).

Trả lời bằng tiếng Việt.`,
  },
  {
    id: 'feature-cleancode',
    scope: 'feature',
    category: 'Clean Code',
    icon: '🧹',
    title: 'Review clean code feature',
    description: 'Rà chất lượng code, đặt tên, tách Composable, hardcode, dead code trong một feature.',
    tags: ['Clean Code', 'Refactor'],
    body: `Bạn là Android tech lead. Hãy review CHẤT LƯỢNG CODE của feature **{{FEATURE}}**.

1. Tự tìm các file của feature {{FEATURE}} và liệt kê.
2. Soi:
   - Đặt tên, hàm/Composable quá dài, tách stateful/stateless, slot API, quy ước \`modifier\`.
   - Trùng lặp (DRY), dead code, magic number, comment lỗi thời.
   - Hardcode (chuỗi, màu, dimen) nên đưa vào resource/theme.
3. Mỗi điểm gắn \`file.kt:dòng\` + mức ưu tiên 🔴/🟡/🟢 + cách sửa (code trước/sau khi cần).
4. KHÔNG đổi hành vi — chỉ refactor an toàn; rủi ro phải ghi rõ. Ưu tiên tác động cao trước.

Trả lời bằng tiếng Việt, gom theo nhóm vấn đề.`,
  },
  {
    id: 'feature-logic',
    scope: 'feature',
    category: 'Logic & Bug',
    icon: '🧠',
    title: 'Review logic & bug feature',
    description: 'Tìm bug logic, race condition, edge case bị bỏ sót trong một feature.',
    tags: ['Logic', 'Bug', 'Coroutine'],
    body: `Bạn là reviewer khó tính. Hãy soi LOGIC & BUG của feature **{{FEATURE}}**.

1. Tự tìm các file của feature {{FEATURE}} và liệt kê.
2. Tìm:
   - Bug logic, off-by-one, điều kiện sai, null/empty chưa xử lý.
   - Race condition, state cập nhật không đồng bộ, thao tác không idempotent.
   - Rò rỉ listener/coroutine (thiếu DisposableEffect/cleanup), LaunchedEffect sai key, API/IO gọi sai chỗ, Flow không collect theo lifecycle.
   - Edge case bị bỏ sót: list rỗng, mất mạng, double-tap, xoay màn hình, process death.
3. Mỗi vấn đề: kịch bản tái hiện, hậu quả, \`file.kt:dòng\`, mức độ 🔴/🟡/🟢, cách sửa.
4. Chỉ báo lỗi THỰC SỰ; nếu không chắc thì ghi rõ là giả định.

Trả lời bằng tiếng Việt, sắp xếp theo mức nghiêm trọng.`,
  },
  {
    id: 'feature-ui',
    scope: 'feature',
    category: 'UI / Compose',
    icon: '🎨',
    title: 'Review UI / Compose feature',
    description: 'Đánh giá cấu trúc Composable, accessibility, theming của một feature.',
    tags: ['UI', 'Compose', 'Accessibility'],
    body: `Bạn là Android reviewer cấp cao. Hãy review UI / Compose của feature **{{FEATURE}}**.

1. Tự tìm các Composable/màn hình của feature {{FEATURE}} và liệt kê.
2. Đánh giá:
   - Cấu trúc: tách stateful/stateless hợp lý? Composable quá to/lồng sâu? Tái sử dụng được không?
   - Modifier: thứ tự đúng? Có truyền \`modifier: Modifier = Modifier\` ở param đầu cho Composable công khai không?
   - Theming: hardcode màu/cỡ chữ/spacing thay vì \`MaterialTheme\` / token? Hỗ trợ dark mode?
   - Accessibility: contentDescription, vùng chạm ≥48dp, semantics cho TalkBack, font scale, RTL.
   - Preview: đã có @Preview cho loading/empty/error/dark chưa?
3. Mỗi vấn đề gắn \`file.kt:dòng\` + mức độ 🔴/🟡/🟢 + ví dụ sửa "trước/sau".

Trả lời bằng tiếng Việt, ưu tiên đề xuất tác động cao.`,
  },
]
