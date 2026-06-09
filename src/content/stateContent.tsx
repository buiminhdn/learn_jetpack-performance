import type { ReactNode } from 'react'
import { P, T, UL, H } from './blocks'
import { Callout } from '../components/ui/Callout'
import { BadGoodCompare } from '../components/ui/BadGoodCompare'
import { CodeBlock } from '../components/ui/CodeBlock'

export const stateContent: Record<string, ReactNode> = {
  remember: (
    <>
      <P>
        <T>remember</T> giữ một giá trị trong Composition qua các lần
        recomposition. Nên dùng cho object tạo từ input ổn định, state cục bộ của
        UI, kết quả tính toán vừa phải, hoặc state holder như <T>LazyListState</T>,{' '}
        <T>ScrollState</T>, <T>PagerState</T>.
      </P>
      <H>Sai lầm: thiếu key</H>
      <BadGoodCompare
        badNote="Kết quả không cập nhật khi items thay đổi."
        badCode={`val filteredItems = remember {\n    items.filter { it.visible }\n}`}
        goodCode={`val filteredItems = remember(items) {\n    items.filter { it.visible }\n}`}
      />
      <H>Sai lầm: dùng mutable object không observable</H>
      <BadGoodCompare
        badNote="Thay đổi users không tự động làm UI cập nhật."
        badCode={`val users = remember { mutableListOf<User>() }`}
        goodCode={`val users = remember { mutableStateListOf<User>() }`}
      />
      <Callout kind="tip" title="Hoặc ưu tiên immutable state">
        <CodeBlock code={`var users by remember { mutableStateOf(emptyList<User>()) }\n\nusers = users + newUser`} />
      </Callout>
    </>
  ),

  'derived-state-of': (
    <>
      <P>
        <T>derivedStateOf</T> hữu ích khi input thay đổi <b>thường xuyên</b> nhưng
        kết quả mà UI quan tâm thay đổi <b>ít hơn</b>. Ví dụ kinh điển: nút “cuộn
        lên đầu” chỉ cần biết <T>firstVisibleItemIndex &gt; 0</T>.
      </P>
      <CodeBlock
        code={`val showScrollToTop by remember {\n    derivedStateOf {\n        listState.firstVisibleItemIndex > 0\n    }\n}`}
      />
      <H>Không nên dùng cho phép nối giá trị đơn giản</H>
      <CodeBlock
        tone="bad"
        code={`val fullName by remember {\n    derivedStateOf { "$firstName $lastName" }\n}`}
      />
      <P>
        <T>firstName</T> và <T>lastName</T> đổi thì <T>fullName</T> gần như luôn
        đổi theo — <T>derivedStateOf</T> không mang lại lợi ích.
      </P>
      <Callout kind="rule" title="Dùng derivedStateOf khi">
        <UL
          items={[
            'State nguồn thay đổi nhanh.',
            'Kết quả dẫn xuất thay đổi ít hơn đáng kể.',
            'Bạn cần giảm số lần invalidation ở consumer.',
          ]}
        />
      </Callout>
    </>
  ),

  'defer-state-read': (
    <>
      <P>
        Đọc state càng cao trong cây UI thì phạm vi bị invalidation càng rộng. Khi
        truyền <b>state provider</b> (lambda) thay vì giá trị, việc đọc được trì
        hoãn xuống layout phase.
      </P>
      <BadGoodCompare
        badNote="SnackDetail đọc scrollState.value nên cha recompose liên tục khi cuộn."
        badCode={`@Composable\nfun SnackDetail() {\n    val scrollState = rememberScrollState()\n    Box {\n        Title(offset = scrollState.value)\n    }\n}`}
        goodCode={`@Composable\nfun SnackDetail() {\n    val scrollState = rememberScrollState()\n    Box {\n        Title(offsetProvider = { scrollState.value })\n    }\n}`}
      />
      <CodeBlock
        tone="good"
        code={`@Composable\nprivate fun Title(offsetProvider: () -> Int) {\n    Text(\n        text = "Snack",\n        modifier = Modifier.offset {\n            IntOffset(x = 0, y = offsetProvider())\n        }\n    )\n}`}
      />
    </>
  ),

  'state-locality': (
    <>
      <P>
        State nên được hoist đến <b>lowest common ancestor</b> của các thành phần
        cần đọc và ghi nó. Không phải state nào cũng nên đưa lên ViewModel.
      </P>
      <H>Có thể giữ trong UI</H>
      <UL
        items={[
          'Trạng thái mở/đóng dropdown.',
          'Tab cục bộ, expansion của một card.',
          'Vị trí scroll, trạng thái dialog tạm thời.',
        ]}
      />
      <CodeBlock
        code={`@Composable\nfun FilterButton() {\n    var expanded by rememberSaveable { mutableStateOf(false) }\n    // ...\n}`}
      />
      <H>Nên đưa lên ViewModel</H>
      <UL
        items={[
          'Dữ liệu màn hình và business rule.',
          'Trạng thái cần tồn tại qua navigation.',
          'Trạng thái được nhiều khu vực cùng dùng hoặc cần đồng bộ repository.',
        ]}
      />
    </>
  ),

  'minimal-params': (
    <>
      <P>
        Truyền một object lớn khiến child bị ràng buộc với nhiều field không liên
        quan. Hãy truyền dữ liệu tối thiểu mà component thực sự cần.
      </P>
      <BadGoodCompare
        badNote="UserHeader chỉ cần userName nhưng API phụ thuộc toàn bộ ProfileUiState."
        badCode={`@Composable\nfun UserHeader(uiState: ProfileUiState) {\n    Text(uiState.userName)\n}`}
        goodCode={`@Composable\nfun UserHeader(userName: String) {\n    Text(userName)\n}`}
      />
      <Callout kind="rule" title="Lợi ích">
        <UL
          items={[
            'API rõ ràng, phạm vi thay đổi nhỏ hơn.',
            'Dễ preview và test, dễ nhận biết dependency.',
            'Tăng khả năng Compose skip child khi input không đổi.',
          ]}
        />
      </Callout>
      <P>
        Không cần phân rã cực đoan. Có thể truyền một UI model nhỏ, immutable và
        đúng phạm vi component.
      </P>
    </>
  ),

  'backwards-write': (
    <>
      <P>
        Không ghi vào state trong cùng composition sau khi đã đọc nó — đây là{' '}
        <b>backwards write</b> và có thể tạo vòng lặp recomposition vô hạn.
      </P>
      <BadGoodCompare
        badNote="count++ sau khi đọc count → loop vô hạn."
        badCode={`@Composable\nfun BadCounter() {\n    var count by remember { mutableIntStateOf(0) }\n    Text(text = count.toString())\n    count++\n}`}
        goodCode={`@Composable\nfun Counter() {\n    var count by remember { mutableIntStateOf(0) }\n    Button(onClick = { count++ }) { Text("Increase") }\n    Text(text = count.toString())\n}`}
      />
      <Callout kind="tip" title="Hoặc trong Effect được kiểm soát">
        <CodeBlock code={`LaunchedEffect(userId) {\n    viewModel.loadUser(userId)\n}`} />
        Composable nên gần với một hàm mô tả UI thuần: nhận state, phát event.
      </Callout>
    </>
  ),
}
