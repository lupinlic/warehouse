# 📦 HỆ THỐNG KẾ TOÁN VẬT TƯ – VNPT YÊN BÁI

## 1. Giới thiệu

Dự án **Xây dựng phần mềm kế toán vật tư tại VNPT Yên Bái** là một hệ thống web nội bộ phục vụ quản lý vật tư, kho, nhập – xuất – kiểm kê và phân quyền người dùng.

Mục tiêu của dự án:

* Tin học hóa quy trình kế toán vật tư
* Phân quyền rõ ràng theo vai trò
* Giao diện giống các hệ ERP thực tế (tham chiếu ECOUNT)
* Phù hợp cho đồ án tốt nghiệp và có khả năng mở rộng thực tế

---

## 2. Công nghệ sử dụng

### Frontend

* **Next.js (App Router)**
* **TypeScript**
* **Tailwind CSS v4**
* **Zustand** (state management)
* **Axios** (chuẩn bị cho API)

### Backend (dự kiến)

* **NestJS**
* **MySQL**
* **JWT / Cookie-based Auth**

> ⚠️ Hiện tại dự án **chưa có backend**, toàn bộ dữ liệu đang được **mock** ở frontend.

---

## 3. Các tác nhân (Actors)

Hệ thống có **3 vai trò chính**:

1. **Kế toán vật tư**
2. **Thủ kho**
3. **Quản lý**

Mỗi vai trò có quyền truy cập các chức năng khác nhau.

---

## 4. Chức năng chính

### 4.1 Quản lý danh mục

* Vật tư
* Kho
* Nhà cung cấp
* Người dùng

### 4.2 Nghiệp vụ kho

* Nhập kho
* Xuất kho
* Cập nhật tồn kho tự động

### 4.3 Kiểm kê

* Đối chiếu tồn kho hệ thống & thực tế
* Lập biên bản kiểm kê

### 4.4 Báo cáo

* Báo cáo tồn kho
* Báo cáo nhập – xuất

### 4.5 Hệ thống

* Đăng nhập
* Phân quyền
* Nhật ký thao tác (dự kiến)

---

## 5. Phân quyền (RBAC)

Hệ thống hỗ trợ 3 vai trò chính với quyền hạn khác nhau:

### Bảng Phân quyền Chi tiết

| Chức năng | Kế toán | Thủ kho | Quản lý |
|-----------|---------|---------|---------|
| **Danh mục** | | | |
| Quản lý vật tư | ✅ View, Add, Edit | ✅ View Only | ✅ Full |
| Quản lý kho | ✅ View | ✅ View, Edit | ✅ Full |
| Quản lý nhà cung cấp | ✅ View, Add, Edit | ❌ | ✅ Full |
| Quản lý người dùng | ❌ | ❌ | ✅ Full |
| **Nghiệp vụ** | | | |
| Phiếu nhập | ✅ View, Add, Confirm | ✅ View | ✅ Full |
| Phiếu xuất | ✅ View | ✅ Add, Confirm | ✅ Full |
| Kiểm kê | ✅ View | ✅ Add, Submit | ✅ Full |
| **Báo cáo** | | | |
| Báo cáo nhập-xuất | ✅ View, Export | ❌ | ✅ Full |
| Báo cáo tồn kho | ✅ View, Export | ✅ View, Export | ✅ Full |
| **Hệ thống** | | | |
| Xem nhật ký | ❌ | ❌ | ✅ Full |

### Định nghĩa Permissions

Định nghĩa tại: `src/utils/permission.ts`

```typescript
export const ROLE_PERMISSIONS = {
  accountant: {
    materials: ['view', 'create', 'edit'],
    warehouses: ['view'],
    suppliers: ['view', 'create', 'edit'],
    imports: ['view', 'create', 'confirm'],
    reports: ['view', 'export'],
  },
  storekeeper: {
    materials: ['view'],
    warehouses: ['view', 'edit'],
    exports: ['view', 'create', 'confirm'],
    stocktakes: ['view', 'create'],
  },
  manager: {
    all: true, // Toàn bộ quyền
  },
}
```

### Hiển thị trên UI

Sidebar và các component sẽ:

* Mục **được phép** → hiển thị bình thường
* Mục **không được phép** → ẩn hoặc hiển thị với icon 🔒, vô hiệu hóa

---

## 6. Cấu trúc Cơ sở dữ liệu

### Các bảng chính (Tables)

#### Quản lý Người Dùng & Vai Trò

**users**
```
- id, username, password, name, email, phone
- role_id, warehouse_id
- is_active, created_at, updated_at
```

**roles**
```
- id, code, name, description
```

#### Quản lý Danh Mục

