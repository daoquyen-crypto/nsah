# App theo dõi tiến độ BTC

Ứng dụng web nhẹ chạy trên **Google Sheet + Google Apps Script**. Ban Tổ chức (BTC) một sự kiện dùng app để phân công, cập nhật và kiểm tra tiến độ công việc từ xa, trên cả điện thoại lẫn máy tính.

- **Đăng nhập** bằng mã truy cập, số điện thoại, email hoặc link riêng. Không cần tài khoản Google.
- **Dữ liệu** nằm trong một Google Sheet của BTC, xem và sửa trực tiếp được.
- **Cập nhật app** chỉ cần nhắn Claude. GitHub tự đẩy code lên Apps Script và **link app giữ nguyên**.

| | |
|---|---|
| **Dự án đầu tiên** | NASA Space Apps Challenge Hà Nội 2026 (14–15/11/2026, THCS Trưng Vương + Zoom) |
| **Đơn vị** | Hồng Lĩnh Education (HLE) – Liên minh Thúc đẩy Giáo dục STEM (SEPA) |
| **Link app** | https://script.google.com/macros/s/AKfycbyFpJ4CqVHuaOGIIKRSOXpB5N7fiBXAQyBzvfwh7I4MhE4GfCgyPSBE_U2YqJW-eEeC/exec |
| **Google Sheet** | "NASA Hanoi Project" (folder dự án trên Drive) |
| **Apps Script** | "NASA Space App Hanoi 26" – Script ID `16hEive8zFDGUK5mxXYUD5_-CC6LEZiU3YrIvuJVf_UnKqRYBUEGbeqiq` |
| **Kho code** | `daoquyen-crypto/nsah` (GitHub) |

---

## 1. Tính năng

| Tính năng | Mô tả |
|---|---|
| **Dashboard** | Dành cho admin và thành viên chủ chốt. Hiện tiến độ chung, số việc đã xong / quá hạn / đến hạn ≤ 3 ngày, biểu đồ *kế hoạch so với thực tế*, điểm nóng, 7 ngày tới, tiến độ theo ban và khối lượng việc theo người. |
| **Tổng quan** | Các chỉ số chính, danh sách "Cần chú ý ngay" và thẻ tiến độ từng ban. |
| **Công việc** | Danh sách chia nhóm Quá hạn / ≤ 3 ngày / Sắp tới / Chưa có hạn / Đã xong. Lọc theo ban, trạng thái, "việc của tôi"; tìm kiếm; thêm, sửa, xoá. |
| **Minh chứng** | Đính kèm ảnh (chụp trực tiếp), file (PDF, Word, Excel…, tối đa 10 MB) hoặc link. Thành viên **bắt buộc** có minh chứng mới đánh dấu Hoàn thành được. File lưu riêng tư trên Drive và chỉ xem qua app. |
| **Email nhắc việc** | Gửi ngay khi được giao việc; gửi lúc 7:00 mỗi sáng cho người có việc quá hạn, sắp đến hạn hoặc bị vướng; lãnh đạo nhận thêm bản tóm tắt; có nút "Nhắc qua email" trong từng việc. |
| **Nhật ký** | Ghi lại mọi thay đổi: ai làm, lúc nào, đổi gì. |
| **Chống ghi đè** | Hai người sửa cùng một việc thì người lưu sau được báo để tải lại. |
| **Link đăng nhập riêng** | Mỗi người có link `…/exec?k=MÃ`, bấm là vào thẳng app. Ghim được lên màn hình điện thoại. |

## 2. Vai trò và quyền

Vai trò ghi ở **cột D trang `ThanhVien`**.

| Vai trò | Xem | Sửa | Khác |
|---|---|---|---|
| `admin` (Trưởng / Phó BTC) | Mọi thứ, có Dashboard | Mọi việc; xoá việc; thêm việc cho mọi ban | Đánh dấu Hoàn thành không bắt buộc minh chứng; nhận email tóm tắt; gửi nhắc việc |
| `chủ chốt` | Mọi thứ, có Dashboard | Việc của ban mình hoặc việc ghi tên mình | Nhận email tóm tắt; gửi nhắc việc |
| `thành viên` | Mọi công việc (chỉ xem nếu không thuộc ban mình) | Việc của ban mình hoặc việc ghi tên mình | — |

