const STORAGE_KEY = "vibe-course-progress";

const DEEP_DIVE_BY_WEEK = {
  1: {
    title: "Ví dụ trực quan chi tiết: Bản đồ hệ thống marketing",
    context:
      "Mục tiêu là nhìn toàn bộ quy trình marketing như một hệ thống để xác định rõ điểm nghẽn và trách nhiệm từng bước.",
    input: [
      "Kênh: Facebook, TikTok, Zalo OA",
      "Nguồn lực: 1 người làm marketing, 1 thiết kế, 4 giờ/tuần",
      "Mục tiêu: 20 khách hàng tiềm năng mới/tuần",
    ],
    output: [
      "B1 Ý tưởng (45 phút) -> Người làm marketing",
      "B2 Soạn nháp (60 phút) -> AI + Người làm marketing",
      "B3 QA (20 phút) -> Người làm marketing",
      "B4 Đăng bài (15 phút) -> Tự động hóa",
      "B5 Báo cáo (25 phút) -> Bảng điều khiển",
    ],
    checks: ["Xác định >=5 điểm nghẽn", "Mỗi bước có chủ sở hữu", "Đo được thời gian toàn chu trình"],
  },
  2: {
    title: "Ví dụ trực quan chi tiết: Backlog giả thuyết",
    context:
      "Bạn cần một backlog giả thuyết có điểm ưu tiên rõ để chọn đúng bài kiểm thử đầu tiên và tránh làm theo cảm tính.",
    input: [
      "Mục tiêu tháng: tăng 30% khách hàng tiềm năng",
      "Dữ liệu gần nhất: CTR 1.8%, CPC 6.500 VND",
      "Năng lực nhóm: 2 kiểm thử A/B mỗi tuần",
    ],
    output: [
      "H1: đổi tiêu đề -> CTR +20% (Tác động 4, Công sức 1)",
      "H2: thêm bằng chứng đầu bài -> CVR +15% (Tác động 3, Công sức 2)",
      "H3: rút gọn biểu mẫu -> khách hàng tiềm năng +25% (Tác động 5, Công sức 2)",
      "Ưu tiên chạy: H3 -> H1 -> H2",
    ],
    checks: ["Có >=10 giả thuyết", "Mỗi giả thuyết có KPI mục tiêu", "Chốt 3 kiểm thử ưu tiên"],
  },
  3: {
    title: "Ví dụ trực quan chi tiết: Ma trận Con người và AI",
    context:
      "Khung phân vai giúp bạn tách việc AI làm tốt khỏi việc con người phải giữ quyền quyết định để giảm rủi ro thương hiệu.",
    input: [
      "15 tác vụ lặp lại/tuần",
      "Rủi ro thương hiệu cao ở bước phê duyệt cuối",
      "Mục tiêu tự động hóa tối thiểu 30%",
    ],
    output: [
      "AI: tổng hợp insight, tạo nháp, tạo biến thể tiêu đề",
      "Con người: chọn thông điệp chiến lược, duyệt cuối, xử lý nội dung nhạy cảm",
      "Điểm kiểm soát: mọi bài đăng đều qua 1 vòng duyệt thủ công",
    ],
    checks: ["Có danh sách 3 nhóm tác vụ", "Có quy tắc duyệt nội dung rủi ro", "Tự động hóa >=30% tác vụ lặp lại"],
  },
  4: {
    title: "Ví dụ trực quan chi tiết: Chuyển yêu cầu mơ hồ thành brief",
    context:
      "Từ yêu cầu chung chung, bạn chuẩn hóa thành brief có đầu vào, đầu ra, điều kiện đạt để giao việc được ngay.",
    input: [
      "Yêu cầu gốc: viết bài giới thiệu sản phẩm mới",
      "Thời hạn: 48 giờ",
      "Kênh: Facebook và Email",
    ],
    output: [
      "Input bắt buộc: chân dung khách hàng, lợi ích cốt lõi, bằng chứng",
      "Output: 3 tiêu đề + 1 bài 250-300 từ + 1 CTA",
      "Điều kiện đạt: đúng giọng thương hiệu, có dữ liệu hỗ trợ",
    ],
    checks: ["Chuẩn hóa được 3 công việc thật", "Mỗi brief có KPI", "Người khác làm được chỉ từ brief"],
  },
  5: {
    title: "Ví dụ trực quan chi tiết: Thư viện prompt thực dụng",
    context:
      "Prompt tốt phải tái sử dụng được, có biến số rõ và đo được chất lượng đầu ra sau mỗi lần dùng.",
    input: [
      "4 nhóm prompt: nghiên cứu, nội dung, quảng cáo, CRM",
      "Ràng buộc: giọng thương hiệu rõ, ngắn gọn, có CTA",
      "Mục tiêu: thời gian nháp đầu tiên dưới 20 phút",
    ],
    output: [
      "Khung prompt: Vai trò -> Bối cảnh -> Nhiệm vụ -> Định dạng -> Tiêu chí đạt",
      "Prompt nội dung: viết 280 từ cho nhóm khách hàng A, giọng B, CTA C",
      "Prompt quảng cáo: tạo 5 biến thể tiêu đề, mỗi tiêu đề <=60 ký tự",
    ],
    checks: ["Có >=20 prompt", "Mỗi prompt có ví dụ đầu vào/đầu ra", "Đo được thời gian tạo nháp"],
  },
  6: {
    title: "Ví dụ trực quan chi tiết: Vòng QA cho đầu ra AI",
    context:
      "QA ngắn gọn nhưng bắt buộc là cách nhanh nhất để giảm lỗi logic, lỗi dữ liệu và lỗi giọng thương hiệu.",
    input: ["5 đầu ra AI gần nhất", "Checklist QA 5 điểm", "Ngưỡng đạt: tối thiểu 4/5 điểm"],
    output: [
      "Điểm 1: đúng dữ liệu",
      "Điểm 2: đúng giọng thương hiệu",
      "Điểm 3: CTA rõ",
      "Điểm 4: tuân thủ chính sách kênh",
      "Điểm 5: định dạng tối ưu cho di động",
    ],
    checks: ["Giảm lỗi sửa thủ công >=40%", "QA mỗi đầu ra <=5 phút", "Có log lỗi để cải tiến prompt"],
  },
  7: {
    title: "Ví dụ trực quan chi tiết: Mốc nền và chênh lệch tác động",
    context:
      "So sánh trước/sau giúp bạn chứng minh giá trị thật của quy trình mới thay vì đánh giá dựa trên cảm giác.",
    input: [
      "Mốc nền 4 tuần: tốc độ, độ ổn định, kết quả",
      "KPI chính: thời gian sản xuất, tỷ lệ đúng lịch, CTR",
      "Mục tiêu: cải thiện đồng thời 3 nhóm chỉ số",
    ],
    output: [
      "Trước AI: 4.8 giờ/tuần, đúng lịch 62%, CTR 1.9%",
      "Sau AI 2 tuần: 3.1 giờ/tuần, đúng lịch 84%, CTR 2.4%",
      "Kết luận: tốc độ và độ ổn định cải thiện rõ; kết quả cần theo dõi thêm",
    ],
    checks: ["Có bảng điều khiển theo tuần", "Mỗi KPI có ngưỡng đạt", "Báo cáo được chênh lệch trước/sau"],
  },
  8: {
    title: "Ví dụ trực quan chi tiết: Tổng kết tuần và cải tiến vòng lặp",
    context:
      "Mẫu tổng kết giúp chuyển dữ liệu thành quyết định cụ thể để mỗi tuần đều có cải tiến đo được.",
    input: [
      "Dữ liệu tuần: thời gian, lỗi QA, hiệu suất nội dung",
      "Mẫu: Giữ - Bỏ - Cải tiến",
      "Giới hạn: tối đa 2 thay đổi lớn mỗi tuần",
    ],
    output: [
      "Giữ: prompt mở bài hiệu quả",
      "Bỏ: quy trình duyệt 2 vòng gây chậm",
      "Cải tiến 1: rút checklist QA 9 -> 5 mục",
      "Cải tiến 2: gộp 2 bước đăng bài thành 1 tự động hóa",
    ],
    checks: ["Chốt >=2 cải tiến/tuần", "Mỗi cải tiến có người phụ trách", "Tái đo tác động ở tuần sau"],
  },
  9: {
    title: "Ví dụ trực quan chi tiết: Bộ công cụ tối thiểu",
    context:
      "Trọng tâm không phải nhiều công cụ, mà là dữ liệu đi đúng luồng và trạng thái được cập nhật nhất quán.",
    input: [
      "Công cụ: ChatGPT + Google Sheets/Docs + Make/Zapier",
      "Đầu vào: 1 brief mẫu và lịch đăng",
      "Ràng buộc: không viết mã",
    ],
    output: [
      "Luồng: Brief -> AI tạo nháp -> QA -> Lịch đăng",
      "Trạng thái: Mới, Đang xử lý, Cần sửa, Sẵn sàng",
      "Cảnh báo trễ: quá 24 giờ chưa cập nhật trạng thái",
    ],
    checks: ["Có 1 pipeline chạy đầu-cuối", "Giảm thao tác tay lặp lại", "Có log lỗi để khắc phục nhanh"],
  },
  10: {
    title: "Ví dụ trực quan chi tiết: Dự án mini 1 - Cỗ máy nội dung",
    context:
      "Bạn chuyển từ học kỹ năng sang xây hệ thống nội dung thật có hiệu quả đo được trong ngữ cảnh marketing của mình.",
    input: [
      "6 brief nội dung/tuần",
      "Mục tiêu: giảm >=30% giờ sản xuất",
      "Checklist QA từ tuần 6",
    ],
    output: [
      "Giờ sản xuất: 6 giờ -> 4.2 giờ sau 2 tuần",
      "Qua QA vòng 1: 55% -> 80%",
      "Đúng lịch xuất bản: 60% -> 85%",
    ],
    checks: ["Có báo cáo trước/sau", "Có quy tắc xử lý nội dung bị trả QA", "Có lịch đăng theo tuần"],
  },
  11: {
    title: "Ví dụ trực quan chi tiết: Dự án mini 2 - Theo dõi kiểm thử",
    context:
      "Giá trị của kiểm thử là học nhanh và tái sử dụng bài học, không chỉ chạy thêm nhiều biến thể.",
    input: ["10 kiểm thử gần nhất", "KPI: CTR, CPC, tỷ lệ chuyển đổi", "Mục tiêu tăng >=2x số vòng kiểm thử/tháng"],
    output: [
      "Bảng kết quả: giả thuyết, biến thể, KPI thực tế, quyết định",
      "Nhãn tự động: Giữ/Cải tiến/Dừng theo ngưỡng KPI",
      "Top 3 bài học đưa lại vào prompt và brief tháng sau",
    ],
    checks: ["100% kiểm thử có kết luận", "Ra quyết định trong <=24 giờ", "Bài học được tài liệu hóa"],
  },
  12: {
    title: "Ví dụ trực quan chi tiết: Dự án mini 3 - Phễu nuôi dưỡng",
    context:
      "Mục tiêu là triển khai một phễu nhỏ nhưng đo được để cải tiến liên tục thay vì chờ hệ thống lớn.",
    input: [
      "30 khách hàng tiềm năng đầu tiên",
      "Chuỗi 3 email: Chào mừng -> Bằng chứng -> CTA",
      "KPI: tỷ lệ mở, CTR, tỷ lệ chuyển bước",
    ],
    output: [
      "Tuần 1: tỷ lệ mở 22%, CTR 2.1%, chuyển bước 4%",
      "Tuần 2: tỷ lệ mở 31%, CTR 3.4%, chuyển bước 7%",
      "Cải tiến hiệu quả: rút gọn tiêu đề và 1 CTA chính/email",
    ],
    checks: ["Có phân đoạn lạnh/ấm/nóng", "Mỗi email có 1 mục tiêu chính", "Tổng kết tối ưu mỗi 2 tuần"],
  },
};

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

