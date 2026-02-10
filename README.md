# UX-UI Prototype

## Open nhanh
- Mở trực tiếp file: `/Users/phucnguyen/Downloads/Codex/Khoá học /web/index.html`

## Chạy local server (khuyến nghị)
```bash
cd "/Users/phucnguyen/Downloads/Codex/Khoá học /web"
python3 -m http.server 8080
```
Sau đó truy cập: `http://localhost:8080`

## Scope bản này
- Đã nâng cấp thành bản học thử trực tiếp trên web.
- Đã đổ đầy đủ nội dung khóa học 12 tuần.

## Nâng cấp UX-UI v3
- Progress bar theo vị trí cuộn trang.
- Navigation hỗ trợ cả desktop và mobile menu toggle.
- Bottom tab cố định cho mobile để điều hướng nhanh theo section học.
- Nội dung tuần học hiển thị dạng accordion để đọc dài trên điện thoại dễ hơn.

## Mobile readiness
- Nút và link có tap target >= 44px.
- Menu mobile full-width, dễ thao tác một tay.
- Đóng menu khi chạm ra ngoài.
- Tránh tràn ngang; hình ảnh co giãn đúng tỉ lệ.
- Roadmap cuộn ngang có snap trên màn hình nhỏ.
- Bottom tab tự highlight section đang đọc.
