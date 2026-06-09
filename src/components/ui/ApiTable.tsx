const ROWS: [string, string][] = [
  ['LaunchedEffect', 'Chạy coroutine gắn với lifecycle của Composition'],
  ['DisposableEffect', 'Đăng ký tài nguyên và cần cleanup'],
  ['SideEffect', 'Đồng bộ state Compose ra object ngoài sau composition thành công'],
  ['produceState', 'Chuyển nguồn dữ liệu async/callback thành Compose State'],
  ['snapshotFlow', 'Chuyển snapshot state thành Flow'],
  ['rememberCoroutineScope', 'Khởi chạy coroutine từ UI event'],
  ['rememberUpdatedState', 'Effect cần giá trị mới nhất nhưng không restart'],
]

/** Reference table mapping each Side Effect API to its use case. */
export function ApiTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-ink-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-ink-100/70 text-xs uppercase text-ink-500">
          <tr>
            <th className="px-3 py-2">API</th>
            <th className="px-3 py-2">Dùng khi</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map(([api, when]) => (
            <tr key={api} className="border-t border-ink-200/70">
              <td className="px-3 py-2 font-mono text-xs text-brand-700">{api}</td>
              <td className="px-3 py-2 text-ink-600">{when}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