Hiện tại: **Vũ Quang Minh** và **Đào Thị Hồng Quyên** là `admin`. Muốn ai xem Dashboard thì ghi `chủ chốt`, ví dụ anh Long, TS. Dũng, anh Đức.

## 3. Hướng dẫn sử dụng

### Thành viên BTC
1. Mở **link đăng nhập riêng** (BTC gửi qua Zalo), hoặc mở link app rồi nhập mã / SĐT / email.
2. Ghim lên màn hình điện thoại:
   - **iPhone (Safari):** Chia sẻ → *Thêm vào MH chính*.
   - **Android (Chrome):** ⋮ → *Thêm vào màn hình chính*.
3. Tab **Công việc** → bật **"Việc của tôi / ban tôi"** → bấm vào việc để cập nhật **trạng thái, % tiến độ, ghi chú vướng mắc**.
4. Khi xong việc: **📷 Chụp ảnh / chọn file** hoặc **🔗 Dán link** minh chứng → chọn **Hoàn thành** → **Lưu**.

### Trưởng BTC / thành viên chủ chốt
- Mở **Dashboard**:
  - Ô **Quá hạn** và **Đến hạn ≤ 3 ngày** bấm vào là ra danh sách việc tương ứng.
  - **Điểm nóng** là các việc cần hỏi trong buổi họp.
  - Đường xanh nằm dưới đường nét đứt nghĩa là BTC đang chậm so với kế hoạch.
- **Buổi họp BTC (20:00 thứ Ba và thứ Sáu):** các ban cập nhật trước giờ họp; khi họp, chia sẻ màn hình Dashboard.
- Mở một việc → **📧 Nhắc qua email** để nhắc người phụ trách.
- Tab **Nhật ký**: ban nào lâu không có cập nhật thì cần nhắc.

### Quản lý thành viên (trang `ThanhVien`)
| Cột | Nội dung |
|---|---|
| A – Mã truy cập | 6 ký tự, tự tạo |
| B – Họ tên | **Phải ghi giống hệt** tên ở cột *Phụ trách* của công việc, để gửi email và lọc "việc của tôi" |
| C – Ban | Đúng tên ban trong app; nhiều ban thì cách nhau dấu phẩy |
| D – Vai trò | `admin` / `chủ chốt` / `thành viên` |
| E – Điện thoại | Để đăng nhập bằng SĐT |
| F – Email | Để nhận email nhắc việc và đăng nhập bằng email |
| G – Link đăng nhập riêng | Tự tạo; gửi **riêng** cho từng người, không gửi vào nhóm chung |

Thêm người mới xong thì chạy menu **⚙️ App BTC → 2**. Thêm hoặc sửa SĐT, email thì có hiệu lực ngay.

### Menu "⚙️ App BTC" trong Google Sheet
| Mục | Khi nào dùng |
|---|---|
| 1. Khởi tạo dữ liệu | Một lần, trên Sheet trống (đã chạy) |
| 2. Tạo mã và link đăng nhập riêng | Mỗi khi thêm thành viên mới |
| 3. Cấp quyền lưu minh chứng | Một lần (cấp quyền Google Drive) |
| 4. Bật nhắc việc qua email | Một lần (cấp quyền gửi email và hẹn giờ 7:00) |
| 5. Tắt nhắc việc hằng ngày | Khi muốn dừng email buổi sáng |

### Các ban hiện có
Ban Chỉ đạo · Ban Nhân sự (HR) · Ban Chuyên môn · Ban Thí sinh & Đội thi · Ban Hậu cần – Địa điểm · Ban Kỹ thuật – CNTT · Ban Truyền thông · Ban Đối ngoại · Ban Vận động tài trợ · Ban Tài chính · Ban An ninh – Y tế · Đội Tình nguyện viên

