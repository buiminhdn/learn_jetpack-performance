import type { ReactNode } from 'react'
import { P, T, UL } from './blocks'
import { Callout } from '../components/ui/Callout'
import { BadGoodCompare } from '../components/ui/BadGoodCompare'
import { CodeBlock } from '../components/ui/CodeBlock'

export const animationContent: Record<string, ReactNode> = {
  animation: (
    <>
      <Callout kind="rule" title="Nguyên tắc">
        <UL
          items={[
            'Animate thuộc tính vẽ/transform thay vì thay đổi cấu trúc layout khi có thể.',
            <>Dùng <T>graphicsLayer</T> cho alpha, scale, translation, rotation.</>,
            'Hạn chế animation làm thay đổi kích thước của cây UI lớn.',
            'Không chạy quá nhiều animation vô hạn ngoài viewport; tạm dừng khi màn hình không active.',
            'Không tạo bitmap, brush hoặc path nặng mỗi frame.',
          ]}
        />
      </Callout>
      <BadGoodCompare
        badTitle="Animation làm recompose parent lớn"
        goodTitle="Cô lập animation, đọc trong layout"
        badCode={`val offset by animateDpAsState(targetValue = targetOffset)\n\nLargeScreen(\n    modifier = Modifier.offset(y = offset)\n)`}
        goodCode={`val offsetPx by animateFloatAsState(targetValue = targetOffsetPx)\n\nLargeScreen(\n    modifier = Modifier.offset {\n        IntOffset(x = 0, y = offsetPx.roundToInt())\n    }\n)`}
      />
      <Callout kind="info">
        Animation API cấp cao không mặc định “chậm”. Hãy đo frame time và phạm vi
        invalidation thay vì thay thế API theo cảm tính.
      </Callout>
    </>
  ),

  images: (
    <>
      <Callout kind="rule" title="Quy tắc">
        <UL
          items={[
            'Không decode ảnh lớn trực tiếp trên Main Thread.',
            'Yêu cầu kích thước ảnh gần với kích thước hiển thị.',
            'Dùng thư viện image loading có memory cache và disk cache.',
            'Tránh hiển thị bitmap độ phân giải rất lớn trong item nhỏ.',
            'Dùng placeholder nhẹ; hạn chế blur, shadow phức tạp và clipping nhiều lớp.',
            'Ưu tiên vector cho icon đơn giản; không dùng vector quá phức tạp cho hình lớn.',
          ]}
        />
      </Callout>
      <CodeBlock
        code={`AsyncImage(\n    model = ImageRequest.Builder(LocalContext.current)\n        .data(imageUrl)\n        .crossfade(false)\n        .build(),\n    contentDescription = null,\n    contentScale = ContentScale.Crop,\n    modifier = Modifier.size(72.dp)\n)`}
      />
      <P>
        Trong danh sách dài, kiểm tra thực tế trước khi bật <T>crossfade</T> cho
        toàn bộ item.
      </P>
    </>
  ),
}
