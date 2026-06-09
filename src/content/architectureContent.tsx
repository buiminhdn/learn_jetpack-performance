import type { ReactNode } from 'react'
import { P, T, UL } from './blocks'
import { Callout } from '../components/ui/Callout'
import { CodeBlock } from '../components/ui/CodeBlock'

export const architectureContent: Record<string, ReactNode> = {
  'composition-local': (
    <>
      <P>
        <T>CompositionLocal</T> phù hợp cho dependency có tính xuyên suốt cây UI
        như theme, typography hoặc dependency ambient có phạm vi rõ ràng. Không nên
        dùng như một global state tùy tiện.
      </P>
      <Callout kind="warning" title="Rủi ro">
        <UL
          items={[
            'Dependency bị ẩn, khó xác định phạm vi invalidation.',
            'Thay đổi value có thể làm nhiều consumer recompose.',
            'Khó test component độc lập.',
          ]}
        />
      </Callout>
      <Callout kind="rule" title="Quy tắc">
        <UL
          items={[
            'Dùng parameter rõ ràng cho dependency cục bộ.',
            'Dùng CompositionLocal cho cross-cutting concern.',
            'Không cung cấp object mới mỗi recomposition nếu không cần.',
          ]}
        />
      </Callout>
      <CodeBlock
        tone="good"
        code={`val analytics = remember { AnalyticsTracker() }\n\nCompositionLocalProvider(\n    LocalAnalytics provides analytics\n) {\n    AppContent()\n}`}
      />
    </>
  ),

  subcomposition: (
    <>
      <P>
        Một số component dùng subcomposition để đo hoặc quyết định nội dung trong
        quá trình layout, ví dụ <T>BoxWithConstraints</T>, <T>SubcomposeLayout</T>,
        một số lazy container. Subcomposition không xấu, nhưng có chi phí cao hơn
        composition thông thường.
      </P>
      <CodeBlock
        code={`BoxWithConstraints {\n    if (maxWidth > 600.dp) {\n        TabletContent()\n    } else {\n        PhoneContent()\n    }\n}`}
      />
      <Callout kind="info">
        Đây là use case hợp lý khi layout thực sự phụ thuộc constraint. Không nên
        dùng <T>BoxWithConstraints</T> cho component mà constraint không ảnh hưởng
        nội dung. Trong item của danh sách dài, đặc biệt thận trọng với component
        có subcomposition hoặc layout đo nhiều lần.
      </Callout>
    </>
  ),
}
