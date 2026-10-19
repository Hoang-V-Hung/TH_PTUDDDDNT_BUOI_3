import type {
  Course,
  StudyResult,
  StudySession,
  StudyState,
} from '../types/study';

export const CURRENT_SEMESTER = 'Học kỳ 1 · 2026–2027';
export const RESULT_SEMESTER = 'Học kỳ 2 · 2025–2026';
export const courses: Course[] = [
  {
    id: 'RIPT1412',
    name: 'Phát triển ứng dụng di động đa nền tảng',
    credits: 3,
    lecturer: 'ThS. Trần Quang Đại',
    semester: CURRENT_SEMESTER,
    status: 'active',
    description:
      'Phát triển ứng dụng di động đa nền tảng bằng React Native cho Android và iOS. Thiết kế giao diện, quản lý trạng thái, điều hướng, tích hợp API và lưu trữ dữ liệu trên thiết bị.',
  },
  {
    id: 'INT1448',
    name: 'Phát triển phần mềm hướng dịch vụ',
    credits: 3,
    lecturer: 'ThS. Nguyễn Việt Dũng',
    semester: CURRENT_SEMESTER,
    status: 'active',
    description:
      'Tìm hiểu kiến trúc hướng dịch vụ, phân tích và thiết kế dịch vụ sử dụng SOAP, REST và microservice. Xây dựng API, tích hợp các dịch vụ và xử lý xác thực trong hệ thống phân tán.',
  },
  {
    id: 'RIPT1411',
    name: 'Lập trình Web nâng cao',
    credits: 3,
    lecturer: 'ThS. Phan Quang Thành',
    semester: CURRENT_SEMESTER,
    status: 'active',
    description:
      'Xây dựng ứng dụng Web có giao diện tương tác, quản lý trạng thái, xử lý bất đồng bộ và tích hợp API. Thực hiện xác thực người dùng, tối ưu hiệu năng và triển khai ứng dụng.',
  },
  {
    id: 'RIPT1413',
    name: 'Phân tích nghiệp vụ',
    credits: 3,
    lecturer: 'ThS. Vũ Văn Thương',
    semester: CURRENT_SEMESTER,
    status: 'active',
    description:
      'Khảo sát nhu cầu của các bên liên quan, phân tích quy trình nghiệp vụ và xác định yêu cầu hệ thống. Mô hình hóa quy trình bằng BPMN, xây dựng use case, user story và tài liệu đặc tả yêu cầu.',
  },
  {
    id: 'INT1416',
    name: 'Đảm bảo chất lượng phần mềm',
    credits: 3,
    lecturer: 'ThS. 	Phạm Đình Chung',
    semester: CURRENT_SEMESTER,
    status: 'active',
    description:
      'Tìm hiểu quy trình đảm bảo chất lượng phần mềm, lập kế hoạch kiểm thử và thiết kế ca kiểm thử. Thực hành kiểm thử thủ công, kiểm thử tự động, quản lý lỗi và đánh giá chất lượng sản phẩm.',
  },
  {
    id: 'BAS1153',
    name: 'Lịch sử Đảng Cộng sản Việt Nam',
    credits: 2,
    lecturer: 'ThS. Nguyễn Thị Thơm',
    semester: CURRENT_SEMESTER,
    status: 'active',
    description:
      'Nghiên cứu sự ra đời của Đảng Cộng sản Việt Nam và quá trình lãnh đạo đấu tranh giành độc lập, xây dựng và bảo vệ Tổ quốc. Tìm hiểu đường lối đổi mới và các bài học lịch sử qua từng giai đoạn.',
  },
  {
    id: 'INT1306',
    name: 'Cấu trúc dữ liệu và giải thuật',
    credits: 3,
    lecturer: 'ThS. Phan Lý Huỳnh',
    semester: RESULT_SEMESTER,
    status: 'completed',
    description:
      'Tìm hiểu danh sách liên kết, ngăn xếp, hàng đợi, cây và đồ thị. Cài đặt các giải thuật tìm kiếm, sắp xếp, duyệt đồ thị và phân tích độ phức tạp thời gian, bộ nhớ.',
  },
  {
    id: 'RIPT1303',
    name: 'Mạng máy tính theo CCNA',
    credits: 4,
    lecturer: 'ThS. Lê Văn Hoàng',
    semester: RESULT_SEMESTER,
    status: 'completed',
    description:
      'Tìm hiểu mô hình OSI, TCP/IP, địa chỉ IPv4 và IPv6 theo định hướng CCNA. Thực hành chia mạng con, cấu hình switch, router, VLAN và định tuyến trên mô hình mạng mô phỏng.',
  },
  {
    id: 'RIPT1309',
    name: 'Học phần doanh nghiệp 2',
    credits: 3,
    lecturer: 'TS. Ngô Quốc Dũng',
    semester: RESULT_SEMESTER,
    status: 'completed',
    description:
      'Thực hiện đề tài thực tế theo yêu cầu doanh nghiệp, vận dụng kiến thức chuyên ngành để giải quyết bài toán phần mềm. Rèn luyện kỹ năng làm việc nhóm, quản lý tiến độ và trình bày kết quả dự án.',
  },
  {
    id: 'BAS1201',
    name: 'Đại số',
    credits: 3,
    lecturer: 'TS. Hoàng Phi Dũng',
    semester: RESULT_SEMESTER,
    status: 'completed',
    description:
      'Tìm hiểu ma trận, định thức, hệ phương trình tuyến tính và không gian vectơ. Thực hành các phép biến đổi tuyến tính, tính giá trị riêng, vectơ riêng và ứng dụng giải các bài toán đại số tuyến tính.',
  },
];

