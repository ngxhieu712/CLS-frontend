# Báo Cáo Hiện Trạng API Phía Frontend (FE)

> **Dự án:** Champion League System  
> **Thời gian khảo sát:** 17/10/2026  
> **Frontend Stack:** React 19 + Vite + TypeScript + TanStack Query v5 + Axios + Tailwind CSS v4

---

## 1. Kiến Trúc & Cấu Hình HTTP Client

Hệ thống Frontend quản lý toàn bộ các tương tác mạng thông qua cấu hình HTTP tập trung duy nhất tại `FE/src/shared/api/http.ts`.

### Chi tiết cấu hình
* **Base URL:** `import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5003/api'`
* **Timeout:** `15000ms` (15 giây).
* **Request Interceptor:** Tự động kiểm tra và gắn header `Authorization: Bearer <token>` từ `tokenStore` (`localStorage.getItem('auth_token')`).
* **Response Interceptor:** Khi nhận phản hồi lỗi có HTTP status `401 Unauthorized`, hệ thống tự động dọn sạch token trong bộ nhớ và redirect người dùng về trang `/logout`.

---

## 2. Danh Mục Các API Client Đang Hoạt Động

Hiện tại Frontend đã cài đặt sẵn các file API client cho các module cốt lõi sau:

### 2.1. Authentication API (`FE/src/modules/auth/api/auth.api.ts`)

| Method | Endpoint | Hàm trong API | Mục đích & Chi tiết |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | `registerTeamManager(payload)` | Đăng ký quản lý đội, gửi kèm thông tin tài khoản và đội bóng. |
| `POST` | `/auth/register/verify-otp` | `verifyRegisterOtp(email, otp)` | Kích hoạt tài khoản bằng mã OTP 6 số gửi qua email. |
| `PATCH` | `/auth/resubmit` | `resubmitProfile(payload)` | Nộp lại hồ sơ đội bóng khi bị Admin từ chối. |
| `POST` | `/auth/login` | `login(payload)` | Đăng nhập tài khoản bằng email & password. |
| `POST` | `/auth/login/verify-otp` | `verifyLoginOtp(email, otp)` | Xác thực mã OTP bước 2 (2FA) nếu tài khoản bật OTP. |
| `POST` | `/auth/forgot-password` | `forgotPassword(email)` | Yêu cầu gửi mã đặt lại mật khẩu qua email. |
| `POST` | `/auth/reset-password` | `resetPassword(email, token, newPassword)` | Đặt mật khẩu mới bằng mã reset token. |
| `GET` | `/auth/me` | `getMe()` | Lấy thông tin user hiện tại (được cache qua hook `useCurrentUser`). |

---

### 2.2. Profile & Security API (`FE/src/modules/profile/api/profile.api.ts`)

| Method | Endpoint | Hàm trong API | Mục đích & Chi tiết |
| :--- | :--- | :--- | :--- |
| `PATCH` | `/profile` | `updateProfile(data)` | Cập nhật thông tin: `displayName`, `bio`, `phone`. |
| `PATCH` | `/profile/security` | `updateSecurity(data)` | Bật / tắt xác thực OTP khi đăng nhập (`loginOtpEnabled`). |
| `POST` | `/profile/avatar` | `uploadAvatar(file)` | Tải lên avatar qua `multipart/form-data`, trả về URL ảnh. |

---

### 2.3. Admin Management API (`FE/src/modules/admin/api/admin.api.ts`)

