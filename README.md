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

`npm run media` đọc danh sách chọn, xuất AVIF và WebP ở 480, 960, 1600px. Ảnh thư có bản lớn tối đa 2200px để đọc. Sửa orientation theo EXIF, crop theo vùng được chọn, tăng sáng/màu/độ nét nhẹ và bỏ metadata ở bản xuất. Chân dung đã chỉnh màu sẵn dùng mức hiệu chỉnh thấp hơn. Không sửa khuôn mặt hoặc ghi đè file gốc. Browser dùng `picture`, `srcset`, `sizes` và lazy loading.

`crop` trong config là `[left, top, width, height]`, tỷ lệ 0-1 theo ảnh sau khi sửa orientation. Khi thay file gốc, kiểm tra lại crop. Các ảnh thư được crop đủ cả lời mở đầu và chữ ký, không tạo lại chữ viết tay.

Hai video xuất H.264/yuv420p, giữ audio gốc dưới dạng AAC nếu có, có faststart và poster WebP. Cần `ffmpeg` và `ffprobe` trong PATH khi xử lý media local. `video.mp4` gốc không có audio track nên photobooth được ghi “Không tiếng”. Script cũng tạo nền piano gốc dài 41 giây thành MP3 96 kbps.

Khi chưa có config local, script không thay thế manifest đã có. CI khôi phục media công khai từ deployment bundle, không cần ảnh gốc.

## Publish ảnh mà không commit

```powershell
npm run publish:media
```

Lệnh đóng gói ảnh/video được chọn và nền piano vào `media.tar.gz`, upload vào prerelease `website-media` của repo qua GitHub CLI. Không upload originals, contact sheets hoặc các ảnh không được chọn. Đây là asset công khai dùng cho website công khai.

Sau khi sửa source, commit/push `main`; workflow lấy media bundle rồi build và deploy Pages. Nếu chỉ đổi ảnh/caption trong config local, publish media trước, sau đó chạy workflow `Deploy GitHub Pages` bằng GitHub Actions hoặc `gh workflow run pages.yml`.

`local-media/`, `public/media/`, output và node_modules được Git ignore. Không dùng `git add -f` cho media.

## Nội dung và motion

- Nội dung: `src/app/content.ts`. 28/10 gặp nhau, 31/10 buổi hẹn ở nhà em, 07/11 buổi hẹn riêng, 14/11 chính thức yêu nhau.
- Bốn lá thư gốc có bản chép từ ảnh, giữ cách dùng từ và người gửi. Thư em gửi anh ngày 07/11 được ghi riêng. Thư 20/11 viết mới theo giọng của anh, ký Bình An, không kể chuyện tặng hoa hôm ấy.
- Trái tim Three.js có khối beveled, hạt sáng và quỹ đạo. Three.js tải khi gần viewport, dispose khi đổi trang. Vòng ảnh CSS 3D xoay liên tục, photobooth xếp lớp, Polaroid nổi nhẹ, cánh hoa và trái tim trôi. Không có motion toggle.
- Reduced motion làm chuyển động dịu hơn; tab ẩn/canvas ngoài viewport không render WebGL để giảm tải máy.
- iPhone Safari 16.4+ là browser target. Có safe areas, vùng chạm ổn định, modal scroll lock, ảnh responsive và swipe lightbox.
- Piano mặc định tắt mỗi lần mở web; chỉ gán audio source và phát sau khi chạm Bật nhạc. Video playsinline, preload none, có native controls và phát tiếng gốc khi chạm xem. Piano và video tự dừng lẫn nhau để tránh chồng âm thanh.
- Thanh điều hướng mobile dùng real paths, có reading progress và nút về đầu trang.

Research tham khảo: [Codrops 3D Carousel](https://tympanus.net/Development/3DCarousel/), [Three.js InstancedMesh và draw calls](https://threejs.org/docs/pages/InstancedMesh.html), [WebKit inline video và user gesture](https://webkit.org/blog/6784/new-video-policies-for-ios/), [web.dev video performance](https://web.dev/learn/performance/video-performance). Dùng một point cloud và một mesh cho trái tim, không tạo mesh riêng cho từng hạt. Hiệu ứng triển khai bằng CSS/Three.js; giữ native media controls cho iPhone.
