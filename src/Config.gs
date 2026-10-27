/**
 * CẤU HÌNH SỰ KIỆN — file DUY NHẤT cần sửa khi dùng app cho dự án khác.
 * Dữ liệu ban đầu (thành viên, công việc) chỉ được nạp khi chạy setup() lần đầu
 * trên một Google Sheet trống. Sau đó mọi thay đổi làm trực tiếp trên app/Sheet.
 */
const CONFIG = {
  id: 'spaceapps-hn-2026',                       // mã ngắn, không dấu, mỗi dự án một mã
  appTitle: 'BTC Space Apps Hà Nội 2026',
  subtitle: 'Ngày thi 14–15/11/2026 · THCS Trưng Vương + Zoom',
  eventDate: '2026-11-14',                       // ngày bắt đầu sự kiện (yyyy-mm-dd), dùng để đếm ngược
  timeZone: 'Asia/Ho_Chi_Minh',
  requireEvidence: true,                         // bắt buộc có minh chứng mới được đánh dấu Hoàn thành (trừ admin)

  bans: [
    'Ban Chỉ đạo',
    'Ban Chuyên môn',
    'Ban Thí sinh & Đội thi',
    'Ban Hậu cần – Địa điểm',
    'Ban Kỹ thuật – CNTT',
    'Ban Truyền thông',
    'Ban Đối ngoại',
    'Ban Vận động tài trợ',
    'Ban Tài chính',
    'Ban An ninh – Y tế',
    'Đội Tình nguyện viên'
  ],

  // [Họ tên, Ban (nhiều ban cách nhau dấu phẩy), Vai trò: 'admin' hoặc 'thành viên']
  seedMembers: [
  ['Vũ Quang Minh', 'Ban Chỉ đạo, Ban Vận động tài trợ, Ban Đối ngoại', 'admin'],
  ['Đào Thị Hồng Quyên', 'Ban Chỉ đạo, Ban Chuyên môn, Ban Thí sinh & Đội thi, Ban Truyền thông, Đội Tình nguyện viên', 'admin'],
  ['Hàn Huy Dũng', 'Ban Chuyên môn', 'thành viên'],
  ['Nguyễn Đức Long', 'Ban Đối ngoại', 'thành viên'],
  ['Đỗ Trần Đức', 'Ban Vận động tài trợ', 'thành viên'],
  ['Thảo Vân', 'Ban Truyền thông', 'thành viên']
  ],

  // [Ban, Công việc, Phụ trách, Hạn chót yyyy-mm-dd]
  seedTasks: [
  ['Ban Chỉ đạo', 'Ký Kế hoạch phối hợp HLE – SEPA', 'Vũ Quang Minh, Đào Thị Hồng Quyên', '2026-10-30'],
  ['Ban Chỉ đạo', 'Ban hành Quyết định thành lập BTC kèm danh sách thành viên các ban', 'Vũ Quang Minh, Đào Thị Hồng Quyên', '2026-10-30'],
  ['Ban Chỉ đạo', 'Chốt bộ nhận diện (thứ tự logo HLE – SEPA – NIC – nhà tài trợ, theo nhận diện Space Apps 2026)', 'Đào Thị Hồng Quyên', '2026-10-30'],
  ['Ban Chỉ đạo', 'Tổng duyệt chương trình 2 ngày thi', 'Vũ Quang Minh, Đào Thị Hồng Quyên', '2026-11-13'],
  ['Ban Chỉ đạo', 'Chung khảo và lễ trao giải', 'Vũ Quang Minh, Đào Thị Hồng Quyên', '2026-11-22'],
  ['Ban Chỉ đạo', 'Tổng kết, báo cáo NIC và nhà tài trợ', 'Vũ Quang Minh', '2026-12-05'],

  ['Ban Chuyên môn', 'Công bố thể lệ và giới thiệu 14 thử thách', 'Đào Thị Hồng Quyên', '2026-10-31'],
  ['Ban Chuyên môn', 'Lịch và nội dung workshop cho thí sinh', 'Hàn Huy Dũng', '2026-11-03'],
  ['Ban Chuyên môn', 'Chốt danh sách 10 mentor', 'Hàn Huy Dũng', '2026-11-06'],
  ['Ban Chuyên môn', 'Chốt danh sách ~65 giám khảo', 'Hàn Huy Dũng', '2026-11-06'],
  ['Ban Chuyên môn', 'Tiêu chí và quy chế chấm (sơ khảo, bán kết, chung khảo)', 'Hàn Huy Dũng', '2026-11-06'],
  ['Ban Chuyên môn', 'Tập huấn mentor và giám khảo', '', '2026-11-12'],
  ['Ban Chuyên môn', 'Chấm sơ khảo 13:30–17:00 ngày 15/11', '', '2026-11-15'],
  ['Ban Chuyên môn', 'Công bố 30 đội vào bán kết', '', '2026-11-16'],
  ['Ban Chuyên môn', 'Bán kết trực tuyến, chọn top 10', '', '2026-11-20'],

  ['Ban Thí sinh & Đội thi', 'Gửi thư thông tin số 1 tới các đội', 'Đào Thị Hồng Quyên', '2026-10-28'],
  ['Ban Thí sinh & Đội thi', 'Đóng đăng ký đội (hạn 08/11)', '', '2026-11-08'],
  ['Ban Thí sinh & Đội thi', 'Ghép đội, lập nhóm Zalo, giải đáp thí sinh', '', '2026-11-10'],
  ['Ban Thí sinh & Đội thi', 'Thu phiếu đồng ý phụ huynh (thí sinh dưới 18 tuổi)', '', '2026-11-12'],
  ['Ban Thí sinh & Đội thi', 'Gửi thông tin check-in, phân 600 trực tiếp / 400 trực tuyến', '', '2026-11-12'],
  ['Ban Thí sinh & Đội thi', 'Hỗ trợ các đội nộp bài (12:00 và 23:59 ngày 15/11)', '', '2026-11-15'],

  ['Ban Hậu cần – Địa điểm', 'Văn bản đồng ý sử dụng địa điểm THCS Trưng Vương', '', '2026-10-31'],
  ['Ban Hậu cần – Địa điểm', 'Sơ đồ khu thi, hội trường khai mạc, check-in, gửi xe, vệ sinh', '', '2026-11-09'],
  ['Ban Hậu cần – Địa điểm', 'Đặt suất ăn BTC, giám khảo, mentor, TNV và nước uống', '', '2026-11-10'],
  ['Ban Hậu cần – Địa điểm', 'Đặt chỗ bữa tối cảm ơn giám khảo, mentor (tối 14/11)', '', '2026-11-10'],
  ['Ban Hậu cần – Địa điểm', 'In 700 thẻ, dây đeo; 100 áo BTC, mentor, TNV', '', '2026-11-11'],

  ['Ban Kỹ thuật – CNTT', 'Khảo sát wifi, điện tại địa điểm', '', '2026-11-05'],
  ['Ban Kỹ thuật – CNTT', 'Gói Zoom 500 người, phòng chính và 14 breakout room', '', '2026-11-09'],
  ['Ban Kỹ thuật – CNTT', 'Phương án âm thanh, ánh sáng, LED và livestream', '', '2026-11-10'],
  ['Ban Kỹ thuật – CNTT', 'Kiểm tra kỹ thuật tại địa điểm và trên Zoom', '', '2026-11-12'],

  ['Ban Truyền thông', 'Bài công bố Cuộc thi', 'Đào Thị Hồng Quyên, Thảo Vân', '2026-10-28'],
  ['Ban Truyền thông', 'Truyền thông chặng đăng ký đến 08/11', 'Thảo Vân', '2026-11-08'],
  ['Ban Truyền thông', 'Ấn phẩm: backdrop, biển bảng, sổ tay thí sinh', '', '2026-11-09'],
  ['Ban Truyền thông', 'Kế hoạch quay chụp, livestream ngày thi', '', '2026-11-10'],

  ['Ban Đối ngoại', 'Chốt Local Collaborators', 'Nguyễn Đức Long', '2026-10-31'],
  ['Ban Đối ngoại', 'Công văn mời lãnh đạo NIC dự khai mạc và đề nghị đưa tin', 'Nguyễn Đức Long', '2026-11-02'],
  ['Ban Đối ngoại', 'Danh sách khách mời, đại biểu và gửi thư mời', 'Nguyễn Đức Long', '2026-11-06'],

  ['Ban Vận động tài trợ', 'Hồ sơ tài trợ và quyền lợi đồng hành', 'Đỗ Trần Đức', '2026-10-30'],
  ['Ban Vận động tài trợ', 'Vận động kinh phí bắt buộc 359,6 triệu (tiền và hiện vật)', 'Đỗ Trần Đức', '2026-11-06'],
  ['Ban Vận động tài trợ', 'Vận động tài trợ suất ăn và áo thí sinh (tùy chọn 114 triệu)', 'Đỗ Trần Đức', '2026-11-06'],

  ['Ban Tài chính', 'Cập nhật dự toán theo báo giá', '', '2026-11-03'],
  ['Ban Tài chính', 'Hợp đồng với nhà cung cấp', '', '2026-11-09'],
  ['Ban Tài chính', 'Thanh quyết toán, báo cáo thu – chi', '', '2026-12-05'],

  ['Ban An ninh – Y tế', 'Phương án PCCC và sơ tán', '', '2026-11-09'],
  ['Ban An ninh – Y tế', 'Phương án giám sát thí sinh nhỏ tuổi', '', '2026-11-10'],
  ['Ban An ninh – Y tế', 'Thông báo Công an phường sở tại', '', '2026-11-10'],
  ['Ban An ninh – Y tế', 'Bố trí y tế, mua bảo hiểm ~700 người', '', '2026-11-12'],

  ['Đội Tình nguyện viên', 'Tuyển 50 TNV (40 tại chỗ, 10 trực tuyến)', 'Đào Thị Hồng Quyên', '2026-11-06'],
  ['Đội Tình nguyện viên', 'Tập huấn TNV', '', '2026-11-12'],
  ['Đội Tình nguyện viên', 'Phân ca trực 14–15/11 (check-in, khu vực, phòng Zoom)', '', '2026-11-12']
  ]
};
