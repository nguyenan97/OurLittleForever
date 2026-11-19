# Our Little Forever - Research & creative direction

Research ngày 19/11/2026. Chủ nhân: Bình An & Thanh Tuyền.

## 1. Yêu cầu đã chốt

- Phong cách: Premium Love Story, có điểm nhấn 3D cinematic.
- Người có link được xem; Bình An quản lý nội dung bằng file.
- Không cần trang admin, upload UI hoặc hệ thống quản lý ảnh.
- Ảnh gốc nằm ở local; copy bản đã chọn và xử lý sang thư mục public.
- Có album ảnh, kỷ niệm và các đoạn thư. Có thể resize, crop, cân sáng và ghép ảnh để phục vụ bố cục.
- Thanh Tuyền học ngôn ngữ Anh, làm văn phòng và dạy tiếng Anh thêm chiều tối. Dùng chi tiết này làm cảm hứng cho lời dẫn, không biến website thành portfolio nghề nghiệp.

Đã xác nhận bổ sung: dùng tên Bình An - Thanh Tuyền, nội dung tiếng Việt. Ngày đầu quen 28/10/2026; buổi hẹn đầu tại nhà Thanh Tuyền 31/10/2026; tỏ tình và chính thức là người yêu 14/11/2026. Có trang riêng chúc mừng ngày Nhà giáo Việt Nam 20/11/2026. Bộ đếm tính ngày đã trôi qua kể từ 14/11/2026 theo lịch Việt Nam. Các đoạn thư do hệ thống soạn là bản nháp để Bình An duyệt.

## 2. Kết quả đối chiếu reference

