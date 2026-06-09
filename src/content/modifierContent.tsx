import type { ReactNode } from 'react'
import { P, T, UL } from './blocks'
import { Callout } from '../components/ui/Callout'
import { BadGoodCompare } from '../components/ui/BadGoodCompare'
import { CodeBlock } from '../components/ui/CodeBlock'

export const modifierContent: Record<string, ReactNode> = {
  'read-state-phase': (
    <>
      <P>
        Một state chỉ ảnh hưởng đến vị trí hoặc cách vẽ không nhất thiết phải được
        đọc trong Composition. Dùng modifier đọc ở layout/draw phase khi phù hợp.
      </P>
      <BadGoodCompare
        badTitle="Đọc trong Composition"
        goodTitle="Đọc trong Layout"
        badCode={`// Có thể kích hoạt Composition khi animatedOffset thay đổi\nModifier.offset(x = animatedOffset.dp, y = 0.dp)`}
        goodCode={`Modifier.offset {\n    IntOffset(x = animatedOffset.roundToInt(), y = 0)\n}`}
      />
      <Callout kind="rule" title="Áp dụng cho">
        <UL
          items={[
            <><T>offset {'{ }'}</T>, <T>graphicsLayer {'{ }'}</T></>,
            <><T>drawBehind {'{ }'}</T>, <T>drawWithContent {'{ }'}</T></>,
            <>Custom <T>Layout</T>, custom drawing bằng <T>Canvas</T>.</>,
          ]}
        />
      </Callout>
      <P>
        Không chuyển state read sang phase khác một cách máy móc — chỉ khi state
        thực sự chỉ ảnh hưởng đến layout hoặc drawing.
      </P>
    </>
  ),

  'hot-path-allocation': (
    <>
      <P>
        Không phải mọi allocation đều là vấn đề. Nhưng allocation liên tục trong
        animation, scrolling hoặc drawing có thể tạo áp lực GC.
      </P>
      <BadGoodCompare
        badNote="Tạo Path mỗi lần vào draw loop."
        badCode={`Canvas(modifier = Modifier.fillMaxSize()) {\n    val path = Path()\n    // ...\n}`}
        goodCode={`val path = remember { Path() }\n\nCanvas(modifier = Modifier.fillMaxSize()) {\n    path.reset()\n    // cập nhật rồi tái sử dụng\n}`}
      />
      <Callout kind="tip" title="Về lambda">
        Với Strong Skipping, Compose Compiler có thể tự động remember nhiều lambda.
        Chỉ tối ưu thủ công khi lambda truyền vào API nhạy với identity, profiling
        cho thấy allocation đáng kể, hoặc lambda capture object lớn.
      </Callout>
    </>
  ),

  'reuse-modifier': (
    <>
      <P>
        Modifier chain dài được tạo lại nhiều lần có thể tạo allocation không cần
        thiết, đặc biệt trong danh sách hoặc animation.
      </P>
      <CodeBlock
        tone="good"
        code={`private val CardModifier = Modifier\n    .fillMaxWidth()\n    .padding(horizontal = 16.dp, vertical = 8.dp)\n\n@Composable\nfun ProductCard(product: Product) {\n    Card(modifier = CardModifier) { /* ... */ }\n}`}
      />
      <Callout kind="warning" title="Lưu ý scope & state">
        Một số modifier chỉ hợp lệ trong scope cụ thể (như <T>weight</T> trong{' '}
        <T>RowScope</T>). Không hoist chúng sai scope, và không chia sẻ modifier
        chứa state mutable giữa các thành phần không liên quan.
      </Callout>
    </>
  ),

  'modifier-lambda': (
    <>
      <P>
        Các overload nhận lambda thường có thể đọc state ở Layout hoặc Draw — phù
        hợp cho giá trị thay đổi liên tục.
      </P>
      <CodeBlock
        tone="good"
        code={`Box(modifier = Modifier.offset {\n    IntOffset(x = animatedX.roundToInt(), y = 0)\n})`}
      />
      <CodeBlock
        tone="good"
        code={`Box(modifier = Modifier.graphicsLayer {\n    alpha = animatedAlpha\n    translationY = animatedTranslationY\n    scaleX = animatedScale\n    scaleY = animatedScale\n})`}
      />
      <Callout kind="info">
        <T>graphicsLayer</T> phù hợp cho transform và alpha thay đổi liên tục vì có
        thể cập nhật layer mà không cần chạy lại toàn bộ Composition.
      </Callout>
    </>
  ),
}