export const studySessions: StudySession[] = [
  {
    id: 'session-1',
    courseId: 'RIPT1412',
    dayOfWeek: 1,
    startTime: '07:30',
    endTime: '10:10',
    room: 'A2-305',
    type: 'Lý thuyết',
    note: 'Ôn các thành phần React Native, quản lý trạng thái và điều hướng. Mang máy tính cá nhân để thực hành ví dụ trên lớp.',
  },
  {
    id: 'session-2',
    courseId: 'INT1448',
    dayOfWeek: 1,
    startTime: '13:00',
    endTime: '15:40',
    room: 'B1-204',
    type: 'Lý thuyết',
    note: 'Đọc trước kiến trúc hướng dịch vụ, cách thiết kế REST API và sự khác nhau giữa SOAP, REST và microservice.',
  },
  {
    id: 'session-3',
    courseId: 'RIPT1411',
    dayOfWeek: 2,
    startTime: '07:30',
    endTime: '11:00',
    room: 'A1-402',
    type: 'Lý thuyết',
    note: 'Ôn JavaScript, xử lý bất đồng bộ và tích hợp API. Chuẩn bị mã nguồn ứng dụng Web để thực hành trên lớp.',
  },
  {
    id: 'session-4',
    courseId: 'RIPT1413',
    dayOfWeek: 3,
    startTime: '09:30',
    endTime: '12:10',
    room: 'B2-301',
    type: 'Lý thuyết',
    note: 'Chuẩn bị câu hỏi khảo sát các bên liên quan, sơ đồ quy trình nghiệp vụ và bản nháp use case của đề tài nhóm.',
  },
  {
    id: 'session-5',
    courseId: 'RIPT1412',
    dayOfWeek: 3,
    startTime: '13:00',
    endTime: '15:40',
    room: 'PM-02',
    type: 'Thực hành',
    note: 'Cài sẵn Node.js, Android Studio và môi trường React Native.',
  },
  {
    id: 'session-6',
    courseId: 'INT1416',
    dayOfWeek: 4,
    startTime: '07:30',
    endTime: '10:10',
    room: 'A2-201',
    type: 'Lý thuyết',
    note: 'Đọc trước kỹ thuật phân vùng tương đương và phân tích giá trị biên. Chuẩn bị các ca kiểm thử cho chức năng đăng nhập.',
  },
  {
    id: 'session-7',
    courseId: 'BAS1153',
    dayOfWeek: 5,
    startTime: '09:30',
    endTime: '11:10',
    room: 'C1-103',
    type: 'Lý thuyết',
    note: 'Đọc giáo trình về sự ra đời của Đảng Cộng sản Việt Nam và chuẩn bị nội dung thảo luận nhóm theo giai đoạn lịch sử được giao.',
  },
  {
    id: 'session-8',
    courseId: 'INT1448',
    dayOfWeek: 6,
    startTime: '07:30',
    endTime: '10:10',
    room: 'PM-01',
    type: 'Thực hành',
    note: 'Mang máy tính có môi trường chạy dịch vụ Web và Postman. Chuẩn bị REST API để thực hành tích hợp và kiểm tra các endpoint.',
  },
].map(
  session =>
    ({
      ...session,
      startDate: '2026-09-07',
      endDate: '2027-01-17',
    } as StudySession),
);

