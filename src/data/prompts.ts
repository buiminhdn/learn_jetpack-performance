import type { PromptCategory } from '../types'

/**
 * Thư viện prompt dùng để nhờ AI review code Jetpack Compose.
 * Mỗi prompt được viết để dán trực tiếp vào AI kèm đoạn code cần review.
 */
export const PROMPTS: PromptCategory[] = [
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