> Theo bản kế hoạch mới, An ninh – Y tế đã gộp vào Ban Hậu cần – Địa điểm. App chưa cập nhật điểm này.

## 4. Dữ liệu trong Google Sheet

| Sheet | Cột |
|---|---|
| `ThanhVien` | Mã · Họ tên · Ban · Vai trò · Điện thoại · Email · Link đăng nhập riêng |
| `CongViec` | ID · Ban · Công việc · Phụ trách · Hạn chót (yyyy-mm-dd) · Trạng thái · Tiến độ (%) · Ghi chú · Cập nhật bởi · Cập nhật lúc · Minh chứng |
| `NhatKy` | Thời gian · Người cập nhật · ID · Công việc · Thay đổi |

- **Trạng thái:** Chưa bắt đầu · Đang làm · Bị vướng · Hoàn thành.
- **File minh chứng:** nằm trong thư mục Drive *"Minh chứng – BTC Space Apps Hà Nội 2026"*, cùng folder với Sheet.
- **Sửa trực tiếp trên Sheet:** được, nhưng hạn chót ghi dạng `2026-11-08` và không đổi thứ tự cột.

## 5. Cấu trúc code

```
src/
  Config.gs        ← THÔNG TIN RIÊNG CỦA SỰ KIỆN: tên, ngày, link app, các ban,
                     thành viên & công việc ban đầu, nhắc email, bắt buộc minh chứng
  Code.gs          ← máy chủ dùng chung: đăng nhập, đọc/ghi Sheet, phân quyền,
                     nhật ký, minh chứng, email, đồng bộ việc mới
  Index.html       ← giao diện (Dashboard, Tổng quan, Công việc, Nhật ký)
  appsscript.json  ← múi giờ, quyền truy cập web app
tests/simulate.js  ← chạy thử toàn bộ luồng trên Sheet giả lập (node tests/simulate.js)
.github/workflows/deploy.yml  ← tự đẩy code lên Apps Script và cập nhật bản triển khai
.clasp.json        ← Script ID
CLAUDE.md          ← ghi chú cho Claude khi sửa app
```

**Tuỳ chỉnh nhanh trong `src/Config.gs`:**
- `requireEvidence`: `true` / `false`. Bắt buộc minh chứng khi Hoàn thành.
- `reminders.hour`: giờ gửi email buổi sáng. Sau khi đổi, chạy lại menu **4**.
- `reminders.enabled / assignNotice / daily / leadsSummary`: bật / tắt từng loại email.
- `seedTasks`: **thêm dòng mới** thì việc tự xuất hiện trên app ở lần mở kế tiếp (chỉ một lần). Sửa hoặc xoá dòng cũ **không** ảnh hưởng việc đang có.

## 6. Cập nhật app

**Cách thường dùng:** nhắn Claude (trên máy tính hoặc điện thoại), ví dụ *"thêm việc X cho Ban Y, hạn 05/11"* hoặc *"đổi giờ nhắc email sang 8h"*. Claude sửa code trong kho → GitHub Actions tự đẩy lên Apps Script → app lên phiên bản mới sau khoảng 1 phút, **link giữ nguyên**.

**Khi bản cập nhật cần quyền Google mới** (ví dụ Drive, Gmail, Lịch): sau khi cập nhật, chủ Sheet phải chạy mục menu tương ứng để cấp quyền **ngay**, nếu không app có thể báo lỗi.

**Kiểm tra cập nhật đã chạy:** kho GitHub → tab **Actions** → lần chạy mới nhất có dấu ✓ xanh.

## 7. Cài cho dự án mới

