import type { ReactNode } from 'react'
import { P, T, UL } from './blocks'
import { Callout } from '../components/ui/Callout'
import { BadGoodCompare } from '../components/ui/BadGoodCompare'
import { CodeBlock } from '../components/ui/CodeBlock'
import { ApiTable } from '../components/ui/ApiTable'

export const effectsContent: Record<string, ReactNode> = {
  'side-effect-api': (
    <>
      <P>
        Không khởi chạy coroutine, đăng ký listener hoặc gọi API trực tiếp trong
        thân Composable — vì hàm có thể chạy lại sau mỗi recomposition.
      </P>
      <BadGoodCompare
        badCode={`@Composable\nfun ProfileScreen(viewModel: ProfileViewModel) {\n    viewModel.loadProfile() // chạy lại mỗi recomposition\n}`}
        goodCode={`@Composable\nfun ProfileScreen(userId: Long, viewModel: ProfileViewModel) {\n    LaunchedEffect(userId) {\n        viewModel.loadProfile(userId)\n    }\n}`}
      />
      <CodeBlock
        tone="good"
        code={`DisposableEffect(connectivityManager) {\n    val callback = createNetworkCallback(onChanged)\n    connectivityManager.registerDefaultNetworkCallback(callback)\n    onDispose {\n        connectivityManager.unregisterNetworkCallback(callback)\n    }\n}`}
      />
      <ApiTable />
    </>
  ),

  'remember-updated-state': (
    <>
      <P>
        Effect dài hạn có thể capture callback cũ hoặc bị restart không cần thiết
        khi callback thay đổi. <T>rememberUpdatedState</T> giải quyết điều đó.
      </P>
      <CodeBlock
        tone="good"
        code={`@Composable\nfun SplashScreen(onTimeout: () -> Unit) {\n    val currentOnTimeout by rememberUpdatedState(onTimeout)\n    LaunchedEffect(Unit) {\n        delay(2_000)\n        currentOnTimeout()\n    }\n}`}
      />
      <Callout kind="info">
        <T>LaunchedEffect</T> không restart khi callback được tạo lại, nhưng vẫn
        gọi phiên bản callback mới nhất.
      </Callout>
    </>
  ),

  'main-thread': (
    <>
      <P>
        Không thực hiện I/O hoặc blocking work trên Main Thread. Đưa công việc ra
        repository/ViewModel với <T>Dispatchers.IO</T>.
      </P>
      <BadGoodCompare
        badCode={`@Composable\nfun FilePreview(path: String) {\n    val content = File(path).readText()\n    Text(content)\n}`}
        goodCode={`viewModelScope.launch {\n    val content = withContext(Dispatchers.IO) {\n        repository.readFile(path)\n    }\n    _uiState.update { it.copy(content = content) }\n}`}
      />
      <Callout kind="warning" title="Cần tránh trên UI thread">
        <UL
          items={[
            'Đọc/ghi file, query database lớn, network request.',
            'Decode bitmap nặng, parse JSON lớn.',
            'Sort/filter dataset lớn; mã hóa, hash, compression.',
          ]}
        />
      </Callout>
    </>
  ),

  'flow-lifecycle': (
    <>
      <P>
        Trên Android, ưu tiên <T>collectAsStateWithLifecycle()</T> để ngừng
        collection khi UI không ở lifecycle phù hợp.
      </P>
      <CodeBlock
        tone="good"
        code={`@Composable\nfun ProductRoute(viewModel: ProductViewModel) {\n    val uiState by viewModel.uiState.collectAsStateWithLifecycle()\n    ProductScreen(uiState = uiState, onAction = viewModel::onAction)\n}`}
      />
      <Callout kind="rule" title="Lợi ích">
        <UL
          items={[
            'Tránh xử lý dữ liệu UI không cần thiết khi màn hình ở background.',
            'Giảm CPU, battery và các update dư thừa.',
            'Đồng bộ với lifecycle Android.',
          ]}
        />
      </Callout>
    </>
  ),

  'redundant-emit': (
    <>
      <P>
        Nếu ViewModel liên tục phát object mới dù nội dung không đổi, UI có thể
        nhận invalidation không cần thiết. Dùng <T>distinctUntilChanged()</T> khi
        phù hợp.
      </P>
      <CodeBlock
        code={`val searchResults: StateFlow<List<Product>> =\n    query\n        .debounce(300)\n        .distinctUntilChanged()\n        .flatMapLatest(repository::searchProducts)\n        .distinctUntilChanged()\n        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())`}
      />
      <Callout kind="warning" title="Cẩn thận với equals & copy">
        <T>distinctUntilChanged()</T> dựa trên equality. Nếu model mutable bị sửa
        tại chỗ, behavior có thể sai. Đừng <T>it.copy()</T> vô điều kiện khi không
        có thay đổi thực tế.
      </Callout>
    </>
  ),
}