**materials**
```
- id, code, name, unit, price
- category, description, is_active
- created_at, updated_at
```

**warehouses**
```
- id, code, name, address, phone
- manager_id (FK users)
- is_active, created_at, updated_at
```

**suppliers**
```
- id, code, name, phone, email, address
- tax_id, bank_account
- is_active, created_at, updated_at
```

**warehouse_inventory**
```
- id, warehouse_id, material_id
- quantity, last_updated
```

#### Phiếu Nhập Xuất

**import_receipts & import_items**
```
- receipt: id, code, date, supplier_id, warehouse_id
  created_by, total, status, note, created_at, updated_at
- items: id, receipt_id, material_id, quantity, price
```

**export_receipts & export_items**
```
- receipt: id, code, date, warehouse_id, reason
  created_by, total, status, note, created_at, updated_at
- items: id, receipt_id, material_id, quantity, price
```

#### Kiểm Kê

**stocktake_records & stocktake_items**
```
- record: id, code, date, warehouse_id, created_by
  note, status, approved_by, approved_at, created_at, updated_at
- items: id, record_id, material_id, system_qty, actual_qty
  difference (generated), status (match/mismatch)
```

#### Nhật Ký Thao Tác (Optional)

**audit_logs**
```
- id, user_id, action, entity_type, entity_id
- old_value, new_value, ip_address, created_at
```

---

## 6. Cấu trúc thư mục Frontend

```
src/
├── app/
│   ├── (auth)/login/
│   ├── (dashboard)/
│   │   ├── materials/
│   │   ├── warehouses/
│   │   ├── suppliers/
│   │   ├── imports/
│   │   ├── exports/
│   │   ├── stocktakes/
│   │   ├── reports/
│   │   └── users/
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── layout/ (Sidebar, Header)
│   ├── table/ (ReusableTable)
│   └── ui/ (Button, Input – dự kiến)
│
├── mock/
│   ├── users.mock.ts
│   ├── materials.mock.ts
│   ├── warehouses.mock.ts
│   └── ...
│
├── store/
│   └── auth.store.ts
│
├── types/
│   ├── role.ts
│   └── entities.ts
│
├── utils/
│   ├── permission.ts
│   └── auth-cookie.ts
```

---

## 7. Xác thực & Middleware

### Đăng nhập

* Dùng **mock users**
* Khi login thành công:

  * Lưu user vào Zustand
  * Set cookie `user`

### Middleware

File:

```
src/middleware.ts
```

Chức năng:

* Nếu **chưa login** → redirect `/login`
* Nếu đã login → cho phép truy cập

---

## 8. Giao diện & UI

### Phong cách thiết kế

* Tham chiếu **ECOUNT ERP**
* Màu chủ đạo: **xanh dương nhạt**
* Nền trắng/xám nhạt
* Font nhỏ, dễ đọc (chuẩn ERP)

### Global style

Định nghĩa toàn bộ tại:

```
src/app/globals.css
```

Bao gồm:

* Color system
* Button
* Table
* Form
* Sidebar

---

## 9. Tiến độ hiện tại

✅ Hoàn thành:

* Phân tích nghiệp vụ
* Use case, sequence (Mermaid)
* Thiết kế database (logic)
* Cấu trúc dự án Next.js
* Mock data toàn bộ module
* Login + phân quyền
* Sidebar theo quyền
* Global CSS theo ERP

⚠️ Đang làm:

* Table component tái sử dụng
* Render dữ liệu mock ra từng trang

❌ Chưa làm:

* Backend NestJS
* API thật
* Báo cáo nâng cao

---

## 10. Hướng dẫn tiếp tục phát triển (CHO AI / DEV KHÁC)

Khi đọc dự án này, AI hoặc dev tiếp theo nên làm theo thứ tự:

1. Hoàn thiện **ReusableTable component**
2. Gắn table cho từng page (materials, suppliers, ...)
3. Làm CRUD bằng mock data
4. Tạo layout giống ERP (header + tab)
5. Sau đó mới chuyển sang **NestJS backend**

---

## 11. Ghi chú quan trọng

* Không xoá middleware
* Không hardcode quyền trong component
* Luôn lấy quyền từ `PERMISSIONS`
* Ưu tiên UI đơn giản – giống phần mềm kế toán thật

---

## 12. Tác giả

Sinh viên thực hiện đồ án: **Xây dựng phần mềm kế toán vật tư tại VNPT Yên Bái**

---

📌 *README này được viết để bất kỳ AI hoặc lập trình viên nào đọc vào cũng hiểu ngay dự án đang ở đâu và có thể tiếp tục phát triển mà không cần hỏi lại từ đầu.*
