# Ghi chú cho Claude

- Đây là app Google Apps Script (V8) theo dõi tiến độ BTC. Người dùng là ban tổ chức sự kiện, không phải lập trình viên: trả lời bằng tiếng Việt, ngắn gọn, không giải thích kỹ thuật trừ khi được hỏi.
- Chỉ sửa trong `src/`. Mọi thông tin riêng của sự kiện nằm trong `src/Config.gs`; `Code.gs` và `Index.html` dùng chung cho mọi dự án.
- Đẩy lên nhánh `main` là GitHub Actions tự `clasp push` và cập nhật bản triển khai (link app giữ nguyên). Không cần và không được yêu cầu người dùng gửi thông tin đăng nhập Google.
- Apps Script nạp các file theo thứ tự không đảm bảo: không tham chiếu `CONFIG` ở cấp ngoài cùng của `Code.gs`, chỉ dùng bên trong hàm.
- `Index.html` là HtmlService template (`<?= ?>`); tránh viết chuỗi `<?` trong CSS/JS.
- Dữ liệu ban đầu trong `Config.gs` chỉ nạp khi chạy `setup()` trên Sheet trống; sửa `seedTasks` không ảnh hưởng dữ liệu đang dùng. Muốn thêm/sửa công việc đang chạy thì làm trên app hoặc Sheet.
- Thay đổi cấu trúc cột Sheet phải tương thích ngược với dữ liệu đang có.
- Trước khi commit: `cat src/Config.gs src/Code.gs > /tmp/a.js && node --check /tmp/a.js`, và kiểm tra cú pháp phần `<script>` của Index.html.
- Không dùng tên thương hiệu VEX trong nội dung hay thiết kế.
