# A & T - Những ngày có nhau

Website kỷ niệm bằng tiếng Việt. Angular 21, TypeScript, Three.js và CSS 3D. Lời kể dùng anh - em; giữ nguyên ảnh thư viết tay. Không có bộ đếm ngày hoặc nút bật/tắt chuyển động.

## Chạy local

```powershell
npm install
npm start
```

Node.js 20.19+ trong nhánh 20, 22.12+ trong nhánh 22, hoặc Node.js 24+. CI pin npm 11.21.3.

## GitHub Pages

- Trang chủ: https://nguyenan97.github.io/OurLittleForever/
- Quà 20/11: https://nguyenan97.github.io/OurLittleForever/20-11/
- Route khác: `/chuyen-minh/`, `/khoanh-khac/`, `/loi-thuong/`.

Tất cả dùng real path, có file HTML riêng, mở trực tiếp và reload được. Giữ base URL `/OurLittleForever/`.

```powershell
npm run build:pages
npm run preview:pages
```

Preview build tại `http://127.0.0.1:4200/OurLittleForever/`. Output ở `dist/our-little-forever/browser/`.

## Ảnh local và tối ưu

- Ảnh gốc: `local-media/photos/originals/`.
- Danh sách chọn và caption: `local-media/content/curation.json`.
- Ảnh xuất và manifest: `public/media/`.

`npm run media` đọc danh sách chọn, xuất AVIF và WebP ở 480, 960, 1600px. Ảnh thư có bản lớn tối đa 2200px để đọc. Tự sửa orientation theo EXIF, giữ aspect ratio và bỏ metadata ở bản xuất. Không ghi đè hoặc retouch file gốc. Browser dùng `picture`, `srcset`, `sizes` và lazy loading để chọn bản phù hợp.

Khi chưa có config local, script không thay thế manifest đã có. CI khôi phục media công khai từ deployment bundle, không cần ảnh gốc.

## Publish ảnh mà không commit

```powershell
npm run publish:media
```

Lệnh đóng gói đúng những ảnh xuất có trong manifest vào `media.tar.gz`, upload vào prerelease `website-media` của repo qua GitHub CLI. Không upload originals, contact sheets hoặc các ảnh không được chọn. Đây là asset công khai dùng cho website công khai.

Sau khi sửa source, commit/push `main`; workflow lấy media bundle rồi build và deploy Pages. Nếu chỉ đổi ảnh/caption trong config local, publish media trước, sau đó chạy workflow `Deploy GitHub Pages` bằng GitHub Actions hoặc `gh workflow run pages.yml`.

`local-media/`, `public/media/`, output và node_modules được Git ignore. Không dùng `git add -f` cho media.

## Nội dung và motion

- Nội dung: `src/app/content.ts`. 28/10 gặp nhau, 31/10 buổi hẹn ở nhà em, 07/11 buổi hẹn riêng, 14/11 chính thức yêu nhau.
- Thư 31/10 và 14/11 có bản biên tập cạnh ảnh gốc. Thư 07/11 giữ giọng văn gốc. Nội dung 20/11 ngắn và dùng anh - em.
- Vòng ảnh CSS 3D xoay liên tục; chân dung có slow zoom, Polaroid nổi nhẹ, cánh hoa và ánh sáng chuyển động. Không có motion toggle.
- Reduced motion làm chuyển động dịu hơn; tab ẩn/canvas ngoài viewport không render WebGL để giảm tải máy.
- iPhone Safari 16.4+ là browser target. Có safe areas, vùng chạm ổn định, modal scroll lock, ảnh responsive và swipe lightbox.
- Không có audio được chọn nên website không phát nhạc.

Research tham khảo: [Codrops 3D Carousel](https://tympanus.net/Development/3DCarousel/), [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [web.dev Responsive images](https://web.dev/learn/design/responsive-images). Hiệu ứng được triển khai riêng bằng CSS và Three.js.