function buildList(items) {
  return items.map((item) => `<li>${item}</li>`).join("");
}

function injectDeepDive(week) {
  const data = DEEP_DIVE_BY_WEEK[week];
  const anchor = document.querySelector(".exercise-card");
  if (!data || !anchor || !anchor.parentElement) return;

  const section = document.createElement("section");
  section.className = "deepdive-card";
  section.innerHTML = `
    <h2>${data.title}</h2>
    <p>${data.context}</p>
    <div class="deepdive-grid">
      <div class="deepdive-pane">
        <h3>Đầu vào mẫu</h3>
        <ul>${buildList(data.input)}</ul>
      </div>
      <div class="deepdive-pane">
        <h3>Đầu ra kỳ vọng</h3>
        <pre>${data.output.join("\n")}</pre>
      </div>
    </div>
    <div class="deepdive-checks">
      <h3>Tiêu chí đạt</h3>
      <ul>${buildList(data.checks)}</ul>
    </div>
  `;

  anchor.parentElement.insertBefore(section, anchor);
}

const weekCheck = document.querySelector("[data-week]");
const jumpButton = document.getElementById("jumpToWeek");
const statusChip = document.getElementById("doneChip");
const statusText = document.getElementById("statusText");
const activeWeek = Number(weekCheck?.dataset.week || "0");

if (activeWeek > 0) {
  injectDeepDive(activeWeek);
}

function updateStatus(checked) {
  if (!statusChip || !statusText) return;
  if (checked) {
    statusChip.hidden = false;
    statusText.textContent = "Tuần này đã đánh dấu hoàn thành";
  } else {
    statusChip.hidden = true;
    statusText.textContent = "Tuần này chưa hoàn thành";
  }
}

if (weekCheck) {
  const week = weekCheck.dataset.week;
  const saved = loadProgress();
  weekCheck.checked = Boolean(saved[week]);
  updateStatus(weekCheck.checked);

  weekCheck.addEventListener("change", () => {
    const updated = loadProgress();
    updated[week] = weekCheck.checked;
    saveProgress(updated);
    updateStatus(weekCheck.checked);
  });
}

if (jumpButton && weekCheck) {
  jumpButton.addEventListener("click", () => {
    const week = Number(weekCheck.dataset.week || "1");
    window.location.href = `../modules.html#w${week}`;
  });
}
