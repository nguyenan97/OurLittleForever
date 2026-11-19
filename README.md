# Bình An & Thanh Tuyền - Những ngày có nhau

Website kỷ niệm bằng tiếng Việt, Angular 21 + TypeScript + Three.js. Chạy với Node.js 20.19 trở lên trong nhánh 20, 22.12 trở lên trong nhánh 22, hoặc Node.js 24+.

## Chạy local

```powershell
npm install
npm start
```

- Trang chính: `http://localhost:4200/`
- Trang chúc mừng ngày Nhà giáo Việt Nam: `http://localhost:4200/20-11`

Trang 20/11 luôn truy cập được để xem trước và lưu lại, không tự ẩn khi qua ngày. Monogram hiển thị A & T; tên đầy đủ là Bình An và Thanh Tuyền.

## Nội dung

Chỉnh ngày tháng và lời thư trong `src/app/content.ts`. Hai bức thư hiện là nội dung nháp để Bình An duyệt trước khi gửi.

- 28/10/2026: ngày đầu quen nhau.
- 31/10/2026: buổi hẹn đầu tiên tại nhà Thanh Tuyền.
- 14/11/2026: Bình An tỏ tình và trở thành bạn trai của Thanh Tuyền; bộ đếm tính từ ngày này.
- 20/11/2026: trang chúc mừng riêng cho Thanh Tuyền.

Bộ đếm tính số ngày đã trôi qua, dùng ngày lịch tại Việt Nam. Nội dung trên website công khai với người truy cập. `noindex` chỉ đề nghị search engine không lập chỉ mục, không phải access control.

## Thêm ảnh

Copy ảnh vào `local-media/photos/selected/`, sau đó chạy:

```powershell
npm run media
```

Lệnh tạo bản WebP tối đa 1600×2000px, thumbnail tối đa 640×800px, tự sửa orientation theo EXIF và bỏ metadata trên bản xuất. Không crop hay ghi đè ảnh gốc; ảnh dọc/ngang giữ aspect ratio. Album dùng crop bằng CSS, lightbox hiển thị ảnh đầy đủ. File xuất ở `public/media/photos/`, danh sách ở `public/media/manifest.json`.

Cũng có thể copy ảnh trực tiếp vào `public/media/photos/` rồi chạy lại lệnh. Các file copy trực tiếp được giữ nguyên; tự xử lý size và metadata nếu chọn cách này. Album hiện trạng thái chờ khi chưa có ảnh.

Caption tùy chọn nằm trong file local `local-media/content/photos.json`, dùng đúng tên file nguồn làm key:

```json
{
  "buoi-hen-dau.jpg": {
    "caption": "Buổi hẹn đầu tiên · 31.10.2026",
    "alt": "Bình An và Thanh Tuyền trong buổi hẹn đầu tiên"
  }
}
```

Ảnh trong `selected/` xử lý theo thứ tự tên file; có thể thêm tiền tố `01-`, `02-`. Lệnh media tự chạy trước `npm start` và `npm run build`. Khi server đang chạy và vừa thêm ảnh mới, chạy `npm run media` rồi reload trang.

`local-media/` và `public/media/` được Git ignore. Git không lưu ảnh hoặc bản nháp cá nhân. Source hiện có tên và các mốc công khai được người dùng cung cấp.

## Build và hosting

```powershell
npm run build
```

Static output: `dist/our-little-forever/browser/`. Deploy toàn bộ thư mục output, bao gồm `media/`. Không cần .NET API, SQL Server hoặc secret.

Mỗi route có file `index.html` riêng để hosting static trả HTTP 200 khi mở trực tiếp hoặc reload, bao gồm `/20-11/`, `/chuyen-minh/`, `/khoanh-khac/`, `/loi-thuong/`. Navigation không dùng hash hoặc URL fragment. Cũng có SPA fallback cho Azure Static Web Apps (`staticwebapp.config.json`) và các host hỗ trợ `_redirects`.

## GitHub Pages

Repository: `nguyenan97/OurLittleForever`.

```powershell
npm run build:pages
npm run preview:pages
```

Preview đúng project base tại `http://127.0.0.1:4200/OurLittleForever/`. Public URL dự kiến: `https://nguyenan97.github.io/OurLittleForever/`, trang quà: `https://nguyenan97.github.io/OurLittleForever/20-11/`.

Workflow `.github/workflows/pages.yml` build và deploy khi push vào `main`, hoặc chạy thủ công. Repository Pages dùng nguồn GitHub Actions. Tệp build và media được upload dưới dạng deployment artifact; source không commit thư mục local hoặc public/media.

CI không nhận được ảnh ở máy local. Khi bổ sung ảnh cá nhân, cần đưa bản public vào build environment qua một bước upload riêng trước khi deploy; hiện chưa có ảnh cá nhân và CI tạo album rỗng. Không bỏ Git ignore hoặc commit originals để khắc phục điều này.

## iPhone

Target iOS Safari 16.4 trở lên, tương ứng browser baseline của Angular đang dùng. Có safe-area padding, zoom không bị khóa, touch target tối thiểu 44px cho nút đóng, swipe ảnh phân biệt với cuộn dọc và khóa cuộn nền khi mở modal. WebKit emulation được dùng để kiểm tra; không thay thế kiểm thử trên iPhone vật lý.

Website dùng Google Fonts, có system font fallback. Không bật nhạc tự động; bản đầu chưa có audio vì chưa có file được chọn. Scene 3D lazy-load, có nút dừng, hỗ trợ reduced motion và nền tĩnh nếu WebGL không khả dụng.
