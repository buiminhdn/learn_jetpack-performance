import type { QuizQuestion } from '../types'

export const QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    rule: 1,
    question: 'Một frame Compose đi qua ba phase theo thứ tự nào?',
    options: [
      { id: 'a', text: 'Layout → Composition → Draw' },
      { id: 'b', text: 'Composition → Layout → Draw' },
      { id: 'c', text: 'Draw → Layout → Composition' },
      { id: 'd', text: 'Composition → Draw → Layout' },
    ],
    correct: 'b',
    explanation:
      'Composition quyết định UI nào tồn tại, Layout đo & đặt vị trí, Draw vẽ pixel. Mục tiêu là cho phép Compose bỏ qua phase không cần thiết.',
  },
  {
    id: 'q2',
    rule: 2,
    question: 'Vì sao không nên sort danh sách trực tiếp trong thân Composable?',
    options: [
      { id: 'a', text: 'Vì Kotlin không hỗ trợ sort trong Composable' },
      { id: 'b', text: 'Vì Composable có thể chạy lại nhiều lần, sort lại mỗi recomposition' },
      { id: 'c', text: 'Vì sort luôn chạy trên Main Thread nên bị crash' },
      { id: 'd', text: 'Vì LazyColumn tự sort lại rồi' },
    ],
    correct: 'b',
    explanation:
      'Composable recompose nhiều lần. Hãy remember(contacts, comparator) { ... } hoặc xử lý ở ViewModel/domain layer. remember không làm phép tính nhẹ đi — chỉ tránh chạy lại khi key không đổi.',
  },
  {
    id: 'q3',
    rule: 3,
    question: 'Đoạn `remember { items.filter { it.visible } }` có vấn đề gì?',
    options: [
      { id: 'a', text: 'Thiếu key — kết quả không cập nhật khi items đổi' },
      { id: 'b', text: 'Không có vấn đề gì' },
      { id: 'c', text: 'Phải dùng derivedStateOf thay thế' },
      { id: 'd', text: 'filter không chạy được trong remember' },
    ],
    correct: 'a',
    explanation:
      'Thiếu key items khiến giá trị bị stale. Đúng phải là remember(items) { items.filter { it.visible } }.',
  },
  {
    id: 'q4',
    rule: 4,
    question: 'derivedStateOf phù hợp nhất với trường hợp nào?',
    options: [
      { id: 'a', text: 'Nối "$firstName $lastName" thành fullName' },
      { id: 'b', text: 'Mọi computed value để chắc ăn' },
      { id: 'c', text: 'firstVisibleItemIndex > 0 từ listState đổi liên tục' },
      { id: 'd', text: 'Lưu state cục bộ của UI' },
    ],
    correct: 'c',
    explanation:
      'derivedStateOf hữu ích khi input đổi nhanh (scroll) nhưng kết quả UI quan tâm (boolean) đổi ít hơn nhiều. Với fullName thì input đổi là output đổi → không có lợi.',
  },
  {
    id: 'q5',
    rule: 5,
    question: 'Key nào sau đây ĐÚNG cho item trong LazyColumn?',
    options: [
      { id: 'a', text: 'key = { UUID.randomUUID() }' },
      { id: 'b', text: 'key = { index }' },
      { id: 'c', text: 'key = { note -> note.id }' },
      { id: 'd', text: 'Không cần key' },
    ],
    correct: 'c',
    explanation:
      'Key phải duy nhất, ổn định theo identity, không phụ thuộc index và không đổi mỗi render. UUID.randomUUID() đổi mỗi lần; index đổi khi thêm/xóa item.',
  },
  {
    id: 'q6',
    rule: 6,
    question: 'contentType trong Lazy Layout dùng để làm gì?',
    options: [
      { id: 'a', text: 'Sắp xếp item theo loại' },
      { id: 'b', text: 'Giúp Compose tái sử dụng composition giữa các item cùng loại' },
      { id: 'c', text: 'Thay thế cho key' },
      { id: 'd', text: 'Bắt buộc cho mọi LazyColumn' },
    ],
    correct: 'b',
    explanation:
      'Khi list có nhiều cấu trúc item (header, post, ad), contentType giúp Compose tái sử dụng layout của item cùng loại hiệu quả hơn.',
  },
  {
    id: 'q7',
    rule: 8,
    question: 'Truyền `offsetProvider = { scrollState.value }` thay vì `offset = scrollState.value` có lợi gì?',
    options: [
      { id: 'a', text: 'State được đọc trong layout phase, thu hẹp phạm vi recomposition' },
      { id: 'b', text: 'Code ngắn hơn' },
      { id: 'c', text: 'Tránh crash khi cuộn' },
      { id: 'd', text: 'Không có lợi gì' },
    ],
    correct: 'a',
    explanation:
      'Đọc state qua lambda trì hoãn việc đọc xuống layout phase, nên parent không recompose liên tục khi cuộn — chỉ phần đọc state thực sự bị invalidate.',
  },
  {
    id: 'q8',
    rule: 15,
    question: 'Đoạn code gọi `count++` trực tiếp trong thân Composable (sau khi đọc count) gây ra điều gì?',
    options: [
      { id: 'a', text: 'Không sao, đó là cách tăng biến đếm' },
      { id: 'b', text: 'Có thể tạo vòng lặp recomposition vô hạn (backwards write)' },
      { id: 'c', text: 'Crash ngay lập tức' },
      { id: 'd', text: 'count luôn bằng 0' },
    ],
    correct: 'b',
    explanation:
      'Ghi vào state đã đọc trong cùng composition là backwards write → loop vô hạn. Hãy ghi state trong event (onClick) hoặc Effect được kiểm soát.',
  },
  {
    id: 'q9',
    rule: 16,
    question: 'API nào dùng để đăng ký listener cần cleanup khi rời Composition?',
    options: [
      { id: 'a', text: 'LaunchedEffect' },
      { id: 'b', text: 'SideEffect' },
      { id: 'c', text: 'DisposableEffect' },
      { id: 'd', text: 'produceState' },
    ],
    correct: 'c',
    explanation:
      'DisposableEffect cung cấp onDispose { } để gỡ listener/tài nguyên. LaunchedEffect dành cho coroutine gắn lifecycle Composition.',
  },
  {
    id: 'q10',
    rule: 17,
    question: 'rememberUpdatedState giải quyết vấn đề gì?',
    options: [
      { id: 'a', text: 'Khiến LaunchedEffect restart mỗi khi callback đổi' },
      { id: 'b', text: 'Effect dài hạn vẫn gọi callback mới nhất mà không cần restart' },
      { id: 'c', text: 'Thay thế cho remember' },
      { id: 'd', text: 'Lưu state vào Bundle' },
    ],
    correct: 'b',
    explanation:
      'rememberUpdatedState giúp Effect (với key = Unit) không restart nhưng luôn tham chiếu phiên bản callback mới nhất.',
  },
  {
    id: 'q11',
    rule: 20,
    question: 'Vì sao nên ưu tiên `Modifier.offset { IntOffset(...) }` cho giá trị animation đổi liên tục?',
    options: [
      { id: 'a', text: 'Vì nó đẹp hơn' },
      { id: 'b', text: 'Vì lambda đọc state ở Layout phase, không kích hoạt lại Composition' },
      { id: 'c', text: 'Vì offset(x.dp) đã bị deprecated' },
      { id: 'd', text: 'Vì IntOffset nhanh hơn Dp' },
    ],
    correct: 'b',
    explanation:
      'Overload nhận lambda đọc state trong Layout/Draw. offset(x.dp) đọc trong Composition nên giá trị đổi liên tục có thể kích hoạt recomposition.',
  },
  {
    id: 'q12',
    rule: 24,
    question: 'Trên Android, vì sao nên dùng collectAsStateWithLifecycle()?',
    options: [
      { id: 'a', text: 'Vì nó nhanh hơn collectAsState mọi lúc' },
      { id: 'b', text: 'Để ngừng collection khi UI ở background, tiết kiệm CPU/battery' },
      { id: 'c', text: 'Vì collectAsState không tồn tại' },
      { id: 'd', text: 'Để Flow chạy trên Main Thread' },
    ],
    correct: 'b',
    explanation:
      'collectAsStateWithLifecycle ngừng collect khi lifecycle không phù hợp (ví dụ STOPPED), tránh xử lý dữ liệu UI dư thừa khi màn hình ở background.',
  },
  {
    id: 'q13',
    rule: 13,
    question: 'Phát biểu nào ĐÚNG về stability?',
    options: [
      { id: 'a', text: 'Data class luôn stable mặc định' },
      { id: 'b', text: 'Stability là contract về correctness trước khi là optimization' },
      { id: 'c', text: 'Strong Skipping cho phép bỏ qua thiết kế model' },
      { id: 'd', text: 'List trong data class luôn được coi là stable' },
    ],
    correct: 'b',
    explanation:
      'Mutable object bị sửa tại chỗ vẫn gây lỗi UI dù Strong Skipping skip được. Stability đảm bảo Compose quan sát đúng thay đổi — đó là correctness.',
  },
  {
    id: 'q14',
    rule: 29,
    question: 'Vì sao không nên kết luận hiệu năng từ debug build?',
    options: [
      { id: 'a', text: 'Debug build có instrumentation và không tối ưu như release' },
      { id: 'b', text: 'Debug build không chạy Compose' },
      { id: 'c', text: 'Debug build luôn nhanh hơn release' },
      { id: 'd', text: 'Không có khác biệt nào' },
    ],
    correct: 'a',
    explanation:
      'Debug build có overhead từ tooling/inspector, hành vi compiler/runtime khác production. Hãy đo trên release hoặc build benchmarkable.',
  },
  {
    id: 'q15',
    rule: 11,
    question: 'Truyền `userName: String` thay vì cả `uiState: ProfileUiState` cho UserHeader mang lại gì?',
    options: [
      { id: 'a', text: 'Tăng khả năng Compose skip child khi input không đổi' },
      { id: 'b', text: 'Làm app chậm hơn' },
      { id: 'c', text: 'Bắt buộc phải dùng @Immutable' },
      { id: 'd', text: 'Không khác biệt' },
    ],
    correct: 'a',
    explanation:
      'API tối thiểu giúp phạm vi thay đổi nhỏ hơn, dễ skip, dễ preview/test và lộ rõ dependency thực sự của component.',
  },
]