| Reference | Điều đã xác minh | Cách ứng dụng đề xuất |
| --- | --- | --- |
| [MiLove - ngimnee/milove](https://github.com/ngimnee/milove) | README khớp mô tả: galaxy Three.js, cinematic intro, phong bì và album tương tác. Tác giả yêu cầu có sự cho phép trước khi tái sử dụng code. | Dùng làm visual reference; triển khai riêng các hiệu ứng cần thiết. |
| [Proposal Website - ImperatorOz](https://github.com/ImperatorOz/proposal-website) | Có Polaroid, counter, timeline, thư và hộp nhẫn. Đây là ứng viên khớp mô tả, chưa có link gốc từ người dùng để xác nhận chính xác. | Tham khảo nhịp kể chuyện; bỏ proposal/ring box vì yêu cầu hiện tại là lưu kỷ niệm. |
| [React Three Fiber](https://github.com/pmndrs/react-three-fiber) | Renderer Three.js dành cho React. | Chỉ chọn nếu chuyển frontend sang React; không ghép React vào Angular chỉ để có 3D. |
| [React Three Next](https://github.com/pmndrs/react-three-next) | Starter cho Next.js, React Three Fiber và Three.js. | Tham khảo tổ chức DOM/canvas; không phù hợp làm nền cho phương án Angular. |
| [Angular Three](https://angularthree.org/learn/getting-started/introduction/) | Renderer Three.js theo template Angular. | Ứng viên phù hợp nếu scene cần nhiều component. Với một scene hero, Three.js trực tiếp cũng là lựa chọn gọn. |
| [tsParticles](https://github.com/tsparticles/tsparticles) | Có particles, confetti, fireworks và hỗ trợ Angular. | Chỉ thêm khi cần preset phức tạp; galaxy đã dùng Three.js thì không cần một particle engine thứ hai chỉ để vẽ sao. |
| [Codrops PageTransitions](https://github.com/codrops/PageTransitions) | Collection các page transition bằng CSS animation. | Tham khảo chuyển cảnh. Ưu tiên fade/slide nhẹ cho navigation và giữ native scroll. |

“Particle Effects Buttons” chưa có URL cụ thể nên chưa xác định được repo. Không dùng số stars đã cung cấp để khẳng định chất lượng hoặc compatibility. Các nhận xét trên dựa vào README/docs/source công khai, chưa phải kết quả chạy thử các demo trên điện thoại.

## 3. Concept đề xuất

**Our Little Forever - Những ngày có nhau.**

Một cuốn lưu bút có không khí điện ảnh: ảnh thật chiếm vị trí chính, thư đọc dễ dàng, mỗi chương có một điểm chuyển động vừa đủ. Galaxy đóng vai trò mở cánh cửa vào câu chuyện; album và thư là lý do quay lại.

Các lựa chọn dưới đây là đề xuất thiết kế, chưa phải sở thích đã được xác nhận của Thanh Tuyền.

- Palette: midnight `#111321`, burgundy `#622B41`, blush `#EDD5D8`; giấy thư sáng `#FFF8F1` để đọc lâu. Galaxy tông navy, ánh sao champagne, tránh neon phủ toàn trang.
- Typography: một serif có hỗ trợ dấu tiếng Việt cho heading, một sans cho body; chữ viết tay chỉ dùng ở chữ ký/caption ngắn. Kiểm tra tên “Bình An”, “Thanh Tuyền” và dấu tiếng Việt trước khi chốt font.
- Bố cục editorial: hero ảnh ngang, ảnh lớn xen khoảng trắng, lề rộng, từng cụm 2-3 ảnh có chủ ý. Body tối thiểu 16px; mobile ưu tiên một cột.
- Microcopy ngắn; mỗi ảnh có một câu gắn với chi tiết thật. Nội dung tiếng Anh có thể tạo dấu ấn riêng, nhưng chưa mặc định song ngữ toàn bộ.

## 4. Trải nghiệm theo chương

| Chương | Nội dung | Điểm nhấn |
| --- | --- | --- |
| Mở cửa | Tên hai người, ảnh đại diện câu chuyện, nút “Mở câu chuyện” | Starfield xuất hiện nhẹ; intro khoảng 3-5 giây và có Bỏ qua. Lần quay lại đi thẳng vào nội dung. |
| Our story | Các mốc thật: lần đầu gặp, chuyến đi, một buổi hẹn đáng nhớ | Timeline xen ảnh, reveal khi xuất hiện trong viewport; mỗi mốc có link riêng. |
| Little moments | Album theo buổi hẹn/chuyến đi hoặc năm | Lightbox, swipe trên mobile, xem ảnh gốc theo quyền công khai đã chọn. |
| Letters for you | Các đoạn thư, một thư nổi bật mở bằng phong bì wax seal | Mở phong bì bằng CSS 3D; nội dung thư hiển thị bằng HTML để chọn chữ và đọc dễ. |
| After the last lesson | Một lời nhắn ngắn dành riêng cho Thanh Tuyền sau ngày làm việc/dạy học | Bố cục yên tĩnh, nhạc bật theo lựa chọn; có thể bổ sung voice note của Bình An. |
| To be continued | Trang kết có một lời nhắn và lối quay lại album | Chòm sao hai tên hoặc một heart glow nhỏ; hiệu ứng celebration chỉ ở dịp phù hợp. |

Các chương mở trực tiếp được từ navigation; không bắt xem lại intro để đến album. Bộ đếm ngày chỉ thêm khi có ngày thật và người dùng muốn hiển thị.

Ví dụ lời dẫn để chọn giọng văn, không phải nội dung đã chốt:

> Có những ngày chỉ là một tấm ảnh. Có những ngày, nhìn lại, là cả một khoảng thương.

> After the last lesson, a little love is waiting here.

Không dùng quote gán tác giả khi chưa xác minh, không dùng AI để tự bịa kỷ niệm. Mỗi đoạn thư nên có chi tiết thật thay cho lời văn tình yêu chung chung.

## 5. Motion và chất lượng trải nghiệm

- Một starfield Three.js cho hero. Render bằng Points/BufferGeometry là hướng triển khai cần benchmark; khởi điểm đề xuất 1.000-3.000 điểm desktop, giảm trên mobile theo đo đạc thực tế. Đây là budget thử nghiệm, không phải bảo đảm FPS.
- Thư dùng CSS perspective/transform và một animation timeline; không cần mô hình 3D phức tạp cho hiệu ứng mở phong bì.
- Khi đọc thư, giảm hoặc dừng nền chuyển động. Khi canvas ra ngoài viewport hoặc tab bị ẩn, tạm ngừng render. Angular Three có [on-demand rendering](https://angularthree.org/learn/advanced/performance/on-demand-rendering/) cho scene không chuyển động liên tục.
- Tôn trọng [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion); có chế độ tĩnh nếu WebGL không khả dụng. Navigation và nội dung vẫn dùng được.
- Không dùng loading giả hoặc bắt đợi tải hết album. Hero và chữ xuất hiện trước, ảnh album lazy-load; 3D lazy-load riêng và có nền tĩnh thay thế.
- Không dùng scroll hijacking; tránh cursor tùy biến trên mọi trang và particle che nội dung thư.
- Nhạc mặc định tắt, chỉ bật sau thao tác. Điều này hợp bối cảnh văn phòng và phù hợp [chính sách autoplay của browser](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay). Có nút tắt luôn thấy được.
- Mục tiêu đo sau khi có ảnh thật: LCP ≤ 2,5 giây, INP ≤ 200 ms, CLS ≤ 0,1, đánh giá ở percentile 75 khi đủ field data. Đây là các ngưỡng Core Web Vitals, chưa phải kết quả của project. [Nguồn Google](https://developers.google.com/search/docs/appearance/core-web-vitals).

## 6. Kiến trúc phù hợp với phạm vi hiện tại

Đề xuất **Angular + TypeScript + Three.js + CSS animations**, website static, content định nghĩa bằng file. Chưa cần .NET API, SQL Server hoặc authentication vì người dùng chọn public theo link và không cần cập nhật qua UI.

- Tách các phần `story`, `gallery`, `letters`, `cinematic` để scene 3D không điều khiển toàn bộ UI.
- Metadata ảnh gồm `id`, `src`, `width`, `height`, `alt`, `caption`, `focalPoint`, `albumId`; nội dung mốc gồm ngày nếu biết, tiêu đề, đoạn kể và danh sách ảnh. Không ép ngày giả khi chỉ nhớ năm.
- Giữ content riêng khỏi animation, để thêm một kỷ niệm không phải sửa component hay scene.
- Với thư dài, Markdown có thể là nguồn nội dung; render theo cấu hình an toàn. Không cần rich text editor ở bản đầu.
- Có thể deploy static lên Azure sau khi chốt hosting; hiện chưa tạo tài nguyên hoặc deploy.
- Nếu sau này cả hai muốn viết trên web, mới bổ sung .NET API, SQL Server cho metadata và Blob Storage cho media.

Không dự kiến màn nhập mật khẩu hay cơ chế mã hóa ảnh ở frontend. Media public sẽ đọc được qua URL. Nếu không muốn xuất hiện trên search engine, có thể cấu hình noindex; noindex không giới hạn quyền truy cập.

## 7. Quy trình ảnh local → public

Đã chuẩn bị hai vùng riêng, đều được Git ignore:

```text
local-media/
  README.md
  photos/
    originals/     ảnh gốc
    selected/      copy các ảnh muốn dùng
  letters/         bản nháp thư cá nhân
  audio/           nhạc / voice note nguồn
  videos/          video nguồn nếu có
  content/         ghi chú caption, ngày, thứ tự câu chuyện

public/media/
  photos/          ảnh xuất để website phục vụ
  audio/           audio được chọn cho website
```

Đã có app Angular và script `scripts/prepare-media.mjs` copy/xuất ảnh từ local sang public, tạo thumbnail và manifest cho album. Chạy bằng `npm run media`, hoặc tự động trước start/build.

Quy trình đề xuất:

1. Bình An đặt ảnh gốc vào `originals`, copy ảnh muốn dùng vào `selected`.
2. Chọn 1 hero, 6-12 ảnh đầu tiên và 3-5 mốc thật để định bố cục.
3. Xuất ảnh mới: auto-orient theo EXIF, resize, crop theo bố cục và giữ focal point ở khuôn mặt; cân sáng nhẹ nếu cần. Không ghi đè originals.
4. Hero thử ở chiều rộng 1.600-1.920px; ảnh gallery xuất 640/960/1.440px theo nhu cầu. Ưu tiên WebP, giữ JPEG fallback khi cần. Chất lượng được quyết định bằng xem ảnh thật trên màn hình mục tiêu.
5. Mục tiêu thử nghiệm: thumbnail 50-120KB, ảnh gallery 150-300KB, hero dưới 400KB khi chất lượng cho phép. Không ép budget làm hỏng khuôn mặt hoặc chi tiết.
6. Collage 2-3 ảnh chỉ dành cho một cụm kể chuyện; giữ từng ảnh riêng để mở lightbox. Cắt ảnh bằng layout trước khi thay đổi chính file.
7. Export metadata ảnh và copy bản cuối vào `public/media`. Bỏ metadata GPS khỏi bản public.

Chưa có ảnh cá nhân ở thời điểm triển khai. Script dùng Sharp đã được kiểm tra bằng hai ảnh test ngang/dọc; ảnh test đã xóa sau QA. Chưa chỉnh sửa hoặc ghép ảnh cá nhân.

Vì media không ở Git, môi trường deploy phải nhận media qua một bước copy/upload riêng. Clone repo sẽ không tự có ảnh. Git ignore giúp tách media khỏi source control, không tự backup hoặc che media đã deploy public.

## 8. Phạm vi bản đầu đề xuất

- Responsive hero + một galaxy scene có fallback.
- Timeline với dữ liệu thật; album/lightbox; 1 thư có phong bì tương tác.
- Navigation đi trực tiếp tới từng chương; toggle audio và reduced-motion.
- File content dễ sửa; quy trình ảnh local → public; hướng dẫn chạy và deploy.

Để sau: album lật trang 3D đầy đủ, thư hẹn giờ, nhiều theme theo ngày lễ, video nền và shader phức tạp. Chỉ thêm khi bản chính đã đẹp với ảnh thật và chạy ổn trên điện thoại.

Tiêu chí nghiệm thu: không overflow ở mobile, hình đúng focal point, dấu tiếng Việt không lỗi, navigation hoạt động bằng keyboard, lightbox thoát bằng Escape và trả focus, thư đọc được khi giảm motion/WebGL lỗi, nhạc không tự bật, tất cả ảnh tham chiếu tồn tại, media tiếp tục được Git ignore.

## 9. Bản đầu đã triển khai - 19/11/2026

- Angular 21.2.x phù hợp Node.js 20.20 đang có trên máy; Three.js lazy-load.
- Trang `/` có ba cột mốc thật, bộ đếm từ 14/11/2026, album và thư.
- Trang `/20-11` có hero trái tim từ point cloud, ba lời chúc, phong bì mở thư và nút nhận bó thương. Nội dung bằng tiếng Việt, dùng tên Bình An - Thanh Tuyền.
- Hai thư trong `src/app/content.ts` là bản nháp để chủ nhân chỉnh lại; không tự tạo các kỷ niệm khác.
- Production build thành công. Đã kiểm tra route trực tiếp, thư mở/đóng/Escape và trả focus, lightbox/chuyển ảnh, trạng thái nhận hoa, reduced-motion và Git ignore.
- Không overflow tại viewport 320, 390, 768 và 1440px trên Chromium desktop emulation cho cả hai route. Đây chưa phải kiểm thử trên thiết bị iOS/Android thật.
- Luồng ảnh kiểm tra với hai fixture: resize đúng budget, thumbnail, bỏ EXIF, nguồn không bị ghi đè, ảnh xuất được browser tải và lightbox hiển thị. Đã xóa fixture và tạo lại manifest rỗng.
- Chưa có ảnh cá nhân, audio, bản deploy hoặc commit Git. Hướng dẫn chạy và chuẩn bị ảnh ở `README.md`.
