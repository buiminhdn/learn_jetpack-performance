# Cẩm Nang Tối Ưu Hiệu Năng Jetpack Compose

> Tài liệu thực hành dành cho dự án Android sử dụng Jetpack Compose.  
> Mục tiêu: giảm **recomposition không cần thiết**, hạn chế **jank**, tối ưu thời gian dựng frame, cải thiện tốc độ khởi động và giữ kiến trúc UI dễ bảo trì.

---

## Mục lục

1. [Nguyên tắc nền tảng](#1-nguyên-tắc-nền-tảng)
2. [Không thực hiện tính toán nặng trong Composable](#2-không-thực-hiện-tính-toán-nặng-trong-composable)
3. [Sử dụng remember đúng mục đích](#3-sử-dụng-remember-đúng-mục-đích)
4. [Sử dụng derivedStateOf đúng trường hợp](#4-sử-dụng-derivedstateof-đúng-trường-hợp)
5. [Dùng key ổn định trong Lazy Layout](#5-dùng-key-ổn-định-trong-lazy-layout)
6. [Cung cấp contentType cho danh sách nhiều loại item](#6-cung-cấp-contenttype-cho-danh-sách-nhiều-loại-item)
7. [Không lồng danh sách cuộn cùng chiều không giới hạn](#7-không-lồng-danh-sách-cuộn-cùng-chiều-không-giới-hạn)
8. [Trì hoãn việc đọc State](#8-trì-hoãn-việc-đọc-state)
9. [Đọc State trong đúng phase](#9-đọc-state-trong-đúng-phase)
10. [Giữ State gần nơi sử dụng](#10-giữ-state-gần-nơi-sử-dụng)
11. [Không truyền toàn bộ UiState khi chỉ cần một phần](#11-không-truyền-toàn-bộ-uistate-khi-chỉ-cần-một-phần)
12. [Sử dụng immutable state và immutable collection](#12-sử-dụng-immutable-state-và-immutable-collection)
13. [Hiểu Stability và Skippability](#13-hiểu-stability-và-skippability)
14. [Không lạm dụng Stable và Immutable](#14-không-lạm-dụng-stable-và-immutable)
15. [Tránh backwards write](#15-tránh-backwards-write)
16. [Quản lý Side Effect đúng API](#16-quản-lý-side-effect-đúng-api)
17. [Sử dụng rememberUpdatedState khi Effect cần callback mới nhất](#17-sử-dụng-rememberupdatedstate-khi-effect-cần-callback-mới-nhất)
18. [Không tạo object và lambda không cần thiết trong hot path](#18-không-tạo-object-và-lambda-không-cần-thiết-trong-hot-path)
19. [Tái sử dụng Modifier khi phù hợp](#19-tái-sử-dụng-modifier-khi-phù-hợp)
20. [Ưu tiên Modifier lambda cho giá trị thay đổi liên tục](#20-ưu-tiên-modifier-lambda-cho-giá-trị-thay-đổi-liên-tục)
21. [Tối ưu animation](#21-tối-ưu-animation)
22. [Tối ưu ảnh và tài nguyên đồ họa](#22-tối-ưu-ảnh-và-tài-nguyên-đồ-họa)
23. [Không thực hiện I/O hoặc blocking work trên Main Thread](#23-không-thực-hiện-io-hoặc-blocking-work-trên-main-thread)
24. [Thu thập Flow theo lifecycle](#24-thu-thập-flow-theo-lifecycle)
25. [Không emit UI state dư thừa](#25-không-emit-ui-state-dư-thừa)
26. [Tối ưu CompositionLocal](#26-tối-ưu-compositionlocal)
27. [Giảm Subcomposition không cần thiết](#27-giảm-subcomposition-không-cần-thiết)
28. [Tối ưu startup với Baseline Profile](#28-tối-ưu-startup-với-baseline-profile)
29. [Đo lường trước khi tối ưu](#29-đo-lường-trước-khi-tối-ưu)
30. [Checklist review performance](#30-checklist-review-performance)

---

## 1. Nguyên tắc nền tảng

Một frame Compose có thể đi qua ba phase:

1. **Composition**: quyết định thành phần UI nào tồn tại.
2. **Layout**: đo kích thước và xác định vị trí.
3. **Draw**: vẽ pixel lên màn hình.

Mục tiêu tối ưu không phải là “không bao giờ recompose”, mà là:

- Chỉ chạy lại phần UI thực sự phụ thuộc vào dữ liệu đã thay đổi.
- Cho phép Compose bỏ qua các phase không cần thiết.
- Không đặt công việc nặng vào đường chạy dựng frame.
- Giữ dữ liệu đầu vào ổn định và dễ so sánh.
- Đo hiệu năng trên bản release, không kết luận từ debug build.

> Recomposition là cơ chế bình thường. Vấn đề chỉ xuất hiện khi phạm vi recomposition quá rộng, xảy ra quá thường xuyên hoặc chứa công việc tốn kém.

---

## 2. Không thực hiện tính toán nặng trong Composable

Composable có thể chạy lại nhiều lần. Không nên sort, filter, parse, decode, map dữ liệu lớn hoặc thực hiện thuật toán phức tạp trực tiếp trong thân hàm.

### ❌ Chưa tối ưu

```kotlin
@Composable
fun ContactList(
    contacts: List<Contact>,
    comparator: Comparator<Contact>
) {
    LazyColumn {
        items(contacts.sortedWith(comparator)) { contact ->
            ContactRow(contact)
        }
    }
}
```

Danh sách bị sắp xếp lại sau mỗi lần `ContactList` recomposition.

### ✅ Tốt hơn với remember

```kotlin
@Composable
fun ContactList(
    contacts: List<Contact>,
    comparator: Comparator<Contact>
) {
    val sortedContacts = remember(contacts, comparator) {
        contacts.sortedWith(comparator)
    }

    LazyColumn {
        items(sortedContacts) { contact ->
            ContactRow(contact)
        }
    }
}
```

### ✅ Tốt nhất: xử lý ở ViewModel hoặc domain layer

```kotlin
class ContactViewModel(
    repository: ContactRepository
) : ViewModel() {

    val uiState: StateFlow<ContactUiState> =
        repository.observeContacts()
            .map { contacts ->
                ContactUiState(
                    contacts = contacts.sortedBy(Contact::name)
                )
            }
            .stateIn(
                scope = viewModelScope,
                started = SharingStarted.WhileSubscribed(5_000),
                initialValue = ContactUiState()
            )
}
```

### Quy tắc

- UI layer tập trung render.
- Logic nghiệp vụ và xử lý dữ liệu lớn nên đặt ngoài Composable.
- `remember` không biến phép tính nặng thành phép tính nhẹ; nó chỉ tránh chạy lại khi key không đổi.

---

## 3. Sử dụng remember đúng mục đích

`remember` giữ một giá trị trong Composition qua các lần recomposition.

### Trường hợp nên dùng

- Object được tạo từ input ổn định.
- State cục bộ của UI.
- Kết quả tính toán vừa phải nhưng không cần chạy lại mỗi recomposition.
- State holder như `LazyListState`, `ScrollState`, `PagerState`.

```kotlin
@Composable
fun SearchScreen(query: String) {
    val normalizedQuery = remember(query) {
        query.trim().lowercase()
    }
}
```

### Sai lầm: thiếu key

```kotlin
val filteredItems = remember {
    items.filter { it.visible }
}
```

Kết quả không cập nhật khi `items` thay đổi.

### Đúng

```kotlin
val filteredItems = remember(items) {
    items.filter { it.visible }
}
```

### Sai lầm: dùng mutable object không observable

```kotlin
val users = remember { mutableListOf<User>() }
```

Thay đổi `users` không tự động làm UI cập nhật.

### Đúng

```kotlin
val users = remember { mutableStateListOf<User>() }
```

Hoặc ưu tiên immutable state:

```kotlin
var users by remember { mutableStateOf(emptyList<User>()) }

users = users + newUser
```

---

## 4. Sử dụng derivedStateOf đúng trường hợp

`derivedStateOf` hữu ích khi input thay đổi thường xuyên nhưng kết quả mà UI quan tâm thay đổi ít hơn.

### Ví dụ: nút cuộn lên đầu

```kotlin
@Composable
fun ArticleList(articles: List<Article>) {
    val listState = rememberLazyListState()

    val showScrollToTop by remember {
        derivedStateOf {
            listState.firstVisibleItemIndex > 0
        }
    }

    Box {
        LazyColumn(state = listState) {
            items(
                items = articles,
                key = Article::id
            ) { article ->
                ArticleRow(article)
            }
        }

        AnimatedVisibility(
            visible = showScrollToTop,
            modifier = Modifier.align(Alignment.BottomEnd)
        ) {
            ScrollToTopButton()
        }
    }
}
```

### Không nên dùng cho phép nối giá trị đơn giản

```kotlin
val fullName by remember {
    derivedStateOf { "$firstName $lastName" }
}
```

Trong trường hợp này, `firstName` và `lastName` thay đổi thì `fullName` gần như luôn thay đổi theo. `derivedStateOf` không mang lại lợi ích rõ ràng.

### Quy tắc

Dùng `derivedStateOf` khi:

- State nguồn thay đổi nhanh.
- Kết quả dẫn xuất thay đổi ít hơn đáng kể.
- Bạn cần giảm số lần invalidation ở consumer.

Không dùng theo thói quen cho mọi computed value.

---

## 5. Dùng key ổn định trong Lazy Layout

Không có key, Lazy Layout thường định danh item theo vị trí. Khi thêm, xóa hoặc di chuyển item, Compose khó giữ đúng identity của từng item.

### ❌ Không có key

```kotlin
LazyColumn {
    items(notes) { note ->
        NoteRow(note)
    }
}
```

### ✅ Có key ổn định

```kotlin
LazyColumn {
    items(
        items = notes,
        key = Note::id
    ) { note ->
        NoteRow(note)
    }
}
```

### Key phải đáp ứng

- Duy nhất trong danh sách.
- Ổn định theo identity của item.
- Không phụ thuộc vào index.
- Không thay đổi mỗi lần render.

### ❌ Key sai

```kotlin
key = { UUID.randomUUID() }
```

```kotlin
key = { index }
```

### ✅ Key đúng

```kotlin
key = { note -> note.id }
```

### Khi item có rememberSaveable

Key nên thuộc loại có thể lưu trong `Bundle`, đặc biệt khi state của item cần được phục hồi sau recreation.

---

## 6. Cung cấp contentType cho danh sách nhiều loại item

Khi Lazy Layout chứa nhiều cấu trúc item khác nhau, `contentType` giúp Compose tái sử dụng composition hiệu quả hơn giữa các item cùng loại.

```kotlin
sealed interface FeedItem {
    val id: String

    data class Header(
        override val id: String,
        val title: String
    ) : FeedItem

    data class Post(
        override val id: String,
        val data: PostData
    ) : FeedItem

    data class Ad(
        override val id: String,
        val data: AdData
    ) : FeedItem
}
```

```kotlin
LazyColumn {
    items(
        items = feedItems,
        key = FeedItem::id,
        contentType = { item ->
            when (item) {
                is FeedItem.Header -> "header"
                is FeedItem.Post -> "post"
                is FeedItem.Ad -> "ad"
            }
        }
    ) { item ->
        when (item) {
            is FeedItem.Header -> HeaderRow(item)
            is FeedItem.Post -> PostRow(item)
            is FeedItem.Ad -> AdRow(item)
        }
    }
}
```

---

## 7. Không lồng danh sách cuộn cùng chiều không giới hạn

Lồng `LazyColumn` trong một container cuộn dọc không có chiều cao xác định có thể gây lỗi constraint hoặc khiến hệ thống phải đo layout không hợp lý.

### ❌ Không nên

```kotlin
Column(
    modifier = Modifier.verticalScroll(rememberScrollState())
) {
    LazyColumn {
        items(items) { item ->
            ItemRow(item)
        }
    }
}
```

### ✅ Gộp nội dung vào một LazyColumn

```kotlin
LazyColumn {
    item {
        Header()
    }

    items(
        items = items,
        key = Item::id
    ) { item ->
        ItemRow(item)
    }

    item {
        Footer()
    }
}
```

Danh sách cuộn khác chiều có thể hợp lệ, ví dụ `LazyRow` nằm trong `LazyColumn`.

---

## 8. Trì hoãn việc đọc State

Đọc state càng cao trong cây UI thì phạm vi bị invalidation càng rộng.

### ❌ Đọc state tại parent

```kotlin
@Composable
fun SnackDetail() {
    val scrollState = rememberScrollState()

    Box {
        Title(
            offset = scrollState.value
        )
    }
}
```

`SnackDetail` đọc `scrollState.value`, nên parent có thể recompose liên tục khi cuộn.

### ✅ Truyền state provider

```kotlin
@Composable
fun SnackDetail() {
    val scrollState = rememberScrollState()

    Box {
        Title(
            offsetProvider = { scrollState.value }
        )
    }
}
```

```kotlin
@Composable
private fun Title(
    offsetProvider: () -> Int
) {
    Text(
        text = "Snack",
        modifier = Modifier.offset {
            IntOffset(
                x = 0,
                y = offsetProvider()
            )
        }
    )
}
```

State được đọc trong layout phase thay vì composition phase.

---

## 9. Đọc State trong đúng phase

Một state chỉ ảnh hưởng đến vị trí hoặc cách vẽ không nhất thiết phải được đọc trong Composition.

### Dùng layout-phase modifier

```kotlin
Modifier.offset {
    IntOffset(
        x = animatedX.roundToInt(),
        y = animatedY.roundToInt()
    )
}
```

### Dùng draw-phase modifier

```kotlin
Modifier.drawBehind {
    drawCircle(
        alpha = animatedAlpha
    )
}
```

### So sánh

```kotlin
// Có thể kích hoạt Composition khi animatedOffset thay đổi
Modifier.offset(
    x = animatedOffset.dp,
    y = 0.dp
)
```

```kotlin
// Đọc trong Layout
Modifier.offset {
    IntOffset(
        x = animatedOffset.roundToInt(),
        y = 0
    )
}
```

### Áp dụng cho

- `offset { }`
- `graphicsLayer { }`
- `drawBehind { }`
- `drawWithContent { }`
- Custom `Layout`
- Custom drawing bằng `Canvas`

Không chuyển state read sang phase khác một cách máy móc. Chỉ áp dụng khi state thực sự chỉ ảnh hưởng đến layout hoặc drawing.

---

## 10. Giữ State gần nơi sử dụng

State nên được hoist đến **lowest common ancestor** của các thành phần cần đọc và ghi nó.

### Không nên hoist mọi state lên ViewModel

Các state thuần UI như:

- Trạng thái mở/đóng dropdown.
- Tab cục bộ.
- Expansion của một card.
- Vị trí scroll.
- Trạng thái dialog tạm thời.

Có thể được giữ trong UI nếu không liên quan business logic hoặc không cần chia sẻ rộng.

```kotlin
@Composable
fun FilterButton() {
    var expanded by rememberSaveable {
        mutableStateOf(false)
    }

    // ...
}
```

### Nên đưa lên ViewModel

- Dữ liệu màn hình.
- Business rule.
- Trạng thái cần tồn tại qua navigation.
- Trạng thái được nhiều khu vực của screen cùng sử dụng.
- Dữ liệu cần đồng bộ repository.

---

## 11. Không truyền toàn bộ UiState khi chỉ cần một phần

Truyền một object lớn khiến child bị ràng buộc với nhiều field không liên quan.

### ❌ Child nhận toàn bộ state

```kotlin
@Composable
fun UserHeader(uiState: ProfileUiState) {
    Text(uiState.userName)
}
```

`UserHeader` chỉ cần `userName`, nhưng API của nó phụ thuộc toàn bộ `ProfileUiState`.

### ✅ Truyền dữ liệu tối thiểu

```kotlin
@Composable
fun UserHeader(userName: String) {
    Text(userName)
}
```

### Lợi ích

- API rõ ràng.
- Phạm vi thay đổi nhỏ hơn.
- Dễ preview và test.
- Dễ nhận biết dependency.
- Tăng khả năng Compose skip child khi input không đổi.

Không cần phân rã cực đoan đến mức tạo hàng chục tham số khó quản lý. Có thể truyền một UI model nhỏ, immutable và đúng phạm vi component.

---

## 12. Sử dụng immutable state và immutable collection

Compose hoạt động tốt nhất khi dữ liệu đầu vào có semantics rõ ràng: hoặc bất biến, hoặc thay đổi thông qua observable state.

### ❌ Mutable collection trong UI state

```kotlin
data class ScreenUiState(
    val items: MutableList<Item>
)
```

Compose không biết khi nội dung bên trong `MutableList` bị thay đổi.

### ✅ Immutable list

```kotlin
data class ScreenUiState(
    val items: List<Item> = emptyList()
)
```

Cập nhật bằng cách tạo state mới:

```kotlin
_state.update { current ->
    current.copy(
        items = current.items + newItem
    )
}
```

### Với dự án nhạy cảm về stability

Có thể sử dụng Kotlin immutable collections:

```kotlin
import kotlinx.collections.immutable.ImmutableList
import kotlinx.collections.immutable.persistentListOf

data class ScreenUiState(
    val items: ImmutableList<Item> = persistentListOf()
)
```

Chỉ thêm dependency khi có lý do đo lường hoặc consistency rõ ràng. Không nên thay đổi toàn bộ codebase chỉ vì suy đoán.

---

## 13. Hiểu Stability và Skippability

Compose phân tích parameter để xác định một Composable có thể được bỏ qua trong recomposition hay không.

Một type thường được xem là ổn định khi:

- Giá trị `equals` không đổi nếu object chưa phát tín hiệu thay đổi.
- Nếu property thay đổi, Compose có thể quan sát sự thay đổi đó.
- Các property của nó cũng ổn định.

Ví dụ thường ổn định:

```kotlin
data class UserUiModel(
    val id: Long,
    val name: String,
    val avatarUrl: String?
)
```

Ví dụ dễ gây bất ổn:

```kotlin
data class UserUiModel(
    val tags: List<String>
)
```

Interface collection như `List` có thể bị compiler đánh giá thận trọng vì không đảm bảo implementation bất biến.

### Strong Skipping

Ở các phiên bản Kotlin/Compose Compiler hiện đại, Strong Skipping giúp nhiều Composable có unstable parameter vẫn có thể được skip nếu parameter không thay đổi theo quy tắc so sánh tương ứng.

Tuy vậy:

- Không nên phụ thuộc Strong Skipping để che giấu model thiết kế kém.
- Mutable object vẫn có thể gây lỗi UI nếu bị thay đổi tại chỗ.
- Stability là contract về correctness trước khi là optimization.

---

## 14. Không lạm dụng Stable và Immutable

`@Stable` và `@Immutable` là cam kết với Compose Compiler.

### ❌ Không gắn annotation chỉ để “ép tối ưu”

```kotlin
@Immutable
data class BadUiState(
    val items: MutableList<Item>
)
```

Contract này sai vì nội dung `items` có thể thay đổi mà Compose không biết.

### ✅ Chỉ annotation khi contract thực sự đúng

```kotlin
@Immutable
data class ProductUiModel(
    val id: Long,
    val name: String,
    val priceText: String
)
```

### Quy tắc

- Ưu tiên sửa model trước.
- Dùng immutable property.
- Tránh public mutable state.
- Chỉ annotation khi hiểu rõ stability contract.
- Kiểm tra compiler report thay vì đoán.

---

## 15. Tránh backwards write

Không ghi vào state trong cùng composition sau khi đã đọc nó.

### ❌ Lỗi nghiêm trọng

```kotlin
@Composable
fun BadCounter() {
    var count by remember {
        mutableIntStateOf(0)
    }

    Text(text = count.toString())

    count++
}
```

Điều này có thể tạo vòng lặp recomposition vô hạn.

### ✅ Ghi state trong event

```kotlin
@Composable
fun Counter() {
    var count by remember {
        mutableIntStateOf(0)
    }

    Button(
        onClick = {
            count++
        }
    ) {
        Text("Increase")
    }

    Text(text = count.toString())
}
```

### ✅ Hoặc trong Effect được kiểm soát

```kotlin
LaunchedEffect(userId) {
    viewModel.loadUser(userId)
}
```

Composable nên gần với một hàm mô tả UI thuần: nhận state, phát event.

---

## 16. Quản lý Side Effect đúng API

Không khởi chạy coroutine, đăng ký listener hoặc gọi API trực tiếp trong thân Composable.

### ❌ Không nên

```kotlin
@Composable
fun ProfileScreen(viewModel: ProfileViewModel) {
    viewModel.loadProfile()
}
```

Hàm có thể chạy lại sau mỗi recomposition.

### ✅ LaunchedEffect

```kotlin
@Composable
fun ProfileScreen(
    userId: Long,
    viewModel: ProfileViewModel
) {
    LaunchedEffect(userId) {
        viewModel.loadProfile(userId)
    }
}
```

### ✅ DisposableEffect cho listener cần cleanup

```kotlin
@Composable
fun ConnectivityObserver(
    connectivityManager: ConnectivityManager,
    onChanged: (Boolean) -> Unit
) {
    DisposableEffect(connectivityManager) {
        val callback = createNetworkCallback(onChanged)
        connectivityManager.registerDefaultNetworkCallback(callback)

        onDispose {
            connectivityManager.unregisterNetworkCallback(callback)
        }
    }
}
```

### Chọn API

| API | Dùng khi |
|---|---|
| `LaunchedEffect` | Chạy coroutine gắn với lifecycle của Composition |
| `DisposableEffect` | Đăng ký tài nguyên và cần cleanup |
| `SideEffect` | Đồng bộ state Compose ra object ngoài sau composition thành công |
| `produceState` | Chuyển nguồn dữ liệu async/callback thành Compose State |
| `snapshotFlow` | Chuyển snapshot state thành Flow |
| `rememberCoroutineScope` | Khởi chạy coroutine từ UI event |
| `rememberUpdatedState` | Effect cần tham chiếu giá trị mới nhất nhưng không restart |

---

## 17. Sử dụng rememberUpdatedState khi Effect cần callback mới nhất

### Vấn đề

Effect dài hạn capture callback cũ hoặc bị restart không cần thiết khi callback thay đổi.

### ✅ Dùng rememberUpdatedState

```kotlin
@Composable
fun SplashScreen(
    onTimeout: () -> Unit
) {
    val currentOnTimeout by rememberUpdatedState(onTimeout)

    LaunchedEffect(Unit) {
        delay(2_000)
        currentOnTimeout()
    }
}
```

`LaunchedEffect` không restart khi callback được tạo lại, nhưng vẫn gọi phiên bản callback mới nhất.

---

## 18. Không tạo object và lambda không cần thiết trong hot path

Không phải mọi allocation đều là vấn đề. Tuy nhiên, allocation liên tục trong animation, scrolling hoặc drawing có thể tạo áp lực GC.

### ❌ Tạo object trong draw loop

```kotlin
Canvas(modifier = Modifier.fillMaxSize()) {
    val path = Path()
    // ...
}
```

Nếu path không phụ thuộc kích thước hoặc state, cân nhắc nhớ object bên ngoài.

```kotlin
val path = remember {
    Path()
}
```

Cần reset hoặc cập nhật đúng cách trước khi tái sử dụng.

### Lambda

Với Strong Skipping, Compose Compiler có thể tự động remember nhiều lambda. Không nên bọc mọi lambda bằng `remember` theo thói quen.

Chỉ tối ưu thủ công khi:

- Lambda được truyền vào API nhạy với identity.
- Profiling cho thấy allocation đáng kể.
- Lambda capture object lớn hoặc state không cần thiết.

---

## 19. Tái sử dụng Modifier khi phù hợp

Modifier chain dài được tạo lại nhiều lần có thể tạo allocation không cần thiết, đặc biệt trong danh sách hoặc animation.

### ✅ Hoist modifier không phụ thuộc state

```kotlin
private val CardModifier = Modifier
    .fillMaxWidth()
    .padding(horizontal = 16.dp, vertical = 8.dp)
```

```kotlin
@Composable
fun ProductCard(product: Product) {
    Card(modifier = CardModifier) {
        // ...
    }
}
```

### Modifier có scope

Một số modifier chỉ hợp lệ trong scope cụ thể, như `weight` trong `RowScope` hoặc `ColumnScope`. Không hoist chúng ra ngoài sai scope.

### Không làm

- Không chia sẻ modifier chứa state mutable giữa các thành phần không liên quan.
- Không tối ưu modifier nhỏ nếu code trở nên khó đọc mà chưa có bằng chứng hiệu năng.

---

## 20. Ưu tiên Modifier lambda cho giá trị thay đổi liên tục

Các overload nhận lambda thường có thể đọc state ở Layout hoặc Draw.

### Offset animation

```kotlin
Box(
    modifier = Modifier.offset {
        IntOffset(
            x = animatedX.roundToInt(),
            y = 0
        )
    }
)
```

### Graphics layer

```kotlin
Box(
    modifier = Modifier.graphicsLayer {
        alpha = animatedAlpha
        translationY = animatedTranslationY
        scaleX = animatedScale
        scaleY = animatedScale
    }
)
```

`graphicsLayer` phù hợp cho transform và alpha thay đổi liên tục vì có thể cập nhật layer mà không cần chạy lại toàn bộ Composition.

---

## 21. Tối ưu animation

### Nguyên tắc

- Animate thuộc tính vẽ hoặc transform thay vì thay đổi cấu trúc layout khi có thể.
- Dùng `graphicsLayer` cho alpha, scale, translation, rotation.
- Hạn chế animation làm thay đổi kích thước của cây UI lớn.
- Không chạy quá nhiều animation vô hạn ngoài viewport.
- Tạm dừng animation khi màn hình không active nếu phù hợp.
- Không tạo bitmap, brush hoặc path nặng mỗi frame.

### ❌ Animation làm recompose parent lớn

```kotlin
val offset by animateDpAsState(targetValue = targetOffset)

LargeScreen(
    modifier = Modifier.offset(y = offset)
)
```

### ✅ Cô lập animation và đọc trong layout

```kotlin
val offsetPx by animateFloatAsState(
    targetValue = targetOffsetPx
)

LargeScreen(
    modifier = Modifier.offset {
        IntOffset(
            x = 0,
            y = offsetPx.roundToInt()
        )
    }
)
```

### Lưu ý

Animation API cấp cao không mặc định “chậm”. Hãy đo frame time và phạm vi invalidation thay vì thay thế API theo cảm tính.

---

## 22. Tối ưu ảnh và tài nguyên đồ họa

### Quy tắc

- Không decode ảnh lớn trực tiếp trên Main Thread.
- Yêu cầu kích thước ảnh gần với kích thước hiển thị.
- Dùng thư viện image loading có memory cache và disk cache.
- Tránh hiển thị bitmap độ phân giải rất lớn trong item nhỏ.
- Tránh crossfade hàng loạt khi scroll nếu gây jank.
- Dùng placeholder nhẹ.
- Hạn chế blur, shadow phức tạp và clipping nhiều lớp.
- Ưu tiên vector cho icon đơn giản; không dùng vector quá phức tạp cho hình minh họa lớn.

### Với Coil

```kotlin
AsyncImage(
    model = ImageRequest.Builder(LocalContext.current)
        .data(imageUrl)
        .crossfade(false)
        .build(),
    contentDescription = null,
    contentScale = ContentScale.Crop,
    modifier = Modifier.size(72.dp)
)
```

Trong danh sách dài, kiểm tra thực tế trước khi bật crossfade cho toàn bộ item.

---

## 23. Không thực hiện I/O hoặc blocking work trên Main Thread

### ❌ Không nên

```kotlin
@Composable
fun FilePreview(path: String) {
    val content = File(path).readText()
    Text(content)
}
```

### ✅ Đưa công việc ra repository/ViewModel

```kotlin
viewModelScope.launch {
    val content = withContext(Dispatchers.IO) {
        repository.readFile(path)
    }

    _uiState.update {
        it.copy(content = content)
    }
}
```

Các công việc cần tránh trên UI thread:

- Đọc/ghi file.
- Query database lớn.
- Network request.
- Decode bitmap nặng.
- Parse JSON lớn.
- Sort/filter dataset lớn.
- Mã hóa, hash hoặc compression.

---

## 24. Thu thập Flow theo lifecycle

Trên Android, ưu tiên `collectAsStateWithLifecycle()` để ngừng collection khi UI không ở lifecycle phù hợp.

```kotlin
@Composable
fun ProductRoute(
    viewModel: ProductViewModel
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    ProductScreen(
        uiState = uiState,
        onAction = viewModel::onAction
    )
}
```

### Lợi ích

- Tránh xử lý dữ liệu UI không cần thiết khi màn hình ở background.
- Giảm CPU, battery và các update dư thừa.
- Đồng bộ với lifecycle Android.

---

## 25. Không emit UI state dư thừa

Nếu ViewModel liên tục phát object mới dù nội dung không đổi, UI có thể nhận invalidation không cần thiết.

### Sử dụng distinctUntilChanged khi phù hợp

```kotlin
val searchResults: StateFlow<List<Product>> =
    query
        .debounce(300)
        .distinctUntilChanged()
        .flatMapLatest(repository::searchProducts)
        .distinctUntilChanged()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5_000),
            initialValue = emptyList()
        )
```

### Cẩn thận với equals

`distinctUntilChanged()` dựa trên equality. Nếu model mutable bị sửa tại chỗ, equality và observer behavior có thể không phản ánh đúng thay đổi.

### Không copy state vô điều kiện

```kotlin
_state.update {
    it.copy()
}
```

Nếu không có thay đổi thực tế, không cần phát state mới.

---

## 26. Tối ưu CompositionLocal

`CompositionLocal` phù hợp cho dependency có tính xuyên suốt cây UI như theme, typography hoặc dependency ambient có phạm vi rõ ràng.

Không nên dùng như một global state tùy tiện.

### Rủi ro

- Dependency bị ẩn.
- Khó xác định phạm vi invalidation.
- Thay đổi value có thể làm nhiều consumer recompose.
- Khó test component độc lập.

### Quy tắc

- Dùng parameter rõ ràng cho dependency cục bộ.
- Dùng `CompositionLocal` cho cross-cutting concern.
- Không cung cấp object mới mỗi recomposition nếu không cần.

```kotlin
val analytics = remember {
    AnalyticsTracker()
}

CompositionLocalProvider(
    LocalAnalytics provides analytics
) {
    AppContent()
}
```

---

## 27. Giảm Subcomposition không cần thiết

Một số component dùng subcomposition để đo hoặc quyết định nội dung trong quá trình layout, ví dụ một số trường hợp của:

- `BoxWithConstraints`
- `SubcomposeLayout`
- Một số lazy container
- Một số container phức tạp

Subcomposition không xấu, nhưng có chi phí cao hơn composition thông thường.

### Không dùng BoxWithConstraints chỉ để đọc kích thước nếu không cần

```kotlin
BoxWithConstraints {
    if (maxWidth > 600.dp) {
        TabletContent()
    } else {
        PhoneContent()
    }
}
```

Đây là use case hợp lý khi layout thực sự phụ thuộc constraint.

Không nên dùng `BoxWithConstraints` cho component mà constraint không ảnh hưởng nội dung.

Trong item của danh sách dài, hãy đặc biệt thận trọng với component có subcomposition hoặc layout đo nhiều lần.

---

## 28. Tối ưu startup với Baseline Profile

Baseline Profile giúp ART biên dịch trước các code path quan trọng thay vì chờ interpretation hoặc JIT compilation sau khi cài app.

### Nên profile các luồng

- Cold startup.
- Mở màn hình chính.
- Navigation quan trọng.
- Scroll danh sách chính.
- Luồng tạo hoặc chỉnh sửa nội dung.
- Luồng người dùng sử dụng thường xuyên.

### Nguyên tắc

- Tạo profile từ hành vi thực tế.
- Chạy benchmark trên physical device.
- Kiểm tra release build.
- Kết hợp Baseline Profile với Macrobenchmark.
- Không đánh giá startup Compose chỉ bằng cách bấm Run từ Android Studio.

---

## 29. Đo lường trước khi tối ưu

Không tối ưu dựa trên số lần recomposition đơn thuần.

### Công cụ nên dùng

#### Layout Inspector

- Xem recomposition count.
- Xem skip count.
- Xác định component bị invalidation quá rộng.

#### System Trace / Perfetto

- Tìm frame vượt deadline.
- Quan sát Main Thread.
- Tìm I/O, binder call hoặc work nặng trong frame.

#### Macrobenchmark

Đo:

- Startup time.
- Frame timing.
- Scroll performance.
- User journey thực tế.

#### Baseline Profile

Tối ưu code path quan trọng từ lần chạy đầu.

#### Compose Compiler Reports

Phân tích:

- Stability của class.
- Restartable/skippable Composable.
- Parameter không ổn định.

### Quy trình khoa học

1. Xác định vấn đề người dùng cảm nhận được.
2. Tạo scenario tái hiện ổn định.
3. Đo baseline.
4. Dùng trace xác định bottleneck.
5. Thay đổi một nhóm nguyên nhân.
6. Đo lại.
7. Kiểm tra regression.
8. Chỉ giữ optimization có hiệu quả thực tế.

### Không benchmark debug build

Debug build có:

- Debug instrumentation.
- Không tối ưu tương đương release.
- Hành vi compiler/runtime khác production.
- Overhead từ tooling và inspector.

Ưu tiên `release` hoặc build type benchmarkable gần với production.

---

## 30. Checklist review performance

### Recomposition và State

- [ ] Không có phép tính nặng trực tiếp trong Composable.
- [ ] `remember` có đầy đủ key cần thiết.
- [ ] Không lạm dụng `derivedStateOf`.
- [ ] State được giữ gần nơi sử dụng.
- [ ] Child chỉ nhận dữ liệu thực sự cần.
- [ ] Không ghi state trực tiếp trong thân Composable.
- [ ] Không dùng mutable collection không observable.
- [ ] UI state ưu tiên immutable.
- [ ] Không emit state mới khi nội dung không đổi.

### Lazy Layout

- [ ] Mỗi item có key ổn định và duy nhất.
- [ ] Danh sách nhiều loại item có `contentType`.
- [ ] Không dùng index làm key cho danh sách có thể thay đổi.
- [ ] Không lồng scroll cùng chiều với constraint vô hạn.
- [ ] Item không chứa tính toán, decode hoặc I/O nặng.
- [ ] Animation trong item được giới hạn hợp lý.
- [ ] Ảnh được tải theo kích thước hiển thị.

### Modifier và Phases

- [ ] State thay đổi nhanh được đọc càng muộn càng tốt.
- [ ] Offset/transform animation ưu tiên lambda modifier.
- [ ] Draw-only state được đọc trong draw phase.
- [ ] Modifier chain dài được tái sử dụng khi có lợi.
- [ ] Không hoist scoped modifier sai scope.
- [ ] Không dùng layout phức tạp khi layout đơn giản đủ dùng.

### Effects và Coroutine

- [ ] API/network không được gọi trực tiếp trong thân Composable.
- [ ] `LaunchedEffect` có key đúng.
- [ ] Listener được cleanup bằng `DisposableEffect`.
- [ ] Callback dài hạn dùng `rememberUpdatedState` khi phù hợp.
- [ ] Coroutine từ event dùng `rememberCoroutineScope`.
- [ ] I/O và blocking work không chạy trên Main Thread.
- [ ] Flow được collect theo lifecycle.

### Stability

- [ ] Model UI không chứa public mutable property.
- [ ] Không gắn `@Stable` hoặc `@Immutable` sai contract.
- [ ] Đã kiểm tra compiler report khi stability là nghi vấn.
- [ ] Không thay đổi object hoặc collection tại chỗ.
- [ ] Không tạo wrapper model chỉ để “đánh lừa” compiler.

### Animation và Graphics

- [ ] Ưu tiên transform/draw thay vì relayout lớn.
- [ ] Không tạo object nặng mỗi frame.
- [ ] Animation vô hạn được dừng khi không còn cần.
- [ ] Shadow, blur và clipping phức tạp đã được đo.
- [ ] Bitmap không lớn hơn nhu cầu hiển thị quá nhiều.

### Đo lường

- [ ] Vấn đề được tái hiện trên release/benchmark build.
- [ ] Đã đo trước và sau thay đổi.
- [ ] Đã kiểm tra frame timing bằng Macrobenchmark hoặc trace.
- [ ] Đã kiểm tra startup bằng benchmark.
- [ ] Baseline Profile bao phủ luồng người dùng quan trọng.
- [ ] Không kết luận chỉ dựa trên Recomposition Counter.

---

## Mẫu cấu trúc màn hình khuyến nghị

```kotlin
@Composable
fun ProductRoute(
    viewModel: ProductViewModel,
    onNavigateBack: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    ProductScreen(
        uiState = uiState,
        onAction = viewModel::onAction,
        onNavigateBack = onNavigateBack
    )
}

@Composable
private fun ProductScreen(
    uiState: ProductUiState,
    onAction: (ProductAction) -> Unit,
    onNavigateBack: () -> Unit
) {
    when {
        uiState.isLoading -> {
            ProductLoadingContent()
        }

        uiState.error != null -> {
            ProductErrorContent(
                message = uiState.error,
                onRetry = {
                    onAction(ProductAction.Retry)
                }
            )
        }

        else -> {
            ProductContent(
                products = uiState.products,
                onProductClick = { productId ->
                    onAction(
                        ProductAction.ProductClicked(productId)
                    )
                },
                onNavigateBack = onNavigateBack
            )
        }
    }
}

@Composable
private fun ProductContent(
    products: List<ProductUiModel>,
    onProductClick: (Long) -> Unit,
    onNavigateBack: () -> Unit
) {
    LazyColumn {
        item(
            key = "toolbar",
            contentType = "toolbar"
        ) {
            ProductToolbar(
                onNavigateBack = onNavigateBack
            )
        }

        items(
            items = products,
            key = ProductUiModel::id,
            contentType = { "product" }
        ) { product ->
            ProductRow(
                product = product,
                onClick = {
                    onProductClick(product.id)
                }
            )
        }
    }
}
```

Cấu trúc này:

- Tách Route và UI thuần.
- Collect state theo lifecycle.
- Truyền immutable state xuống dưới.
- Đẩy event lên trên.
- Dùng key và content type cho Lazy Layout.
- Dễ preview, test và profiling.

---

## Những hiểu lầm phổ biến

### “Recomposition luôn xấu”

Sai. Recomposition là cách Compose cập nhật UI. Một recomposition nhỏ, nhanh và đúng phạm vi thường không đáng lo.

### “Cứ thêm remember là nhanh hơn”

Sai. `remember` có chi phí quản lý và có thể gây stale data nếu thiếu key. Chỉ dùng khi giá trị cần tồn tại qua recomposition hoặc việc tính lại không cần thiết.

### “derivedStateOf thay thế remember”

Sai. Hai API giải quyết hai vấn đề khác nhau.

### “Data class mặc định luôn stable”

Không hoàn toàn. Stability còn phụ thuộc type của từng property.

### “@Immutable luôn làm app nhanh hơn”

Sai. Annotation sai có thể khiến UI không cập nhật đúng.

### “Tách càng nhiều Composable càng nhanh”

Không tự động. Tách component giúp cô lập state và tăng khả năng skip, nhưng phân mảnh vô lý làm code khó đọc mà chưa chắc cải thiện runtime.

### “Debug build giật nghĩa là release cũng giật”

Không thể kết luận như vậy. Compose cần được đánh giá bằng release hoặc benchmark build.

### “Tối ưu số lần recomposition là đủ”

Sai. Bottleneck có thể nằm ở layout, draw, bitmap, I/O, garbage collection, binder call hoặc công việc trên Main Thread.

---

## Thứ tự ưu tiên khi xử lý một màn hình bị giật

1. Kiểm tra có I/O, network, database hoặc decode trên Main Thread không.
2. Kiểm tra trace để tìm frame chậm.
3. Kiểm tra danh sách có key và content type phù hợp không.
4. Kiểm tra tính toán nặng trong Composition.
5. Kiểm tra state read có nằm quá cao trong cây UI không.
6. Kiểm tra animation có làm relayout cây lớn không.
7. Kiểm tra ảnh, shadow, blur và clipping.
8. Kiểm tra state/model có mutable hoặc unstable bất thường không.
9. Kiểm tra Flow có emit liên tục dữ liệu tương đương không.
10. Thêm hoặc cập nhật Baseline Profile cho luồng quan trọng.
11. Đo lại bằng cùng một benchmark scenario.

---

## Tài liệu chính thức

- [Jetpack Compose Performance](https://developer.android.com/develop/ui/compose/performance)
- [Follow best practices](https://developer.android.com/develop/ui/compose/performance/bestpractices)
- [Compose phases](https://developer.android.com/develop/ui/compose/performance/phases)
- [Stability in Compose](https://developer.android.com/develop/ui/compose/performance/stability)
- [Fix stability issues](https://developer.android.com/develop/ui/compose/performance/stability/fix)
- [Strong Skipping](https://developer.android.com/develop/ui/compose/performance/stability/strongskipping)
- [Diagnose stability issues](https://developer.android.com/develop/ui/compose/performance/stability/diagnose)
- [State and Jetpack Compose](https://developer.android.com/develop/ui/compose/state)
- [Where to hoist state](https://developer.android.com/develop/ui/compose/state-hoisting)
- [Side-effects in Compose](https://developer.android.com/develop/ui/compose/side-effects)
- [Lazy lists and grids](https://developer.android.com/develop/ui/compose/lists)
- [Compose modifiers](https://developer.android.com/develop/ui/compose/modifiers)
- [Optimizing images](https://developer.android.com/develop/ui/compose/graphics/images/optimization)
- [Practical performance problem solving](https://developer.android.com/codelabs/jetpack-compose-performance)
- [Baseline Profiles for Compose](https://developer.android.com/develop/ui/compose/performance/baseline-profiles)
- [Compose performance tooling](https://developer.android.com/develop/ui/compose/performance/tooling)

---

## Kết luận

Hiệu năng Jetpack Compose tốt không đến từ một thủ thuật đơn lẻ. Nó đến từ việc:

- Thiết kế state rõ ràng và bất biến.
- Giữ phạm vi invalidation nhỏ.
- Đọc state trong phase muộn nhất phù hợp.
- Không đặt công việc nặng trên đường dựng frame.
- Dùng Lazy Layout đúng identity.
- Quản lý Effect theo lifecycle.
- Đo lường trên build gần production.
- Chỉ tối ưu những bottleneck đã được xác nhận bằng dữ liệu.

> Quy tắc quan trọng nhất: **đo trước, xác định đúng bottleneck, tối ưu có mục tiêu và đo lại.**
