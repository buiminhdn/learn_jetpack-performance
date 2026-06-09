import { useState } from 'react'
import { DemoFrame } from '../ui/DemoFrame'
import { Toggle } from '../ui/Toggle'
import { RecomposeCounter } from '../ui/RecomposeCounter'
import { FlashBox } from './shared/FlashBox'
import { BadGoodCompare } from '../ui/BadGoodCompare'

export function SkipDemo() {
  const [passField, setPassField] = useState(true)
  const [userName, setUserName] = useState('Minh')
  const [unread, setUnread] = useState(3)
  const [childRecompose, setChildRecompose] = useState(0)

  const NAMES = ['Minh', 'An', 'Lan', 'Nam', 'Hà']

  const bumpUnread = () => {
    setUnread((u) => u + 1)
    // If the child depends on the whole UiState, an unrelated field still recomposes it.
    if (!passField) setChildRecompose((c) => c + 1)
  }

  const changeName = () => {
    setUserName((n) => NAMES[(NAMES.indexOf(n) + 1) % NAMES.length])
    // userName actually changed → child recomposes in both modes.
    setChildRecompose((c) => c + 1)
  }

  return (
    <DemoFrame
      title="Truyền dữ liệu tối thiểu → tăng khả năng skip"
      description="UserHeader chỉ cần userName. Đổi unreadCount (không liên quan) và xem child có recompose không."
    >
      <div className="mb-4">
        <Toggle
          checked={passField}
          onChange={setPassField}
          label={passField ? 'UserHeader(userName: String)' : 'UserHeader(uiState: ProfileUiState)'}
          description={
            passField
              ? 'Chỉ phụ thuộc userName → skip khi field khác đổi.'
              : 'Phụ thuộc cả object → field nào đổi cũng recompose.'
          }
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={bumpUnread} className="btn-primary">
          🔔 Đổi unreadCount ({unread})
        </button>
        <button onClick={changeName} className="btn-ghost">
          ✏️ Đổi userName
        </button>
      </div>

      <FlashBox signature={childRecompose} tone={passField ? 'ok' : 'bad'}>
        <div className="card-muted flex items-center gap-3 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 text-lg font-bold text-white">
            {userName[0]}
          </div>
          <div>
            <p className="text-sm font-semibold">UserHeader</p>
            <p className="text-lg font-bold">{userName}</p>
          </div>
        </div>
      </FlashBox>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <RecomposeCounter count={childRecompose} warn={!passField} label="child recompose" />
        <p className="text-sm text-ink-600">
          {passField
            ? '✅ Đổi unreadCount không làm UserHeader recompose.'
            : '⚠️ Đổi unreadCount vẫn làm UserHeader recompose dù không dùng tới.'}
        </p>
      </div>

      <div className="mt-4">
        <BadGoodCompare
          badCode={`@Composable\nfun UserHeader(uiState: ProfileUiState) {\n    Text(uiState.userName)\n}`}
          goodCode={`@Composable\nfun UserHeader(userName: String) {\n    Text(userName)\n}`}
        />
      </div>
    </DemoFrame>
  )
}
