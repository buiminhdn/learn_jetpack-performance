import type { ReactNode } from 'react'
import { P, T, UL, H } from './blocks'
import { Callout } from '../components/ui/Callout'
import { BadGoodCompare } from '../components/ui/BadGoodCompare'

export const foundationContent: Record<string, ReactNode> = {
  'nguyen-tac-nen-tang': (
    <>
      <P>
        Một frame Compose có thể đi qua ba phase: <T>Composition</T> (quyết định
        thành phần UI nào tồn tại), <T>Layout</T> (đo kích thước và xác định vị
        trí) và <T>Draw</T> (vẽ pixel lên màn hình).
      </P>
      <P>Mục tiêu tối ưu không phải là “không bao giờ recompose”, mà là:</P>
      <UL
        items={[
          'Chỉ chạy lại phần UI thực sự phụ thuộc vào dữ liệu đã thay đổi.',
          'Cho phép Compose bỏ qua các phase không cần thiết.',
          'Không đặt công việc nặng vào đường chạy dựng frame.',
          'Giữ dữ liệu đầu vào ổn định và dễ so sánh.',
          'Đo hiệu năng trên bản release, không kết luận từ debug build.',
        ]}
      />
      <Callout kind="info" title="Recomposition là bình thường">
        Vấn đề chỉ xuất hiện khi <b>phạm vi</b> recomposition quá rộng, xảy ra
        quá <b>thường xuyên</b> hoặc chứa <b>công việc tốn kém</b>.
      </Callout>
    </>
  ),

  'tinh-toan-nang': (
    <>
      <P>
        Composable có thể chạy lại nhiều lần. Không nên <T>sort</T>, <T>filter</T>,{' '}
        <T>parse</T>, <T>decode</T>, map dữ liệu lớn hoặc thực hiện thuật toán
        phức tạp trực tiếp trong thân hàm.
      </P>
      <BadGoodCompare
        badTitle="Chưa tối ưu"
        goodTitle="Tốt hơn với remember"
        badNote="Danh sách bị sắp xếp lại sau mỗi lần ContactList recomposition."
        badCode={`@Composable
fun ContactList(
    contacts: List<Contact>,
    comparator: Comparator<Contact>
) {
    LazyColumn {
        items(contacts.sortedWith(comparator)) { contact ->
            ContactRow(contact)
        }
    }
}`}
        goodCode={`@Composable
fun ContactList(
    contacts: List<Contact>,
    comparator: Comparator<Contact>
) {
    val sortedContacts = remember(contacts, comparator) {
        contacts.sortedWith(comparator)
    }
    LazyColumn {
        items(sortedContacts) { contact -> ContactRow(contact) }
    }
}`}
      />
      <H>Tốt nhất: xử lý ở ViewModel hoặc domain layer</H>
      <Callout kind="rule">
        <UL
          items={[
            'UI layer tập trung render.',
            'Logic nghiệp vụ và xử lý dữ liệu lớn nên đặt ngoài Composable.',
            <>
              <T>remember</T> không biến phép tính nặng thành phép tính nhẹ; nó
              chỉ tránh chạy lại khi key không đổi.
            </>,
          ]}
        />
      </Callout>
    </>
  ),
}
