# Sổ tay học tập

Ứng dụng quản lý học tập bằng React Native CLI + TypeScript

## Chạy dự án

Cần Node.js >= 22.11, Yarn, JDK và Android SDK tương thích với cấu hình React Native sẵn có.

```sh
yarn install
yarn start
```

Mở terminal khác:

```sh
yarn android
```

Với iOS, chạy trên macOS, cài Pods sau khi cài thư viện rồi chạy ứng dụng:

```sh
bundle install
cd ios
bundle exec pod install
cd ..
yarn ios
```

## Cấu trúc và các đường dẫn mới

```text
App.tsx
src/
  navigation/
    AppNavigator.tsx                 # Native Stack bao ngoài
    StudyTabNavigator.tsx            # 5 Bottom Tabs
  screens/
    OverviewScreen/index.tsx         # Tổng quan học tập
    CoursesScreen/index.tsx          # Môn học, tìm kiếm và lọc
    ScheduleScreen/index.tsx         # Thời khóa biểu theo tuần và ngày
    AssignmentsScreen/index.tsx      # Bài tập, cập nhật trạng thái
    ProfileScreen/index.tsx          # Hồ sơ, chỉnh sửa và kết quả học tập
    CourseDetailScreen/index.tsx
    SessionDetailScreen/index.tsx
    AssignmentDetailScreen/index.tsx
    GradeDetailScreen/index.tsx
  components/study/
    StudyUI.tsx                      # Thành phần dùng chung và trạng thái UI
    CourseCard.tsx
    SessionCard.tsx
    AssignmentCard.tsx
  contexts/StudyContext.tsx          # Trạng thái chung, khôi phục và lưu
  data/studyData.ts                  # Dữ liệu mẫu liên kết bằng ID
  services/studyStorage.ts           # AsyncStorage có phiên bản và kiểm tra dữ liệu
  hooks/useStudyClock.ts             # Cập nhật thời gian khi quay lại app
  types/study.ts
  types/navigation.ts               # Kiểu tham số của Tab và Stack
  theme/studyTheme.ts                # Màu sắc, chữ và khoảng cách dùng chung
  utils/studyUtils.ts                # Tìm kiếm, lịch, điểm và kiểm tra form
__tests__/
```

Mã nguồn chỉ giữ các màn hình, thành phần, hook, service và kiểu dữ liệu phục vụ quản lý học tập. Các file `index.ts` trong `hooks`, `types` và `utils` xuất các thành phần học tập tương ứng. Giữ nguyên tên thư mục native để tương thích với cấu hình build đã có.

## Điều hướng

```text
NavigationContainer
└── AppNavigator (Native Stack)
    ├── MainTabs (Bottom Tabs)
    │   ├── Overview     → Tổng quan
    │   ├── Courses      → Môn học
    │   ├── Schedule     → Thời khóa biểu (nhãn ngắn: Lịch học)
    │   ├── Assignments  → Bài tập
    │   └── Profile      → Cá nhân và kết quả học tập
    ├── CourseDetail     { courseId }
    ├── SessionDetail    { sessionId, date }
    ├── AssignmentDetail { assignmentId }
    └── GradeDetail      { resultId }
```

Stack nằm ngoài Tab nên màn chi tiết phủ thanh tab; nút quay lại và nút Back Android trở về màn trước. Route chỉ truyền ID/ngày, lấy bản ghi mới nhất từ dữ liệu chung, nên cập nhật bài tập đồng bộ ở tổng quan, danh sách và chi tiết.

## Chức năng

- Tổng quan: họ tên, mã sinh viên, môn đang học, bài sắp đến hạn và thông báo bài quá hạn.
- Môn học: FlatList, tìm theo tên/mã có hoặc không dấu, lọc đang học/đã học, mở chi tiết.
- Thời khóa biểu: chọn ngày trong tuần, tuần trước/sau, trở về tuần này; xem giờ, phòng và ghi chú buổi học.
- Bài tập: tìm theo tên/môn, lọc tất cả/chưa xong/đã xong/quá hạn; tick trạng thái ở danh sách hoặc chi tiết.
- Cá nhân: xem thông tin, chỉnh họ tên/email/điện thoại, kiểm tra form; xem GPA học kỳ và chi tiết điểm thành phần.
- Có trạng thái đang tải, danh sách rỗng, không tìm thấy bản ghi và lỗi lưu/đọc dữ liệu với nút thử lại.

