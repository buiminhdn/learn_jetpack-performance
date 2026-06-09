import { useState } from 'react'
import { DemoFrame } from '../ui/DemoFrame'
import { Toggle } from '../ui/Toggle'
import { RecomposeCounter } from '../ui/RecomposeCounter'
import { FlashBox } from './shared/FlashBox'
import { CodeBlock } from '../ui/CodeBlock'

export function StabilityDemo() {
  const [stable, setStable] = useState(true)
  const [parentRecompose, setParentRecompose] = useState(0)
  const [childRecompose, setChildRecompose] = useState(0)

  const recomposeParent = () => {
    setParentRecompose((c) => c + 1)
    // Unstable params force the child to recompose even when its data didn't change.
    if (!stable) setChildRecompose((c) => c + 1)
  }

  return (
    <DemoFrame
      title="Stability quyết định Composable có skip được không"
      description="Bấm “Recompose cha” khi dữ liệu con KHÔNG đổi. Param stable → con được skip; unstable → con vẫn chạy lại."
    >
      <div className="mb-4">
        <Toggle
          checked={stable}
          onChange={setStable}
          label={stable ? 'Param stable: data class chỉ chứa val ổn định' : 'Param unstable: chứa MutableList / kiểu không ổn định'}
          description={
            stable
              ? 'Compose đánh dấu skippable → bỏ qua khi input không đổi.'
              : 'Compose không chắc về thay đổi → không skip được.'
          }
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button onClick={recomposeParent} className="btn-primary">
          ♻️ Recompose cha (dữ liệu con giữ nguyên)
        </button>
        <span
          className={`chip text-xs font-bold ${
            stable
              ? 'bg-android-100 text-android-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {stable ? 'skippable ✓' : 'not skippable ✗'}
        </span>
      </div>

      <FlashBox signature={childRecompose} tone={stable ? 'ok' : 'bad'}>
        <div className="card-muted p-4 text-center">
          <p className="text-sm font-semibold">Child Composable</p>
          <p className="mt-1 text-xs text-ink-500">
            {stable ? 'Được skip khi cha recompose' : 'Bị recompose theo cha'}
          </p>
        </div>
      </FlashBox>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <RecomposeCounter count={parentRecompose} label="recompose cha" />
        <RecomposeCounter count={childRecompose} warn={!stable} label="recompose con" />
      </div>

      <div className="mt-4">
        <CodeBlock
          tone={stable ? 'good' : 'bad'}
          code={
            stable
              ? `data class UserUiModel(\n    val id: Long,\n    val name: String,\n    val avatarUrl: String?\n) // tất cả property ổn định → stable`
              : `data class UserUiModel(\n    val tags: MutableList<String> // không ổn định\n)`
          }
        />
      </div>
    </DemoFrame>
  )
}