export const studyResults: StudyResult[] = [
  {
    id: 'result-1',
    courseId: 'INT1306',
    components: [
      { name: 'Chuyên cần', weight: 10, score: 10 },
      { name: 'Giữa kỳ', weight: 30, score: 8 },
      { name: 'Cuối kỳ', weight: 60, score: 8.5 },
    ],
  },
  {
    id: 'result-2',
    courseId: 'RIPT1303',
    components: [
      { name: 'Chuyên cần', weight: 10, score: 9 },
      { name: 'Giữa kỳ', weight: 30, score: 7 },
      { name: 'Cuối kỳ', weight: 60, score: 7.5 },
    ],
  },
  {
    id: 'result-3',
    courseId: 'RIPT1309',
    components: [
      { name: 'Chuyên cần', weight: 10, score: 10 },
      { name: 'Giữa kỳ', weight: 30, score: 8.5 },
      { name: 'Cuối kỳ', weight: 60, score: 8 },
    ],
  },
  {
    id: 'result-4',
    courseId: 'BAS1201',
    components: [
      { name: 'Chuyên cần', weight: 10, score: 10 },
      { name: 'Giữa kỳ', weight: 30, score: 9 },
      { name: 'Cuối kỳ', weight: 60, score: 8.5 },
    ],
  },
];

// Hạn được tạo ở lần mở đầu và lưu lại, không dời khi khởi động lại.
export function createInitialStudyState(now = new Date()): StudyState {
  const dueIn = (days: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    date.setHours(23, 59, 0, 0);
    return date.toISOString();
  };
  return {
    student: {
      id: 'B23DCCC076',
      fullName: 'Hoàng Văn Hùng',
      className: 'CNTT-UDU-D23',
      major: 'Công nghệ thông tin định hướng ứng dụng',
      email: 'HungHV.B23CC076@stu.ptit.edu.vn',
      phone: '0374585171',
    },
    assignments: [
      {
        id: 'assignment-1',
        courseId: 'RIPT1412',
        title: 'Xây dựng ứng dụng quản lý học tập',
        dueDate: dueIn(2),
        completed: false,
        description:
          'Xây dựng ứng dụng React Native có 5 tab, các màn hình chi tiết và lưu dữ liệu bằng AsyncStorage. Nộp mã nguồn kèm hướng dẫn chạy ứng dụng.',
      },
      {
        id: 'assignment-2',
        courseId: 'INT1448',
        title: 'Xây dựng REST API quản lý thư viện',
        dueDate: dueIn(4),
        completed: false,
        description:
          'Thiết kế dịch vụ quản lý sách và độc giả với các endpoint thêm, xem, sửa, xóa. Mô tả dữ liệu yêu cầu, phản hồi và mã trạng thái HTTP; nộp mã nguồn, tài liệu API và bộ yêu cầu Postman.',
      },
      {
        id: 'assignment-3',
        courseId: 'RIPT1411',
        title: 'Xây dựng trang Web quản lý công việc',
        dueDate: dueIn(0),
        completed: false,
        description:
          'Xây dựng giao diện Web có chức năng đăng nhập, thêm, sửa, xóa và tìm kiếm công việc. Tích hợp REST API, xử lý trạng thái đang tải, lỗi và danh sách rỗng; nộp mã nguồn kèm hướng dẫn chạy.',
      },
      {
        id: 'assignment-4',
        courseId: 'RIPT1413',
        title: 'Phân tích nghiệp vụ hệ thống đăng ký học phần',
        dueDate: dueIn(7),
        completed: false,
        description:
          'Xác định các bên liên quan, nhu cầu nghiệp vụ và quy tắc đăng ký học phần. Vẽ sơ đồ BPMN, xây dựng use case, user story kèm tiêu chí chấp nhận và lập tài liệu đặc tả yêu cầu.',
      },
      {
        id: 'assignment-5',
        courseId: 'INT1416',
        title: 'Thiết kế ca kiểm thử chức năng đăng nhập',
        dueDate: dueIn(-1),
        completed: false,
        description:
          'Áp dụng phân vùng tương đương và phân tích giá trị biên để thiết kế ca kiểm thử cho email và mật khẩu. Ghi rõ dữ liệu đầu vào, các bước thực hiện, kết quả mong đợi và báo cáo lỗi tìm được.',
      },
      {
        id: 'assignment-6',
        courseId: 'BAS1153',
        title: 'Thuyết trình về Cách mạng Tháng Tám năm 1945',
        dueDate: dueIn(5),
        completed: true,
        description:
          'Chuẩn bị bài thuyết trình nhóm về bối cảnh lịch sử, vai trò lãnh đạo của Đảng, diễn biến và ý nghĩa của Cách mạng Tháng Tám năm 1945. Nộp 5–7 slide kèm danh mục tài liệu tham khảo.',
      },
      {
        id: 'assignment-7',
        courseId: 'RIPT1412',
        title: 'Thực hành các thành phần React Native',
        dueDate: dueIn(-3),
        completed: true,
        description:
          'Tạo giao diện sử dụng View, Text, TextInput, Pressable và FlatList. Nộp ảnh chụp màn hình cùng mã nguồn.',
      },
    ],
  };
}
