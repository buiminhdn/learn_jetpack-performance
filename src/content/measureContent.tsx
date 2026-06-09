import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { P, T, UL, H } from './blocks'
import { Callout } from '../components/ui/Callout'

export const measureContent: Record<string, ReactNode> = {
  'baseline-profile': (
    <>
      <P>
        Baseline Profile giúp ART biên dịch trước các code path quan trọng thay vì
        chờ interpretation hoặc JIT compilation sau khi cài app.
      </P>
      <H>Nên profile các luồng</H>
      <UL
        items={[
          'Cold startup, mở màn hình chính, navigation quan trọng.',
          'Scroll danh sách chính, luồng tạo/chỉnh sửa nội dung.',
          'Luồng người dùng sử dụng thường xuyên.',
        ]}
      />
      <Callout kind="rule" title="Nguyên tắc">
        <UL
          items={[
            'Tạo profile từ hành vi thực tế, chạy benchmark trên physical device.',
            'Kiểm tra release build, kết hợp với Macrobenchmark.',
            'Không đánh giá startup chỉ bằng cách bấm Run từ Android Studio.',
          ]}
        />
      </Callout>
    </>
  ),

  'measure-first': (
    <>
      <P>
        Không tối ưu dựa trên số lần recomposition đơn thuần. Hãy dùng đúng công cụ
        và quy trình khoa học.
      </P>
      <H>Công cụ nên dùng</H>
      <UL
        items={[
          <><b>Layout Inspector</b> — recomposition count, skip count, invalidation rộng.</>,
          <><b>System Trace / Perfetto</b> — frame vượt deadline, Main Thread, I/O/binder nặng.</>,
          <><b>Macrobenchmark</b> — startup time, frame timing, scroll, user journey.</>,
          <><b>Compose Compiler Reports</b> — stability, restartable/skippable, param không ổn định.</>,
        ]}
      />
      <Callout kind="rule" title="Quy trình khoa học">
        <UL
          items={[
            'Xác định vấn đề người dùng cảm nhận được → tạo scenario tái hiện ổn định.',
            'Đo baseline → dùng trace tìm bottleneck.',
            'Thay đổi một nhóm nguyên nhân → đo lại → kiểm tra regression.',
            'Chỉ giữ optimization có hiệu quả thực tế.',
          ]}
        />
      </Callout>
      <Callout kind="warning" title="Không benchmark debug build">
        Debug build có instrumentation, không tối ưu như release, hành vi
        compiler/runtime khác production. Ưu tiên <T>release</T> hoặc build
        benchmarkable gần production.
      </Callout>
    </>
  ),

  checklist: (
    <>
      <P>
        Bộ checklist review đầy đủ trước khi merge — bao gồm Recomposition &amp;
        State, Lazy Layout, Modifier &amp; Phases, Effects &amp; Coroutine,
        Stability, Animation &amp; Graphics và Đo lường.
      </P>
      <Callout kind="tip" title="Có trang tương tác riêng">
        Mở{' '}
        <Link to="/checklist" className="font-semibold text-brand-600 underline">
          trang Checklist
        </Link>{' '}
        để tick từng mục, theo dõi tiến độ và lưu lại trên trình duyệt của bạn.
      </Callout>
    </>
  ),
}