## Dữ liệu và lưu trữ

Dữ liệu là **mẫu minh họa**, chưa kết nối hệ thống nhà trường: 6 môn đang học, 8 buổi học mỗi tuần, 7 bài tập, 4 kết quả học kỳ trước. Tổng số tín chỉ và GPA được tính từ dữ liệu hiện tại. Chỉnh dữ liệu trong `src/data/studyData.ts`.

- Lịch mẫu áp dụng từ **07/09/2026 đến 17/01/2027**; ngoài khoảng này hiển thị không có lịch.
- Hạn bài tập sinh theo ngày mở ứng dụng đầu tiên để demo đủ các trạng thái, sau đó được lưu cố định.
- Hồ sơ và danh sách bài tập được lưu trong AsyncStorage với key `@tkgdnd/study/v1`. Dữ liệu được khôi phục khi mở lại; các lượt ghi được xếp hàng để tránh mất thay đổi khi thao tác liên tiếp.
- Dữ liệu lưu mới dùng phiên bản 2 và vẫn đọc được bản 1. Hồ sơ mẫu được đối chiếu với bản gốc đã lưu: trường chưa sửa trong ứng dụng cập nhật theo `studyData.ts`; họ tên, email và điện thoại đã sửa trong màn Cá nhân được giữ lại. Mã sinh viên, lớp và ngành luôn lấy từ dữ liệu mẫu hiện tại. Nếu đổi mã sinh viên trong dữ liệu mẫu, hồ sơ mới được dùng toàn bộ.
- Nội dung và mã môn của bài tập luôn lấy từ `studyData.ts`, ghép với hạn nộp và trạng thái đã lưu theo ID bài tập. Bài mới được thêm, bài đã bỏ khỏi dữ liệu mẫu không hiển thị nữa.
- Nếu không đọc được cache, ứng dụng hiển thị lý do và cho thử lại hoặc khôi phục mẫu có xác nhận. Nút **Khôi phục dữ liệu mẫu** cũng nằm trong màn Cá nhân, dùng khi muốn lấy lại toàn bộ dữ liệu từ `studyData.ts`. Bản lưu trước khi khôi phục được sao lưu tại key `@tkgdnd/study/v1/backup`. Nếu ghi thất bại, hiển thị thông báo thay đổi chỉ còn trong phiên hiện tại và cho thử lại.
- Điểm tổng kết = tổng điểm thành phần × trọng số. Quy đổi mẫu: A từ 8,5 (4 điểm), B từ 7 (3), C từ 5,5 (2), D từ 4 (1), F dưới 4 (0). GPA là trung bình điểm hệ 4 theo tín chỉ của các môn đã có kết quả, không phải GPA tích lũy toàn khóa.
- Giao diện sáng, một cột, dùng font hệ thống có hỗ trợ tiếng Việt. Đổi màu thương hiệu và kiểu chữ chung tại `src/theme/studyTheme.ts`.

## Kiểm tra

```sh
yarn typecheck
yarn lint:study
yarn test --runInBand
```

`yarn lint` quét toàn bộ dự án. `lint:study` quét mã của ứng dụng học tập và các bài kiểm thử.

Kiểm tra thủ công: tìm `lap trinh web`; tìm một từ không tồn tại và xóa bộ lọc; chọn Chủ nhật/tuần ngoài học kỳ; tick bài tập và kiểm tra ở màn chi tiết/tổng quan; sửa hồ sơ rồi đóng mở ứng dụng; mở điểm một môn và quay lại bằng nút Back.

Sau khi thay `metro.config.js`, dừng Metro hiện tại rồi chạy `yarn start --reset-cache` và tải lại ứng dụng. Cấu hình resolver xử lý riêng đường dẫn `ReactNativeFeatureFlags` mà `@react-native/virtualized-lists` đang nhập từ React Native 0.87.1.