| Method | Endpoint | Hàm trong API | Mục đích & Chi tiết |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/stats` | `stats()` | Lấy thống kê số lượng tài khoản, phân quyền. |
| `GET` | `/admin/users` | `listUsers(params)` | Danh sách tài khoản có tìm kiếm, phân trang và lọc theo role. |
| `PATCH` | `/admin/users/:id` | `updateUser(id, input)` | Chỉnh sửa quyền (`role`), trạng thái của user. |
| `DELETE` | `/admin/users/:id` | `deleteUser(id)` | Xóa vĩnh viễn một người dùng. |
| `POST` | `/admin/users/bulk-delete` | `bulkDeleteUsers(ids)` | Xóa đồng loạt nhiều tài khoản theo danh sách `ids`. |

---

### 2.4. Trợ Lý AI Chat API (`FE/src/modules/chat/api/chat.api.ts`)

| Method | Endpoint | Hàm trong API | Mục đích & Chi tiết |
| :--- | :--- | :--- | :--- |
| `POST` | `/chat` | `send(messages)` | Gửi chuỗi tin nhắn trò chuyện với bot tư vấn Google Gemini. |

---

### 2.5. Module Tham Khảo Notes API (`FE/src/modules/notes/api/notes.api.ts`)

| Method | Endpoint | Hàm trong API | Mục đích & Chi tiết |
| :--- | :--- | :--- | :--- |
| `GET` | `/notes` | `list(params)` | Lấy danh sách ghi chú phân trang + tìm kiếm. |
| `GET` | `/notes/:id` | `get(id)` | Lấy chi tiết một ghi chú. |
| `POST` | `/notes` | `create(input)` | Thêm mới ghi chú. |
| `PATCH` | `/notes/:id` | `update(id, input)` | Cập nhật ghi chú. |
| `DELETE` | `/notes/:id` | `remove(id)` | Xóa ghi chú. |

---

## 3. Tình Trạng Các Module Nghiệp Vụ Giải Đấu (Tournament / Esports)

Các module nghiệp vụ bóng đá / Esports đã được triển khai đầy đủ về mặt giao diện (UI) và routing trong `FE/src/app/modules.ts`:

| Module | Các trang chức năng (Pages) | Tình trạng API | Nguồn dữ liệu hiện tại |
| :--- | :--- | :--- | :--- |
| **`tournament`** | `AdminDashboardPage`, `TeamApprovalPage`, `DrawPage`, `PlayoffBracketPage`, `TeamManagementPage`, `TournamentSettingsPage` | **Chưa có API** | `MOCK_TOURNAMENT`, `MOCK_APPLICATIONS`, `MOCK_TEAMS` (`FE/src/shared/lib/mock-data.ts`) |
| **`team`** | `TeamDashboardPage`, `TeamProfilePage`, `RosterPage`, `TeamSchedulePage` | **Chưa có API** | Dữ liệu tĩnh / State nội bộ |
| **`referee`** | `RefereeDashboardPage`, `MatchControlPage` | **Chưa có API** | `MOCK_MATCHES` |
| **`editor`** | `RecordingManagementPage` | **Chưa có API** | `MOCK_MATCHES` |
| **`public`** | `HomePage`, `SchedulePage`, `GroupsPage`, `BracketPage`, `TeamsPage`, `MatchDetailPage` | **Chưa có API** | `MOCK_GROUPS`, `MOCK_MATCHES`, `MOCK_TEAMS` |

> [!IMPORTANT]
> Toàn bộ các module bóng đá / giải đấu hiện **chưa có file `.api.ts` hay hook Query riêng** (chưa có `tournament.api.ts`, `match.api.ts`, `team.api.ts`, v.v.). Các trang đang xử lý logic cục bộ (local state `useState`) trên nền dữ liệu mẫu tĩnh.

---

## 4. Các Điểm Bất Đồng Bộ Cần Khắc Phục Giữa FE Và BE

1. **Endpoint `PATCH /api/auth/resubmit`**:
   * **FE:** Đã có trong `auth.api.ts` để nộp lại hồ sơ đội bóng.
   * **BE:** `BE/src/routes/auth.route.ts` chưa đăng ký endpoint này.
2. **Payload Đăng ký Đội `POST /api/auth/register`**:
   * **FE:** `RegisterPage.tsx` gửi lên form 2 bước gồm cả thông tin user lẫn thông tin đội bóng (`displayName`, `email`, `password`, `teamName`, `teamTag`, `teamEmail`, `teamPhone`, `teamOrganization`).
   * **BE:** `registerSchema` trong `BE/src/validators/auth.validator.ts` hiện tại chỉ mới nhận diện `{ email, password }`.
3. **Mô hình User & Vai trò (Role)**:
   * **BE:** `BE/src/models/user.model.ts` đã định nghĩa các vai trò mới: `['admin', 'teamManager', 'referee', 'editor']`.
   * **FE:** Đã sẵn sàng các route tương ứng nhưng cần bổ sung các API tương ứng phía BE để lưu trữ đội bóng, trận đấu và cầu thủ.

---

## 5. Đề Xuất Kế Hoạch Tiếp Theo

1. **Chuẩn hóa API Auth & Team Registration:** Cập nhật controller và validator phía Backend để tiếp nhận đầy đủ `TeamRegistrationPayload` khi người dùng đăng ký, đồng thời bổ sung route `PATCH /api/auth/resubmit`.
2. **Xây dựng API cho các thực thể giải đấu:**
   * `team.api.ts`: Quản lý thông tin đội, logo, danh sách cầu thủ (roster).
   * `tournament.api.ts`: Quản lý giải đấu, phê duyệt hồ sơ đội, bốc thăm chia bảng, tạo lịch.
   * `match.api.ts`: Lịch thi đấu, cập nhật kết quả trực tiếp của trọng tài, video highlight của editor.
3. **Chuyển đổi UI từ Mock Data sang React Query:** Thay thế việc import trực tiếp từ `mock-data.ts` bằng các hook `useQuery` và `useMutation` tương tự kiến trúc chuẩn của module `notes` và `admin`.

