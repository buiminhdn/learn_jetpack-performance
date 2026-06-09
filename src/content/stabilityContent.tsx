import type { ReactNode } from 'react'
import { P, T, UL, H } from './blocks'
import { Callout } from '../components/ui/Callout'
import { BadGoodCompare } from '../components/ui/BadGoodCompare'
import { CodeBlock } from '../components/ui/CodeBlock'

export const stabilityContent: Record<string, ReactNode> = {
  'immutable-state': (
    <>
      <P>
        Compose hoạt động tốt nhất khi dữ liệu đầu vào có semantics rõ ràng: hoặc
        bất biến, hoặc thay đổi thông qua observable state.
      </P>
      <BadGoodCompare
        badNote="Compose không biết khi nội dung bên trong MutableList bị thay đổi."
        badCode={`data class ScreenUiState(\n    val items: MutableList<Item>\n)`}
        goodCode={`data class ScreenUiState(\n    val items: List<Item> = emptyList()\n)`}
      />
      <H>Cập nhật bằng cách tạo state mới</H>
      <CodeBlock
        tone="good"
        code={`_state.update { current ->\n    current.copy(items = current.items + newItem)\n}`}
      />
      <Callout kind="tip" title="Với dự án nhạy cảm về stability">
        <CodeBlock
          code={`import kotlinx.collections.immutable.ImmutableList\nimport kotlinx.collections.immutable.persistentListOf\n\ndata class ScreenUiState(\n    val items: ImmutableList<Item> = persistentListOf()\n)`}
        />
        Chỉ thêm dependency khi có lý do đo lường hoặc consistency rõ ràng.
      </Callout>
    </>
  ),

  stability: (
    <>
      <P>
        Compose phân tích parameter để xác định một Composable có thể được bỏ qua
        trong recomposition hay không. Một type thường ổn định khi:
      </P>
      <UL
        items={[
          <>Giá trị <T>equals</T> không đổi nếu object chưa phát tín hiệu thay đổi.</>,
          'Nếu property thay đổi, Compose có thể quan sát sự thay đổi đó.',
          'Các property của nó cũng ổn định.',
        ]}
      />
      <BadGoodCompare
        badTitle="Dễ gây bất ổn"
        goodTitle="Thường ổn định"
        badCode={`data class UserUiModel(\n    val tags: List<String>\n)`}
        goodCode={`data class UserUiModel(\n    val id: Long,\n    val name: String,\n    val avatarUrl: String?\n)`}
      />
      <Callout kind="info" title="Strong Skipping">
        Strong Skipping giúp nhiều Composable có unstable parameter vẫn skip được
        nếu parameter không đổi. Tuy vậy, mutable object vẫn có thể gây lỗi UI nếu
        bị thay đổi tại chỗ — <b>stability là contract về correctness trước khi là
        optimization</b>.
      </Callout>
    </>
  ),

  'stable-annotation': (
    <>
      <P>
        <T>@Stable</T> và <T>@Immutable</T> là cam kết với Compose Compiler. Đừng
        gắn annotation chỉ để “ép tối ưu”.
      </P>
      <BadGoodCompare
        badNote="Contract sai: nội dung items có thể thay đổi mà Compose không biết."
        badCode={`@Immutable\ndata class BadUiState(\n    val items: MutableList<Item>\n)`}
        goodCode={`@Immutable\ndata class ProductUiModel(\n    val id: Long,\n    val name: String,\n    val priceText: String\n)`}
      />
      <Callout kind="rule">
        <UL
          items={[
            'Ưu tiên sửa model trước, dùng immutable property.',
            'Tránh public mutable state.',
            'Chỉ annotation khi hiểu rõ stability contract.',
            'Kiểm tra compiler report thay vì đoán.',
          ]}
        />
      </Callout>
    </>
  ),
}
