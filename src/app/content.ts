export const story = {
  names: { from: "Bình An", to: "Thanh Tuyền" },
  relationshipDate: "2026-11-14",
  milestones: [
    {
      date: "28.10.2026",
      iso: "2026-10-28",
      title: "Ngày đầu quen nhau",
      text: "Câu chuyện của Bình An và Thanh Tuyền bắt đầu từ đây.",
      symbol: "✧",
    },
    {
      date: "31.10.2026",
      iso: "2026-10-31",
      title: "Buổi hẹn đầu tiên",
      text: "Buổi hẹn đầu tiên, tại nhà Thanh Tuyền. Một ngày để nhớ trong câu chuyện của hai người.",
      symbol: "⌂",
    },
    {
      date: "14.11.2026",
      iso: "2026-11-14",
      title: "Từ hôm ấy, là chúng mình",
      text: "Bình An tỏ tình và trở thành bạn trai của Thanh Tuyền.",
      symbol: "♡",
    },
  ],
  homeLetter: {
    title: "Có Thanh Tuyền trong những ngày bình thường",
    paragraphs: [
      "Gửi Thanh Tuyền,",
      "Bình An muốn giữ lại câu chuyện của hai người ở một nơi thật riêng: từ ngày đầu quen nhau, buổi hẹn đầu tiên tại nhà Thanh Tuyền, đến ngày chúng mình chính thức ở bên nhau.",
      "Sau này, khi có thêm những tấm ảnh, những chuyến đi và những ngày đáng nhớ, góc nhỏ này sẽ lại có thêm một trang. Để mỗi lần nhìn lại, cả hai đều nhớ câu chuyện của mình đã bắt đầu thế nào.",
      "Mong rằng sẽ có thật nhiều ngày bình thường được đi qua cùng Thanh Tuyền.",
    ],
  },
  teachersLetter: {
    title: "Gửi Thanh Tuyền, nhân ngày 20/11",
    paragraphs: [
      "Thanh Tuyền thân mến,",
      "Nhân ngày Nhà giáo Việt Nam 20/11, Bình An chúc Thanh Tuyền có một ngày thật vui và nhận được nhiều tình cảm từ những học trò của mình.",
      "Ban ngày đi làm văn phòng, chiều tối lại dành thời gian cho những lớp tiếng Anh - Bình An trân trọng sự cố gắng của Thanh Tuyền. Mong những giờ dạy luôn mang đến niềm vui, và mỗi tiến bộ của học trò sẽ là một điều thật đáng tự hào.",
      "Cũng mong Thanh Tuyền nhớ dành cho mình những khoảng nghỉ, ăn uống đủ bữa và chăm sóc bản thân. Sau một ngày bận rộn, mong vẫn còn một chút thời gian cho những điều Thanh Tuyền thích, và cho cả hai người nữa.",
      "Cảm ơn Thanh Tuyền vì đã bước vào câu chuyện của Bình An. Chúc cô giáo của những lớp tiếng Anh một ngày 20/11 thật dịu dàng, thật nhiều nụ cười và thật nhiều yêu thương.",
    ],
  },
} as const;

export function daysTogether(now = new Date()): number {
  const vietnamDay = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return Math.max(
    0,
    Math.round(
      (Date.parse(vietnamDay + "T00:00:00Z") -
        Date.parse(story.relationshipDate + "T00:00:00Z")) /
        86400000,
    ),
  );
}