1. **Tạo kho mới từ mẫu:** trên GitHub, kho này bật *Template repository* (Settings → General). Bấm **Use this template** → tạo kho mới, để **Private**.
2. **Tạo Google Sheet mới** → Tiện ích mở rộng → Apps Script → *Cài đặt dự án* → copy **Script ID** → ghi vào `.clasp.json`.
3. **Cấp quyền cho GitHub:**
   - Trên máy tính có Node.js ≥ 22: `npm install -g @google/clasp@3` → `clasp login`, đăng nhập đúng tài khoản sở hữu Sheet.
   - Bật Apps Script API tại https://script.google.com/home/usersettings.
   - Mở `%USERPROFILE%\.clasprc.json` (Windows) hoặc `~/.clasprc.json` (Mac) → copy nội dung → GitHub **Settings → Secrets and variables → Actions** → Secret `CLASPRC_JSON`.
4. **Sửa `src/Config.gs`:** gửi Claude kế hoạch của dự án mới để Claude tạo danh sách ban và công việc.
5. **Đẩy code lần đầu:** tab **Actions** → *Đẩy code lên Apps Script* → **Run workflow**.
6. **Khởi tạo trong Sheet:** menu **⚙️ App BTC → 1**, rồi chạy **3** và **4**.
7. **Triển khai web app:** Apps Script → **Deploy → New deployment → Web app** (*Execute as:* Me, *Who has access:* Anyone) → copy link app và **Deployment ID**.
8. **Ghi thông tin triển khai:** Deployment ID ghi vào `.github/workflows/deploy.yml`, link app ghi vào `appUrl` trong `Config.gs`.
9. **Phát link cho thành viên:** thêm thành viên vào trang `ThanhVien` → menu **2** → gửi link riêng.

> **Bảo mật:** nội dung `.clasprc.json` là chìa khoá vào tài khoản Google. Chỉ dán vào GitHub Secrets, **không** dán vào chat, email hay file trong kho. Kho code nên để **Private**.

## 8. Xử lý sự cố

| Hiện tượng | Cách xử lý |
|---|---|
| Mở link từ Zalo bị trang trắng | Bấm **⋯ → Mở bằng trình duyệt** (Chrome / Safari) |
| "Không thể mở tệp" / lỗi Google Drive | Điện thoại đăng nhập nhiều tài khoản Google → mở link trong tab ẩn danh |
| "Không tìm thấy thành viên" | Kiểm tra mã, SĐT, email ở trang `ThanhVien` |
| App báo cần cấp quyền / lỗi sau khi cập nhật | Chủ Sheet chạy lại menu **3** và **4** |
| Không nhận được email | Kiểm tra cột F (email) và tên ở cột *Phụ trách* khớp cột *Họ tên*; xem thư mục Spam; Gmail thường gửi tối đa khoảng 100 email/ngày |
| "Công việc vừa được … cập nhật" | Người khác vừa sửa → tải lại trang rồi sửa tiếp |
| Lộ link đăng nhập riêng của ai đó | Đổi mã ở cột A của người đó → chạy menu **2** |
| Cập nhật app không lên | GitHub → tab **Actions** → xem lần chạy lỗi; nếu lỗi đăng nhập thì làm lại bước 3 mục 7 và cập nhật Secret `CLASPRC_JSON` |

## 9. Lịch sử phiên bản

| Phiên bản | Ngày | Nội dung |
|---|---|---|
| 1 | 27/10/2026 | App tiến độ: đăng nhập mã / SĐT / email, Tổng quan, Công việc, Nhật ký; 50 việc theo Kế hoạch phối hợp |
| 2 | 27/10/2026 | Tự triển khai từ GitHub, giữ nguyên link app |
| 3 | 27/10/2026 | Dashboard cho thành viên chủ chốt |
| 4 | 27/10/2026 | Minh chứng hoàn thành (ảnh / file / link), bắt buộc khi Hoàn thành |
| 5 | 27/10/2026 | Ban Nhân sự (HR) + việc head hunt nhân sự BTC; tự bổ sung việc mới từ cấu hình |
| 6 | 27/10/2026 | Dashboard gọn lại còn 3 hàng |
| 7 | 27/10/2026 | Link đăng nhập riêng cho từng thành viên |
| 8 | 27/10/2026 | Email nhắc việc (giao việc, 7:00 hằng ngày, nút nhắc); sửa lỗi lưu công việc của bản 4–7 |
