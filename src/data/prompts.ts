import type { PromptCategory } from '../types'

/**
 * Thư viện prompt dùng để nhờ AI review code Jetpack Compose.
 * Mỗi prompt được viết để dán trực tiếp vào AI kèm đoạn code cần review.
 */
export const PROMPTS: PromptCategory[] = [
  {
    id: 'audit',
    title: 'Audit toàn Project (xuất .md)',
    icon: '📦',
    prompts: [
      {
        id: 'audit-full',
        title: 'Audit toàn diện dự án (kiến trúc + clean code + hiệu năng + lỗi)',
        description:
          'Một prompt tổng lực: quét cả codebase trên 4 trục — kiến trúc, chất lượng code, hiệu năng và bug/lỗi — rồi xuất một báo cáo tổng hợp có điểm số và lộ trình.',
        tags: ['Architecture', 'Clean Code', 'Performance', 'Bug', 'Audit', 'Project'],
        scope: 'project',
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
- Race condition, state lệch, thao tác không idempotent; rò rỉ listener/coroutine (thiếu DisposableEffect/cleanup).
- Edge case bị bỏ sót (mất mạng, double-tap, xoay màn hình, list rỗng, process death).

== NGUYÊN TẮC ==
- Mỗi phát hiện PHẢI gắn \`file.kt:dòng\` và mức độ: 🔴 Cao / 🟡 Trung bình / 🟢 Thấp.
- Chỉ báo vấn đề có bằng chứng từ code; nếu là giả định phải ghi rõ "giả định".
- Không đổi hành vi khi đề xuất refactor; nêu rủi ro nếu có.
- Với hiệu năng, nhắc cần đo (Layout Inspector / Macrobenchmark) trước khi kết luận chắc.

== XUẤT KẾT QUẢ ==
Tạo file \`PROJECT_REVIEW.md\` ở thư mục gốc project theo đúng cấu trúc sau:

# Báo cáo Audit Toàn diện — <tên project>

## 1. Tóm tắt điều hành
- Điểm tổng quan từng trục (thang 1–5): Kiến trúc __ · Clean code __ · Hiệu năng __ · Độ ổn định __
- 5 việc nên làm ngay (tác động cao, rủi ro thấp)
- Tổng số phát hiện: 🔴 x · 🟡 y · 🟢 z

## 2. Bản đồ codebase
\`\`\`mermaid
flowchart TD
\`\`\`
(sơ đồ luồng dữ liệu / phụ thuộc module hiện tại + ghi chú điểm gãy)

## 3. Bảng tổng hợp phát hiện
| # | Trục | Mức độ | File:dòng | Vấn đề | Đề xuất |
|---|------|--------|-----------|--------|---------|

## 4. Chi tiết theo trục
### 4.A Kiến trúc & State
### 4.B Clean Code
### 4.C Hiệu năng
### 4.D Bug & Lỗi tiềm ẩn
(mỗi mục: nguyên nhân, tác động, bản sửa "trước/sau" bằng code khi cần)

## 5. Lộ trình cải thiện (theo đợt)
1. Đợt 1 — an toàn, tác động cao
2. Đợt 2 — refactor trung hạn
3. Đợt 3 — dài hạn / cần đo lường

Trả lời và viết toàn bộ báo cáo bằng tiếng Việt.`,
      },
      {
        id: 'audit-performance',
        title: 'Audit hiệu năng toàn project',
        description:
          'Quét toàn bộ codebase Compose, chấm điểm hiệu năng và xuất báo cáo Markdown có mức độ ưu tiên.',
        tags: ['Performance', 'Audit', 'Project'],
        scope: 'project',
        output: 'PERFORMANCE_REVIEW.md',
        body: `Bạn là chuyên gia hiệu năng Jetpack Compose. Hãy AUDIT TOÀN BỘ project Android trong workspace này (không chỉ một file).

PHẠM VI QUÉT:
- Mọi file .kt chứa @Composable, ViewModel, và lớp state/model UI.
- Ưu tiên: recomposition thừa, stability của param, LazyList (key/contentType), deferred state read, side-effect/coroutine sai chỗ, công việc nặng trong thân Composable.

CÁCH LÀM:
1. Liệt kê các màn hình/Composable chính và đánh giá nhanh từng cái.
2. Tìm vấn đề hiệu năng cụ thể, mỗi vấn đề gắn file + dòng (vd \`HomeScreen.kt:42\`).
3. Phân loại mức độ: 🔴 Cao / 🟡 Trung bình / 🟢 Thấp. Chỉ báo lỗi có bằng chứng từ code; nếu là giả định phải ghi rõ.
4. Với mỗi vấn đề: nguyên nhân, tác động, và bản sửa "trước/sau".
5. Nhắc cần đo bằng Layout Inspector / Macrobenchmark trước khi kết luận chắc chắn.

XUẤT KẾT QUẢ:
Tạo file \`PERFORMANCE_REVIEW.md\` ở thư mục gốc project theo cấu trúc:

# Báo cáo Audit Hiệu năng Compose

## Tóm tắt
- Tổng số vấn đề: ... (🔴 x / 🟡 y / 🟢 z)
- 3 việc nên làm trước tiên

## Bảng vấn đề
| # | Mức độ | File:dòng | Vấn đề | Đề xuất |
|---|--------|-----------|--------|---------|

## Chi tiết
### [Mức độ] Tên vấn đề — \`file.kt:dòng\`
**Nguyên nhân:** ...
**Tác động:** ...
**Sửa:**
\`\`\`kotlin
// trước
// sau
\`\`\`

## Cần đo lường
- ...

Trả lời bằng tiếng Việt.`,
      },
      {
        id: 'audit-cleancode',
        title: 'Clean code / Refactor toàn project',
        description:
          'Rà soát chất lượng code, đặt tên, tách module, dead code... và xuất kế hoạch refactor ra Markdown.',
        tags: ['Clean Code', 'Refactor', 'Audit', 'Project'],
        scope: 'project',
        output: 'CLEAN_CODE_REVIEW.md',
        body: `Bạn là Android tech lead. Hãy AUDIT CHẤT LƯỢNG CODE toàn bộ project trong workspace (không chỉ một file).

PHẠM VI:
- Đặt tên, cấu trúc package/module, hàm quá dài, Composable quá to, lặp code (DRY), magic number, dead code, comment lỗi thời.
- Tách stateful/stateless, slot API, truyền \`modifier\` đúng quy ước.
- Hardcode (chuỗi, màu, dimen) nên đưa vào resource/theme.
- Nhằng số, mapper, extension nên gom lại.

CÁCH LÀM:
1. Đánh giá tổng quan kiến trúc thư mục và điểm mạnh/yếu.
2. Liệt kê các điểm cần dọn, mỗi điểm gắn file + dòng và mức ưu tiên (🔴/🟡/🟢).
3. Ưu tiên đề xuất tác động cao, ít rủi ro trước.
4. KHÔNG đổi hành vi — chỉ đề xuất refactor an toàn; nếu rủi ro phải ghi rõ.

XUẤT KẾT QUẢ:
Tạo file \`CLEAN_CODE_REVIEW.md\` ở gốc project:

# Báo cáo Clean Code & Refactor

## Tóm tắt
- Tổng số điểm cần dọn + phân bố mức độ
- Top 5 refactor nên làm trước

## Bảng việc cần làm
| # | Mức độ | File:dòng | Vấn đề | Hành động |
|---|--------|-----------|--------|-----------|

## Chi tiết theo nhóm
### Đặt tên / Cấu trúc / Trùng lặp / Hardcode ...
- \`file.kt:dòng\` — mô tả + cách sửa (kèm code trước/sau khi cần)

## Kế hoạch refactor đề xuất (theo đợt)
1. Đợt 1 (an toàn, tác động cao): ...
2. Đợt 2: ...

Trả lời bằng tiếng Việt.`,
      },
      {
        id: 'audit-architecture',
        title: 'Audit kiến trúc & state toàn project',
        description:
          'Đánh giá layering, UDF, ViewModel, DI, single source of truth toàn dự án và xuất Markdown.',
        tags: ['Architecture', 'State', 'Audit', 'Project'],
        scope: 'project',
        output: 'ARCHITECTURE_REVIEW.md',
        body: `Bạn là kiến trúc sư Android. Hãy AUDIT KIẾN TRÚC toàn bộ project trong workspace.

PHẠM VI:
- Phân tầng (UI / domain / data) có rõ ràng và đúng hướng phụ thuộc không?
- Unidirectional Data Flow: state đi xuống, event đi lên; có "single source of truth" không?
- ViewModel: lộ \`StateFlow\`/\`State\` immutable hay state mutable? Có business logic lẫn trong Composable không?
- DI (Hilt/Koin/manual) có nhất quán không?
- Xử lý vòng đời: \`collectAsStateWithLifecycle\`, \`rememberSaveable\`, \`SavedStateHandle\` cho config change / process death.
- Tách biệt navigation, mapping model UI <-> domain.

CÁCH LÀM:
1. Vẽ sơ đồ luồng dữ liệu hiện tại (dạng text/mermaid) và chỉ ra điểm gãy.
2. Liệt kê vấn đề kiến trúc, gắn file + dòng, mức độ 🔴/🟡/🟢.
3. Đề xuất hướng sửa và rủi ro khi refactor.

XUẤT KẾT QUẢ:
Tạo file \`ARCHITECTURE_REVIEW.md\` ở gốc project:

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
    ],
  },
  {
    id: 'performance',
    title: 'Review Hiệu năng',
    icon: '⚡',
    prompts: [
      {
        id: 'perf-recomposition',
        title: 'Soi Recomposition thừa',
        description: 'Tìm nguyên nhân recompose không cần thiết và đề xuất cách giảm.',
        tags: ['Performance', 'Recomposition', 'State'],
        body: `Bạn là chuyên gia hiệu năng Jetpack Compose. Hãy review đoạn code dưới đây và tập trung vào recomposition:

1. Liệt kê các Composable có nguy cơ recompose thừa và GIẢI THÍCH nguyên nhân (đọc state thay đổi nhanh quá sớm, truyền lambda/object mới mỗi lần, param unstable...).
2. Với mỗi vấn đề, chỉ ra dòng code cụ thể và mức độ ảnh hưởng (cao/trung bình/thấp).
3. Đề xuất cách sửa: remember đúng key, deferred state read (lambda modifier), derivedStateOf khi hợp lý, tách Composable, hoặc nâng state lên đúng chỗ.
4. Cảnh báo nếu thấy phép tính nặng, decode ảnh, hoặc I/O nằm trực tiếp trong thân Composable.
5. KHÔNG đề xuất tối ưu sớm — chỉ nêu khi có bằng chứng rõ ràng từ code, và nhắc tôi đo bằng Layout Inspector / Macrobenchmark trước khi kết luận.

Trả lời bằng tiếng Việt, dạng danh sách có code minh hoạ "trước/sau".

Code cần review:
\`\`\`kotlin
// dán code ở đây
\`\`\``,
      },
      {
        id: 'perf-lazylist',
        title: 'Tối ưu LazyColumn / LazyRow',
        description: 'Kiểm tra key, contentType, và chi phí item trong danh sách lazy.',
        tags: ['Performance', 'LazyList'],
        body: `Review đoạn LazyColumn/LazyRow/LazyVerticalGrid dưới đây theo góc nhìn hiệu năng:

1. Mỗi item đã có \`key\` ổn định và duy nhất chưa? Có đang dùng index làm key cho list thay đổi được không?
2. Danh sách nhiều loại item đã khai báo \`contentType\` chưa?
3. Trong mỗi item có phép tính nặng, decode ảnh, format ngày tháng, hay tạo object mới mỗi lần compose không?
4. Có lồng scroll cùng chiều gây constraint vô hạn không?
5. Ảnh có được tải đúng kích thước hiển thị không?

Với mỗi phát hiện, nêu dòng code, lý do, và bản sửa. Trả lời bằng tiếng Việt.

Code:
\`\`\`kotlin
// dán code ở đây
\`\`\``,
      },
      {
        id: 'perf-stability',
        title: 'Phân tích Stability',
        description: 'Đánh giá tham số stable/unstable và tác động lên skipping.',
        tags: ['Performance', 'Stability'],
        body: `Phân tích stability của các tham số Composable trong code dưới đây:

1. Tham số nào unstable và vì sao (mutable property public, collection không immutable, kiểu từ module không bật Compose compiler...)?
2. Việc unstable này có khiến Composable không được skip khi recompose không?
3. Đề xuất cách sửa ĐÚNG bản chất: dùng immutable model, kotlinx.collections.immutable, hoặc cấu hình stability — KHÔNG gắn @Stable/@Immutable sai contract chỉ để "đánh lừa" compiler.
4. Nhắc tôi cách xác minh bằng Compose compiler metrics report.

Trả lời bằng tiếng Việt kèm ví dụ sửa.

Code:
\`\`\`kotlin
// dán code ở đây
\`\`\``,
      },
    ],
  },
  {
    id: 'logic',
    title: 'Review Logic & Bug',
    icon: '🧠',
    prompts: [
      {
        id: 'logic-correctness',
        title: 'Soi logic & edge case',
        description: 'Tìm bug logic, race condition, và trường hợp biên bị bỏ sót.',
        tags: ['Logic', 'Bug', 'Correctness'],
        body: `Bạn là reviewer khó tính. Hãy soi logic đoạn code dưới đây:

1. Tìm bug logic, off-by-one, điều kiện sai, null/empty chưa xử lý.
2. Tìm race condition, state cập nhật không đồng bộ, hoặc thao tác không idempotent.
3. Liệt kê các edge case bị bỏ sót (list rỗng, mất mạng, double-tap, xoay màn hình, process death...).
4. Với mỗi vấn đề: mô tả kịch bản tái hiện, hậu quả, và cách sửa.
5. Chỉ báo lỗi THỰC SỰ, nêu rõ mức độ tin cậy; nếu không chắc thì nói rõ là giả định.

Trả lời bằng tiếng Việt, sắp xếp theo mức nghiêm trọng.

Code:
\`\`\`kotlin
// dán code ở đây
\`\`\``,
      },
      {
        id: 'logic-coroutine',
        title: 'Review Coroutine & Effect',
        description: 'Kiểm tra side-effect, scope, key của LaunchedEffect và cleanup.',
        tags: ['Logic', 'Coroutine', 'Effects'],
        body: `Review cách dùng coroutine và side-effect trong Compose dưới đây:

1. Có gọi API/network/IO trực tiếp trong thân Composable không (phải đưa vào effect/ViewModel)?
2. \`LaunchedEffect\` đã có key đúng chưa? Key thừa gây chạy lại, key thiếu gây dùng giá trị cũ.
3. Listener/callback có được cleanup bằng \`DisposableEffect\` không?
4. Callback dài hạn có cần \`rememberUpdatedState\` không?
5. Coroutine từ sự kiện người dùng có dùng \`rememberCoroutineScope\` đúng cách không?
6. Flow có được collect theo lifecycle (\`collectAsStateWithLifecycle\`) không? Blocking work có rời Main thread không?

Trả lời bằng tiếng Việt, nêu dòng code và bản sửa.

Code:
\`\`\`kotlin
// dán code ở đây
\`\`\``,
      },
      {
        id: 'logic-state',
        title: 'Review State & ViewModel',
        description: 'Kiểm tra state hoisting, single source of truth, UDF.',
        tags: ['Logic', 'State', 'Architecture'],
        body: `Review thiết kế state cho màn hình Compose dưới đây theo Unidirectional Data Flow:

1. State có được hoist đúng tầng không? Có "single source of truth" rõ ràng không?
2. Có state bị nhân đôi giữa Composable và ViewModel gây lệch không?
3. Event đi lên (callback) và state đi xuống có rành mạch không?
4. UI state có nên gom thành một data class immutable không?
5. State có sống sót qua config change / process death không (rememberSaveable, SavedStateHandle)?

Trả lời bằng tiếng Việt kèm sơ đồ luồng state ngắn gọn và đề xuất refactor.

Code:
\`\`\`kotlin
// dán code ở đây
\`\`\``,
      },
    ],
  },
  {
    id: 'ui',
    title: 'Review UI / Compose View',
    icon: '🎨',
    prompts: [
      {
        id: 'ui-compose-review',
        title: 'Review tổng quát View Compose',
        description: 'Đánh giá cấu trúc Composable, tái sử dụng, đặt tên, preview.',
        tags: ['UI', 'Compose', 'Clean Code'],
        body: `Hãy review một View/Composable Jetpack Compose dưới đây như một Android reviewer cấp cao:

1. Cấu trúc: Composable có được tách hợp lý (stateful vs stateless) không? Có quá to/lồng sâu không?
2. Tái sử dụng: có chỗ nào nên tách thành component dùng lại?
3. Modifier: thứ tự modifier có đúng không? Có truyền \`modifier: Modifier = Modifier\` ở param đầu cho Composable công khai không?
4. Đặt tên & quy ước: tên Composable PascalCase, slot API hợp lý, không hardcode khi nên dùng theme.
5. Preview: đã có \`@Preview\` cho các state quan trọng (loading/empty/error/dark) chưa?
6. Tách logic: có business logic lẫn trong UI không?

Trả lời bằng tiếng Việt, ưu tiên các đề xuất tác động cao, kèm ví dụ "trước/sau".

Code:
\`\`\`kotlin
// dán code ở đây
\`\`\``,
      },
      {
        id: 'ui-accessibility',
        title: 'Review Accessibility & UX',
        description: 'Kiểm tra contentDescription, touch target, semantics, đa kích thước.',
        tags: ['UI', 'Accessibility', 'UX'],
        body: `Review đoạn UI Compose dưới đây về accessibility và trải nghiệm:

1. Icon/ảnh có ý nghĩa đã có \`contentDescription\` chưa? Phần trang trí có set \`null\` đúng cách không?
2. Vùng chạm có đạt tối thiểu 48dp không?
3. Có dùng \`Modifier.semantics\` / \`mergeDescendants\` hợp lý cho TalkBack không?
4. Tương phản màu, cỡ chữ co giãn theo font scale có ổn không?
5. Bố cục có chịu được màn hình nhỏ/lớn, RTL, dark mode không?

Trả lời bằng tiếng Việt, nêu dòng code và bản sửa cụ thể.

Code:
\`\`\`kotlin
// dán code ở đây
\`\`\``,
      },
      {
        id: 'ui-theming',
        title: 'Review Theming & Design System',
        description: 'Kiểm tra dùng MaterialTheme, token màu/typography thay vì hardcode.',
        tags: ['UI', 'Theming', 'Material'],
        body: `Review việc áp dụng theme trong Compose dưới đây:

1. Có hardcode màu (Color(0x...)), cỡ chữ, hay spacing thay vì dùng \`MaterialTheme.colorScheme\` / \`typography\` / token của design system không?
2. Spacing/shape có dùng giá trị nhất quán (token) không?
3. Component có hỗ trợ light/dark đúng không?
4. Có lạm dụng tham số style truyền tay thay vì kế thừa từ theme không?

Liệt kê từng chỗ hardcode, đề xuất token tương ứng. Trả lời bằng tiếng Việt.

Code:
\`\`\`kotlin
// dán code ở đây
\`\`\``,
      },
    ],
  },
]
