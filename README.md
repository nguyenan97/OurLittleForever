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

`npm run media` đọc danh sách chọn, xuất AVIF và WebP ở 480, 960, 1600px. Ảnh thư có bản lớn tối đa 2200px để đọc. Sửa orientation theo EXIF, crop theo vùng được chọn và bỏ metadata ở bản xuất. Bộ chân dung dùng 10 ảnh được chọn trong `Photoshop NPHH`, giữ màu Photoshop. Ảnh có `edited: true` không bị chỉnh màu thêm. Browser dùng `picture`, `srcset`, `sizes` và lazy loading.

`npm run media:develop` dùng `melt.exe` của Kdenlive để chỉnh màu riêng từng ảnh kỷ niệm. Cài Kdenlive bằng `winget install --id KDE.Kdenlive --exact`; có thể chỉ định executable qua `KDENLIVE_MELT`. Script xuất project MLT vào `local-media/kdenlive/` và ảnh PNG đã chỉnh vào `local-media/photos/developed/`, sau đó cập nhật trường `developed` trong curation. Giữ exposure trung tính ở ảnh có người, không làm trắng thêm da bạn nữ. Một số ảnh đôi có mask feather nhẹ để nâng luminance riêng vùng mặt bạn nam. Originals giữ nguyên. Chạy lại `npm run media` để xuất ảnh web. Script không chỉnh ảnh thư hoặc ảnh Photoshop, không thay đổi hình dáng khuôn mặt. Ảnh thiếu original được giữ bản web hiện có nếu đầy đủ mọi variant; build dừng nếu thiếu cả hai nguồn.

`crop` trong config là `[left, top, width, height]`, tỷ lệ 0-1 theo ảnh sau khi sửa orientation. Khi thay file gốc, kiểm tra lại crop. Các ảnh thư được crop đủ cả lời mở đầu và chữ ký, không tạo lại chữ viết tay.

Hai video xuất H.264/yuv420p, giữ audio gốc dưới dạng AAC nếu có, có faststart và poster WebP. Cần `ffmpeg` và `ffprobe` trong PATH khi xử lý media local. `video.mp4` gốc không có audio track nên photobooth được ghi “Không tiếng”.

Khi chưa có config local, script không thay thế manifest đã có. CI khôi phục media công khai từ deployment bundle, không cần ảnh gốc.

## Publish ảnh mà không commit

```powershell
npm run publish:media
```

Lệnh đóng gói ảnh/video và audio được chọn vào `media.tar.gz`, upload vào prerelease `website-media` của repo qua GitHub CLI. Không upload originals, project MLT, contact sheets hoặc các ảnh không được chọn. Đây là asset công khai dùng cho website công khai.

Sau khi sửa source, commit/push `main`; workflow lấy media bundle rồi build và deploy Pages. Nếu chỉ đổi ảnh/caption trong config local, publish media trước, sau đó chạy workflow `Deploy GitHub Pages` bằng GitHub Actions hoặc `gh workflow run pages.yml`.

`local-media/`, `public/media/`, output và node_modules được Git ignore. Không dùng `git add -f` cho media.

## Nội dung và motion

- Nội dung: `src/app/content.ts`. 28/10 gặp nhau, 31/10 buổi hẹn ở nhà em, 07/11 buổi hẹn riêng, 14/11 chính thức yêu nhau.
- Các thư gốc có bản chép và ảnh viết tay, giữ đúng người gửi. Thư 20/11 dùng lời chúc đã được anh chọn, có ảnh thư tay đính kèm và lưu cả trong mục Lời thương.
- Anh tự chọn ảnh cho website. Chỉ thêm ảnh được chỉ định hoặc đính kèm, không tự chọn ảnh thay thế.
- Trái tim Three.js có khối beveled, hạt sáng và quỹ đạo. Three.js tải khi gần viewport, dispose khi đổi trang. Vòng ảnh CSS 3D xoay liên tục, photobooth xếp lớp, Polaroid nổi nhẹ, cánh hoa và trái tim trôi. Không có motion toggle.
- Reduced motion làm chuyển động dịu hơn; tab ẩn/canvas ngoài viewport không render WebGL để giảm tải máy. CSS animation của section/album ngoài viewport được pause và tiếp tục khi cuộn lại. Có thêm sao băng và bụi sáng; mobile giảm số hạt và pixel ratio WebGL, tránh blur lớn trên ambient glow.
- iPhone Safari 16.4+ là browser target. Có safe areas, vùng chạm ổn định, modal scroll lock, ảnh responsive và swipe lightbox.
- Nhạc phát trực tiếp bằng HTML audio, không iframe hoặc quảng cáo. Lựa chọn local trong `local-media/content/music.json`, file nguồn ở `local-media/audio/`. `prepare-music.mjs` xuất MP3 128 kbps, bỏ metadata, chuẩn hóa loudness và tạo tên theo hash để cache. Chỉ gán audio source sau khi chạm Bật nhạc, không tải MP3 trong lần mở trang ban đầu. Nhạc giữ khi đổi route, dừng khi ẩn tab hoặc phát video. Video kỷ niệm dùng playsinline, preload none và native controls. Release asset bao gồm `music.json` và đúng MP3 được chọn.
- Background dùng ảnh Photoshop đã chọn, có lớp gradient để giữ chữ dễ đọc. Cụm chòm sao có ảnh nổi theo các mặt phẳng CSS 3D, mặt trăng, hành tinh có vành và quỹ đạo liên tục. Canvas nền dùng 45 sao ở mobile, pixel ratio tối đa 1, giới hạn 30 fps; desktop dùng 110 sao. Các hiệu ứng khác dùng transform/opacity và pause ngoài viewport, không mở thêm WebGL context. Scroll progress dùng passive listener, gộp vào requestAnimationFrame, tránh đọc layout trong mỗi scroll event.
- Đã bỏ `booth-strip` vì lặp nội dung video photobooth. `her-smile` được thay bằng `bouquet-evening` (`IMG_2301.JPG`) theo yêu cầu chọn ảnh khác. Browser tiếp tục bỏ qua hai ID cũ nếu manifest cache chưa được thay.
- Thanh điều hướng mobile dùng real paths, có reading progress và nút về đầu trang.

Research tham khảo: [Codrops 3D Carousel](https://tympanus.net/Development/3DCarousel/), [Three.js InstancedMesh và draw calls](https://threejs.org/docs/pages/InstancedMesh.html), [WebKit inline video và user gesture](https://webkit.org/blog/6784/new-video-policies-for-ios/), [web.dev video performance](https://web.dev/learn/performance/video-performance). Dùng một point cloud và một mesh cho trái tim, không tạo mesh riêng cho từng hạt. Hiệu ứng triển khai bằng CSS/Three.js; giữ native media controls cho iPhone.
