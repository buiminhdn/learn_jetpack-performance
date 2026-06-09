import type { ReactNode } from 'react'
import { P, T, UL } from './blocks'
import { Callout } from '../components/ui/Callout'
import { BadGoodCompare } from '../components/ui/BadGoodCompare'
import { CodeBlock } from '../components/ui/CodeBlock'

export const lazyContent: Record<string, ReactNode> = {
  'lazy-key': (
    <>
      <P>
        Không có key, Lazy Layout thường định danh item theo vị trí. Khi thêm, xóa
        hoặc di chuyển item, Compose khó giữ đúng identity của từng item (state,
        animation, scroll position).
      </P>
      <BadGoodCompare
        badCode={`LazyColumn {\n    items(notes) { note ->\n        NoteRow(note)\n    }\n}`}
        goodCode={`LazyColumn {\n    items(\n        items = notes,\n        key = Note::id\n    ) { note ->\n        NoteRow(note)\n    }\n}`}
      />
      <Callout kind="rule" title="Key phải đáp ứng">
        <UL
          items={[
            'Duy nhất trong danh sách.',
            'Ổn định theo identity của item.',
            'Không phụ thuộc vào index, không đổi mỗi lần render.',
          ]}
        />
      </Callout>
      <BadGoodCompare
        badTitle="Key sai"
        goodTitle="Key đúng"
        badCode={`key = { UUID.randomUUID() }\nkey = { index }`}
        goodCode={`key = { note -> note.id }`}
      />
      <Callout kind="tip" title="Khi item có rememberSaveable">
        Key nên thuộc loại có thể lưu trong <T>Bundle</T>, đặc biệt khi state của
        item cần được phục hồi sau recreation.
      </Callout>
    </>
  ),

  'content-type': (
    <>
      <P>
        Khi Lazy Layout chứa nhiều cấu trúc item khác nhau, <T>contentType</T> giúp
        Compose tái sử dụng composition hiệu quả hơn giữa các item cùng loại.
      </P>
      <CodeBlock
        code={`sealed interface FeedItem {\n    val id: String\n    data class Header(override val id: String, val title: String) : FeedItem\n    data class Post(override val id: String, val data: PostData) : FeedItem\n    data class Ad(override val id: String, val data: AdData) : FeedItem\n}`}
      />
      <CodeBlock
        tone="good"
        code={`LazyColumn {\n    items(\n        items = feedItems,\n        key = FeedItem::id,\n        contentType = { item ->\n            when (item) {\n                is FeedItem.Header -> "header"\n                is FeedItem.Post -> "post"\n                is FeedItem.Ad -> "ad"\n            }\n        }\n    ) { item ->\n        when (item) {\n            is FeedItem.Header -> HeaderRow(item)\n            is FeedItem.Post -> PostRow(item)\n            is FeedItem.Ad -> AdRow(item)\n        }\n    }\n}`}
      />
    </>
  ),

  'nested-scroll': (
    <>
      <P>
        Lồng <T>LazyColumn</T> trong một container cuộn dọc không có chiều cao xác
        định có thể gây lỗi constraint hoặc khiến hệ thống đo layout không hợp lý.
      </P>
      <BadGoodCompare
        badTitle="Không nên"
        goodTitle="Gộp vào một LazyColumn"
        badCode={`Column(\n    modifier = Modifier.verticalScroll(rememberScrollState())\n) {\n    LazyColumn {\n        items(items) { item -> ItemRow(item) }\n    }\n}`}
        goodCode={`LazyColumn {\n    item { Header() }\n    items(\n        items = items,\n        key = Item::id\n    ) { item -> ItemRow(item) }\n    item { Footer() }\n}`}
      />
      <Callout kind="info">
        Danh sách cuộn <b>khác chiều</b> có thể hợp lệ, ví dụ <T>LazyRow</T> nằm
        trong <T>LazyColumn</T>.
      </Callout>
    </>
  ),
}
