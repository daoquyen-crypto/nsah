# App theo dõi tiến độ BTC

Ứng dụng web nhỏ (Google Sheet + Apps Script) để Ban Tổ chức sự kiện theo dõi tiến độ công việc.
Thành viên đăng nhập bằng **mã truy cập / số điện thoại / email**, không cần tài khoản Google.

Dự án đầu tiên: **NASA Space Apps Challenge Hà Nội 2026**.

## Cấu trúc

```
src/
  Config.gs        ← THÔNG TIN RIÊNG CỦA SỰ KIỆN (tên, ngày, các ban, thành viên & công việc ban đầu)
  Code.gs          ← phần máy chủ dùng chung (đăng nhập, đọc/ghi Sheet, phân quyền, nhật ký)
  Index.html       ← giao diện
  appsscript.json  ← cấu hình Apps Script (múi giờ, quyền truy cập web app)
.github/workflows/deploy.yml  ← tự đẩy code lên Apps Script khi có thay đổi trong src/
```

## Dữ liệu (trong Google Sheet)

| Sheet | Nội dung |
| --- | --- |
| ThanhVien | Mã truy cập · Họ tên · Ban · Vai trò (admin/thành viên) · Điện thoại · Email |
| CongViec | ID · Ban · Công việc · Phụ trách · Hạn chót · Trạng thái · Tiến độ · Ghi chú · Cập nhật bởi/lúc |
| NhatKy | Lịch sử mọi thay đổi |

Phân quyền: admin sửa/xoá mọi việc; thành viên sửa việc của ban mình hoặc việc ghi tên mình ở cột Phụ trách.

## Cài lần đầu cho một dự án

1. Tạo Google Sheet mới → Tiện ích mở rộng → Apps Script. Ghi lại **Script ID** (Cài đặt dự án).
2. Trên máy tính đã cài Node.js ≥ 22: `npm install -g @google/clasp@3` rồi `clasp login`
   (đăng nhập đúng tài khoản Google sở hữu Sheet). Bật Apps Script API tại
   https://script.google.com/home/usersettings
3. Mở file `.clasprc.json` trong thư mục người dùng (Windows: `C:\Users\<tên>\.clasprc.json`,
   Mac: `~/.clasprc.json`), copy toàn bộ nội dung.
4. Trên GitHub: Settings → Secrets and variables → Actions → **New repository secret**:
   - `CLASPRC_JSON` = nội dung file ở bước 3
   - `SCRIPT_ID` = Script ID ở bước 1
5. Tab **Actions** → "Đẩy code lên Apps Script" → **Run workflow**. Code sẽ được đẩy lên Apps Script.
6. Trong Apps Script: chọn hàm `setup` → Chạy (cấp quyền). Sau đó Triển khai → Tùy chọn triển khai mới →
   Ứng dụng web (Thực thi: Tôi; Truy cập: Bất kỳ ai). Copy link app.
7. Triển khai → Quản lý các lần triển khai → copy **Deployment ID**, thêm Secret `DEPLOYMENT_ID`.
   Từ giờ mỗi thay đổi trong `src/` sẽ tự cập nhật app, **link giữ nguyên**.

> Không bao giờ dán nội dung `.clasprc.json` vào chat, email hay file trong kho — chỉ để trong GitHub Secrets.

## Dùng cho dự án khác

1. Kho này bật **Template repository** (Settings → General). Với dự án mới: **Use this template** → tạo kho mới (Private).
2. Sửa `src/Config.gs` (hoặc nhờ Claude sửa theo kế hoạch của dự án mới).
3. Làm lại các bước "Cài lần đầu" với Google Sheet mới của dự án đó.
