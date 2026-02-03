# 📦 HỆ THỐNG KẾ TOÁN VẬT TƯ – VNPT YÊN BÁI

> Xây dựng phần mềm kế toán vật tư cho VNPT Yên Bái - Hệ thống quản lý vật tư, kho, nhập-xuất-kiểm kê và phân quyền người dùng

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Cấu trúc cơ sở dữ liệu](#-cấu-trúc-cơ-sở-dữ-liệu)
- [Phân quyền (RBAC)](#-phân-quyền-rbac)
- [Chức năng chính](#-chức-năng-chính)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt và chạy](#-cài-đặt-và-chạy)
- [API Endpoints](#-api-endpoints)
- [Hướng dẫn phát triển](#-hướng-dẫn-phát-triển)

---

## 🎯 Giới thiệu

Dự án **Hệ thống kế toán vật tư tại VNPT Yên Bái** là một ứng dụng web được xây dựng nhằm:

✅ Tin học hóa quy trình kế toán vật tư
✅ Phân quyền rõ ràng theo vai trò (Kế toán, Thủ kho, Quản lý)
✅ Giao diện giống các hệ ERP thực tế (tham chiếu ECOUNT)
✅ Phù hợp cho đồ án tốt nghiệp và có khả năng mở rộng thực tế
✅ Dễ bảo trì và phát triển trong tương lai

---

## 🛠 Công nghệ sử dụng

### Frontend (`/fe`)

| Công nghệ | Phiên bản | Mục đích |
|-----------|----------|---------|
| **Next.js** | 16.1.2 | Framework React với App Router |
| **React** | 19.2.3 | Thư viện UI |
| **TypeScript** | ^5 | Type safety |
| **Tailwind CSS** | ^4.1.18 | Styling & UI utilities |
| **Zustand** | ^5.0.10 | State management |
| **Axios** | ^1.13.2 | HTTP client |
| **TanStack React Query** | ^5.90.19 | Server state management |
| **Recharts** | ^3.7.0 | Biểu đồ & visualization |
| **Lucide React** | ^0.562.0 | Icon library |
| **Sonner** | ^2.0.7 | Toast notifications |

### Backend (`/be`)

| Công nghệ | Phiên bản | Mục đích |
|-----------|----------|---------|
| **NestJS** | ^11.0.1 | Framework Node.js |
| **TypeScript** | ^5 | Type safety |
| **MySQL** | (sắp tới) | Cơ sở dữ liệu |
| **JWT** | (sắp tới) | Authentication |

---

## 🏗 Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  - Dashboard, Materials, Warehouses, Suppliers        │ │
│  │  - Import/Export Receipts, Stocktake, Reports         │ │
│  │  - Authentication, RBAC, UI Components                │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↕
                         (Axios HTTP)
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND (NestJS)                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  - REST API Controllers                               │ │
│  │  - Business Logic Services                            │ │
│  │  - Database Models & Repositories                     │ │
│  │  - Authentication & Authorization                     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↕
                         (MySQL Driver)
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (MySQL)                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  - Users, Materials, Warehouses, Suppliers            │ │
│  │  - Import/Export Receipts, Stocktake Records          │ │
│  │  - Audit Logs                                          │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Cấu trúc Cơ sở dữ liệu

### Sơ đồ ER (Entity-Relationship)

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│    users     │      │  materials   │      │ warehouses   │
├──────────────┤      ├──────────────┤      ├──────────────┤
│ id (PK)      │      │ id (PK)      │      │ id (PK)      │
│ username     │      │ code         │      │ code         │
│ password     │      │ name         │      │ name         │
│ name         │      │ unit         │      │ address      │
│ email        │      │ price        │      │ phone        │
│ phone        │      │ quantity     │      │ manager_id   │
│ role_id (FK) │      │ category     │      │ is_active    │
│ warehouse_id │      │ description  │      │ created_at   │
│ is_active    │      │ created_at   │      │ updated_at   │
│ created_at   │      │ updated_at   │      └──────────────┘
│ updated_at   │      └──────────────┘             ↑
└──────────────┘              ↑                    │
       ↑                      │ (1:N)              │ (1:N)
       │                      ↓                    │
       │      ┌──────────────────────────┐         │
       └──────│ warehouse_inventory      │         │
              ├──────────────────────────┤         │
              │ id (PK)                  │         │
              │ warehouse_id (FK)        ├─────────┘
              │ material_id (FK)         ├─────────┐
              │ quantity                 │         │
              │ last_updated             │         │
              └──────────────────────────┘         │
                                                   │
┌──────────────┐      ┌──────────────┐            │
│  suppliers   │      │ import_items │            │
├──────────────┤      ├──────────────┤            │
│ id (PK)      │      │ id (PK)      │            │
│ code         │      │ receipt_id   │            │
│ name         │      │ material_id  │────────────┘
│ phone        │      │ quantity     │
│ email        │      │ price        │
│ address      │      └──────────────┘
│ tax_id       │             ↑
│ bank_account │             │
│ is_active    │      ┌──────┴───────┐
│ created_at   │      │              │
│ updated_at   │ ┌────┴──────────────┴─────────┐
└──────────────┘ │   import_receipts          │
                 ├────────────────────────────┤
                 │ id (PK)                    │
                 │ code                       │
                 │ date                       │
                 │ supplier_id (FK)           │
                 │ warehouse_id (FK)          │
                 │ created_by (FK - users)    │
                 │ total                      │
                 │ status                     │
                 │ note                       │
                 │ created_at                 │
                 │ updated_at                 │
                 └────────────────────────────┘

┌──────────────────────────────┐  ┌──────────────────────────────┐
│ export_receipts              │  │ export_items                 │
├──────────────────────────────┤  ├──────────────────────────────┤
│ id (PK)                      │  │ id (PK)                      │
│ code                         │  │ receipt_id (FK)              │
│ date                         │  │ material_id (FK)             │
│ warehouse_id (FK)            │  │ quantity                     │
│ reason                       │  │ price                        │
│ created_by (FK - users)      │  └──────────────────────────────┘
│ total                        │
│ status                       │
│ note                         │
│ created_at                   │
│ updated_at                   │
└──────────────────────────────┘

┌──────────────────────────────┐  ┌──────────────────────────────┐
│ stocktake_records            │  │ stocktake_items              │
├──────────────────────────────┤  ├──────────────────────────────┤
│ id (PK)                      │  │ id (PK)                      │
│ code                         │  │ record_id (FK)               │
│ date                         │  │ material_id (FK)             │
│ warehouse_id (FK)            │  │ system_qty                   │
│ created_by (FK - users)      │  │ actual_qty                   │
│ note                         │  │ difference                   │
│ status                       │  │ status (match/mismatch)      │
│ approved_by (FK - users)     │  └──────────────────────────────┘
│ approved_at                  │
│ created_at                   │
│ updated_at                   │
└──────────────────────────────┘

┌──────────────────────────────┐
│ audit_logs                   │
├──────────────────────────────┤
│ id (PK)                      │
│ user_id (FK)                 │
│ action                       │
│ entity_type                  │
│ entity_id                    │
│ old_value                    │
│ new_value                    │
│ ip_address                   │
│ created_at                   │
└──────────────────────────────┘
```

### Chi tiết các bảng (Tables)

#### 1. **users** - Người dùng hệ thống

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL (hashed),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20),
  role_id INT NOT NULL,
  warehouse_id INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
);

-- Dữ liệu mẫu
INSERT INTO users VALUES
(1, 'ketoan', 'hash(123456)', 'Nguyễn Văn A', 'ketoan@vnpt.vn', '0912345678', 1, 1, true, NOW(), NOW()),
(2, 'thukho', 'hash(123456)', 'Trần Văn B', 'thukho@vnpt.vn', '0987654321', 2, 1, true, NOW(), NOW()),
(3, 'quanly', 'hash(123456)', 'Lê Văn C', 'quanly@vnpt.vn', '0909090909', 3, NULL, true, NOW(), NOW());
```

#### 2. **roles** - Vai trò người dùng

```sql
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255)
);

-- Dữ liệu mẫu
INSERT INTO roles VALUES
(1, 'accountant', 'Kế toán vật tư', 'Quản lý danh mục, nhập/xuất, báo cáo'),
(2, 'storekeeper', 'Thủ kho', 'Quản lý kho, kiểm kê'),
(3, 'manager', 'Quản lý', 'Toàn bộ quyền');
```

#### 3. **materials** - Vật tư

```sql
CREATE TABLE materials (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  price DECIMAL(15, 2) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Dữ liệu mẫu
INSERT INTO materials VALUES
(1, 'VT001', 'Cáp quang', 'Cuộn', 20000, 'Viễn thông', 'Cáp quang đơn mô', true, NOW(), NOW()),
(2, 'VT002', 'Modem GPON', 'Cái', 500000, 'Thiết bị', 'Modem truy cập mạng', true, NOW(), NOW());
```

#### 4. **warehouses** - Kho

```sql
CREATE TABLE warehouses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  manager_id INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (manager_id) REFERENCES users(id)
);

-- Dữ liệu mẫu
INSERT INTO warehouses VALUES
(1, 'KHO01', 'Kho trung tâm', 'TP Yên Bái', '0216123456', 2, true, NOW(), NOW()),
(2, 'KHO02', 'Kho chi nhánh', 'Huyện Văn Yên', '0216654321', 2, true, NOW(), NOW());
```

#### 5. **suppliers** - Nhà cung cấp

```sql
CREATE TABLE suppliers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  address VARCHAR(255) NOT NULL,
  tax_id VARCHAR(20),
  bank_account VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Dữ liệu mẫu
INSERT INTO suppliers VALUES
(1, 'NCC01', 'Công ty Thiết bị Viễn thông A', '0912345678', 'contact@viettel-a.vn', 'Hà Nội', '0123456789', '0123456789123456', true, NOW(), NOW()),
(2, 'NCC02', 'Công ty CNTT B', '0987654321', 'info@cnttb.vn', 'Yên Bái', '0987654321987654', '9876543210987654', true, NOW(), NOW());
```

#### 6. **warehouse_inventory** - Tồn kho theo kho

```sql
CREATE TABLE warehouse_inventory (
  id INT PRIMARY KEY AUTO_INCREMENT,
  warehouse_id INT NOT NULL,
  material_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE,
  UNIQUE KEY unique_warehouse_material (warehouse_id, material_id)
);
```

#### 7. **import_receipts** - Phiếu nhập kho

```sql
CREATE TABLE import_receipts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL,
  date DATE NOT NULL,
  supplier_id INT NOT NULL,
  warehouse_id INT NOT NULL,
  created_by INT NOT NULL,
  total DECIMAL(15, 2) NOT NULL,
  status ENUM('draft', 'confirmed', 'cancelled') DEFAULT 'draft',
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);
```

#### 8. **import_items** - Chi tiết phiếu nhập

```sql
CREATE TABLE import_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  receipt_id INT NOT NULL,
  material_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(15, 2) NOT NULL,
  FOREIGN KEY (receipt_id) REFERENCES import_receipts(id) ON DELETE CASCADE,
  FOREIGN KEY (material_id) REFERENCES materials(id)
);
```

#### 9. **export_receipts** - Phiếu xuất kho

```sql
CREATE TABLE export_receipts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL,
  date DATE NOT NULL,
  warehouse_id INT NOT NULL,
  reason VARCHAR(255) NOT NULL,
  created_by INT NOT NULL,
  total DECIMAL(15, 2) NOT NULL,
  status ENUM('draft', 'confirmed', 'cancelled') DEFAULT 'draft',
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);
```

#### 10. **export_items** - Chi tiết phiếu xuất

```sql
CREATE TABLE export_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  receipt_id INT NOT NULL,
  material_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(15, 2) NOT NULL,
  FOREIGN KEY (receipt_id) REFERENCES export_receipts(id) ON DELETE CASCADE,
  FOREIGN KEY (material_id) REFERENCES materials(id)
);
```

#### 11. **stocktake_records** - Phiếu kiểm kê

```sql
CREATE TABLE stocktake_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL,
  date DATE NOT NULL,
  warehouse_id INT NOT NULL,
  created_by INT NOT NULL,
  note TEXT,
  status ENUM('draft', 'completed', 'approved') DEFAULT 'draft',
  approved_by INT,
  approved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (approved_by) REFERENCES users(id)
);
```

#### 12. **stocktake_items** - Chi tiết phiếu kiểm kê

```sql
CREATE TABLE stocktake_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  record_id INT NOT NULL,
  material_id INT NOT NULL,
  system_qty INT NOT NULL,
  actual_qty INT NOT NULL,
  difference INT GENERATED ALWAYS AS (actual_qty - system_qty) STORED,
  status ENUM('match', 'mismatch') GENERATED ALWAYS AS (
    CASE WHEN actual_qty = system_qty THEN 'match' ELSE 'mismatch' END
  ) STORED,
  FOREIGN KEY (record_id) REFERENCES stocktake_records(id) ON DELETE CASCADE,
  FOREIGN KEY (material_id) REFERENCES materials(id)
);
```

#### 13. **audit_logs** - Nhật ký thao tác (Optional)

```sql
CREATE TABLE audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT NOT NULL,
  old_value JSON,
  new_value JSON,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 👥 Phân quyền (RBAC)

### Bảng Phân quyền

| Chức năng | Kế toán | Thủ kho | Quản lý |
|-----------|---------|---------|---------|
| **Danh mục** | | | |
| Quản lý vật tư | ✅ View, Add, Edit | ✅ View Only | ✅ Full |
| Quản lý kho | ✅ View | ✅ View, Edit | ✅ Full |
| Quản lý nhà cung cấp | ✅ View, Add, Edit | ❌ | ✅ Full |
| **Nghiệp vụ** | | | |
| Phiếu nhập | ✅ View, Add, Confirm | ✅ View | ✅ Full |
| Phiếu xuất | ✅ View | ✅ Add, Edit, Confirm | ✅ Full |
| Kiểm kê | ✅ View | ✅ Add, Edit, Submit | ✅ Full |
| **Báo cáo** | | | |
| Báo cáo nhập-xuất | ✅ View, Export | ❌ | ✅ Full |
| Báo cáo tồn kho | ✅ View, Export | ✅ View, Export | ✅ Full |
| **Hệ thống** | | | |
| Quản lý người dùng | ❌ | ❌ | ✅ Full |
| Xem nhật ký | ❌ | ❌ | ✅ Full |

### Định nghĩa Permissions

```typescript
// src/utils/permission.ts
export const PERMISSIONS = {
  MATERIALS: ['view', 'create', 'edit', 'delete'],
  WAREHOUSES: ['view', 'create', 'edit', 'delete'],
  SUPPLIERS: ['view', 'create', 'edit', 'delete'],
  IMPORTS: ['view', 'create', 'confirm'],
  EXPORTS: ['view', 'create', 'confirm'],
  STOCKTAKES: ['view', 'create', 'approve'],
  REPORTS: ['view', 'export'],
  USERS: ['view', 'create', 'edit', 'delete'],
  AUDIT_LOGS: ['view'],
}

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
    // Có toàn bộ quyền
    all: true,
  },
}
```

---

## 🎯 Chức năng chính

### 1. **Quản lý Danh mục (Master Data)**

#### 1.1 Quản lý Vật tư
- ➕ Tạo mới vật tư (code, tên, đơn vị, giá)
- ✏️ Cập nhật thông tin vật tư
- 🗑️ Xóa vật tư (nếu không được sử dụng)
- 🔍 Tìm kiếm và lọc vật tư
- 📋 Xem danh sách vật tư

#### 1.2 Quản lý Kho
- ➕ Tạo kho mới
- ✏️ Cập nhật thông tin kho
- 👤 Gán thủ kho cho kho
- 🔍 Xem tồn kho theo kho

#### 1.3 Quản lý Nhà Cung Cấp
- ➕ Tạo nhà cung cấp
- ✏️ Cập nhật thông tin nhà cung cấp
- 📞 Quản lý contact, thuế, tài khoản ngân hàng

#### 1.4 Quản lý Người Dùng (Chỉ Quản lý)
- ➕ Tạo tài khoản người dùng
- ✏️ Cập nhật thông tin người dùng
- 👥 Gán vai trò cho người dùng
- 🔒 Khóa/mở khóa tài khoản

### 2. **Nghiệp vụ Kho**

#### 2.1 Phiếu Nhập Kho
- ➕ Tạo phiếu nhập từ nhà cung cấp
- 📝 Nhập chi tiết vật tư (số lượng, giá)
- 💾 Lưu như nháp hoặc xác nhận
- ✅ Xác nhận phiếu → Cập nhật tồn kho tự động
- 🔍 Tìm kiếm và lọc phiếu nhập

#### 2.2 Phiếu Xuất Kho
- ➕ Tạo phiếu xuất (ghi lý do)
- 📝 Nhập chi tiết vật tư
- ⚠️ Kiểm tra tồn kho có đủ không
- ✅ Xác nhận phiếu → Cập nhật tồn kho
- 🔍 Lịch sử xuất kho

#### 2.3 Cập nhật Tồn kho Tự động
- Mỗi phiếu nhập/xuất được xác nhận → Cập nhật `warehouse_inventory`
- Hiển thị tồn kho real-time
- Cảnh báo nếu số lượng thấp

### 3. **Kiểm Kê Tồn Kho (Stocktake)**

#### 3.1 Lập Phiếu Kiểm Kê
- ➕ Tạo phiếu kiểm kê định kỳ
- 📝 Nhập số lượng thực tế từ kho
- 🔢 So sánh với số lượng hệ thống
- 📊 Tính chênh lệch (lệch/không lệch)

#### 3.2 Đối Chiếu & Báo Cáo
- Xem phân tích chênh lệch
- Tạo biên bản kiểm kê
- 📋 In phiếu kiểm kê
- ✅ Phê duyệt phiếu (Quản lý)

### 4. **Báo Cáo (Reports)**

#### 4.1 Báo cáo Nhập-Xuất-Tồn
- 📊 Xem tồn kho đầu kỳ, nhập, xuất, tồn cuối kỳ
- 📅 Lọc theo thời gian (ngày/tháng/quý/năm)
- 🏪 Lọc theo kho
- 💵 Tính giá trị hàng tồn kho
- 📥 Export Excel/PDF

#### 4.2 Báo cáo Cơ cấu Tồn Kho
- 📊 Biểu đồ tròn: % tồn kho theo danh mục
- 📊 Biểu đồ cột: Giá trị tồn kho theo kho
- 🔝 Top 10 vật tư có giá trị cao nhất

#### 4.3 Báo cáo Xuất Kho
- 🔝 Top 10 vật tư xuất kho nhiều nhất
- 📊 Biểu đồ xu hướng xuất kho theo thời gian
- 💡 Phân tích từng lý do xuất kho

### 5. **Hệ thống**

#### 5.1 Đăng Nhập
- 🔐 Xác thực bằng username/password
- 🍪 Lưu token trong cookie
- ⏰ Session timeout 24h
- 🔑 JWT Token

#### 5.2 Điều Khiển Quyền (RBAC)
- 3 vai trò: Kế toán, Thủ kho, Quản lý
- Sidebar hiển thị/ẩn theo quyền
- Các nút hành động hiển thị/vô hiệu hóa
- API backend kiểm tra quyền

#### 5.3 Nhật ký Thao tác (Sắp tới)
- 📝 Ghi lại mọi thao tác CRUD
- 🕐 Timestamp và user thực hiện
- 📊 Audit trail cho kiểm toán

---

## 📁 Cấu trúc Dự Án

### Frontend - Next.js (`/fe`)

```
fe/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/login/             # Page đăng nhập
│   │   ├── (dashboard)/              # Protected routes
│   │   │   ├── page.tsx              # Dashboard
│   │   │   ├── materials/            # Quản lý vật tư
│   │   │   ├── warehouses/           # Quản lý kho
│   │   │   ├── suppliers/            # Quản lý nhà cung cấp
│   │   │   ├── imports/              # Phiếu nhập
│   │   │   ├── exports/              # Phiếu xuất
│   │   │   ├── stocktakes/           # Kiểm kê
│   │   │   ├── reports/              # Báo cáo
│   │   │   └── users/                # Quản lý người dùng
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── feature/                  # Feature components
│   │   │   ├── materials/            # Materials feature
│   │   │   ├── warehouses/           # Warehouses feature
│   │   │   ├── imports/              # Imports feature
│   │   │   ├── exports/              # Exports feature
│   │   │   ├── stocktakes/           # Stocktakes feature
│   │   │   ├── suppliers/            # Suppliers feature
│   │   │   ├── users/                # Users feature
│   │   │   └── reports/              # Reports feature
│   │   └── shared/
│   │       ├── layouts/              # Header, Sidebar, ProtectedRoute
│   │       ├── form/                 # Reusable forms
│   │       ├── table/                # DataTable component
│   │       ├── ui/                   # UI primitives (Button, Input, etc.)
│   │       └── common/               # Common components (PageTitle, etc.)
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.ts                # Auth context hook
│   │   └── useRole.ts                # Role permission hook
│   ├── types/                        # TypeScript types (đã tạo đầy đủ)
│   │   ├── index.ts                  # Centralized exports
│   │   ├── user.ts                   # User types
│   │   ├── material.ts               # Material types
│   │   ├── warehouse.ts              # Warehouse types
│   │   ├── supplier.ts               # Supplier types
│   │   ├── receipt.ts                # Import/Export types
│   │   ├── stocktake.ts              # Stocktake types
│   │   ├── report.ts                 # Report types
│   │   └── role.ts                   # Role types
│   ├── lib/                          # Utilities
│   │   └── http.ts                   # Axios instance
│   ├── services/                     # API service layer
│   │   └── api.ts                    # API calls
│   ├── store/                        # Zustand store
│   │   └── auth.store.ts             # Auth state
│   ├── utils/                        # Utility functions
│   │   ├── permission.ts             # Permission checking
│   │   ├── constants.ts              # Constants
│   │   ├── format.ts                 # Formatting utilities
│   │   └── etc.
│   ├── mock/                         # Mock data
│   │   ├── materials.mock.ts
│   │   ├── users.mock.ts
│   │   ├── warehouses.mock.ts
│   │   ├── suppliers.mock.ts
│   │   ├── imports.mock.ts
│   │   ├── exports.mock.ts
│   │   ├── stocktakes.mock.ts
│   │   └── report-inout-stock.mock.ts
│   ├── providers/                    # React providers
│   │   └── QueryProvider.tsx         # TanStack Query provider
│   ├── middleware.ts                 # Next.js middleware
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Root page
├── public/                           # Static files
├── next.config.ts                    # Next.js config
├── tailwind.config.mjs               # Tailwind config
├── tsconfig.json                     # TypeScript config
├── package.json
└── README.md
```

### Backend - NestJS (`/be`)

```
be/
├── src/
│   ├── app.module.ts                 # Main module
│   ├── app.controller.ts             # Main controller
│   ├── app.service.ts                # Main service
│   ├── main.ts                       # Entry point
│   └── modules/                      # Feature modules (sắp tới)
│       ├── auth/                     # Authentication
│       ├── users/                    # Users module
│       ├── materials/                # Materials module
│       ├── warehouses/               # Warehouses module
│       ├── suppliers/                # Suppliers module
│       ├── imports/                  # Import receipts
│       ├── exports/                  # Export receipts
│       ├── stocktakes/               # Stocktakes module
│       ├── reports/                  # Reports module
│       └── audit/                    # Audit logs
├── test/                             # E2E tests
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
├── package.json
└── README.md
```

---

## 🚀 Cài đặt và Chạy

### Yêu cầu

- **Node.js** >= 18
- **npm** hoặc **pnpm** >= 8
- **Docker** (tùy chọn, cho backend)

### 1. Clone và Cài đặt Dependencies

```bash
# Clone repository
git clone <repo-url>
cd kho

# Frontend
cd fe
pnpm install

# Backend (sắp tới)
cd ../be
pnpm install
```

### 2. Chạy Frontend (Development)

```bash
cd fe
pnpm run dev
```

Frontend sẽ chạy trên: **http://localhost:3000**

### 3. Chạy Backend (Sắp tới)

```bash
cd be
pnpm run start:dev
```

Backend sẽ chạy trên: **http://localhost:3000** (hoặc port khác)

### 4. Setup Database (Sắp tới)

```bash
# Docker Compose
docker-compose -f be/dockercompose.yml up -d

# Hoặc MySQL riêng
mysql -u root -p < be/database.sql
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/logout` | Đăng xuất |
| POST | `/api/auth/refresh` | Làm mới token |
| GET | `/api/auth/me` | Lấy thông tin user |

### Materials

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/materials` | Danh sách vật tư |
| POST | `/api/materials` | Tạo vật tư |
| GET | `/api/materials/:id` | Chi tiết vật tư |
| PUT | `/api/materials/:id` | Cập nhật vật tư |
| DELETE | `/api/materials/:id` | Xóa vật tư |

### Warehouses

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/warehouses` | Danh sách kho |
| POST | `/api/warehouses` | Tạo kho |
| GET | `/api/warehouses/:id` | Chi tiết kho |
| PUT | `/api/warehouses/:id` | Cập nhật kho |
| GET | `/api/warehouses/:id/inventory` | Tồn kho theo kho |

### Imports

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/imports` | Danh sách phiếu nhập |
| POST | `/api/imports` | Tạo phiếu nhập |
| GET | `/api/imports/:id` | Chi tiết phiếu nhập |
| PUT | `/api/imports/:id` | Cập nhật phiếu nhập |
| POST | `/api/imports/:id/confirm` | Xác nhận phiếu nhập |

### Exports

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/exports` | Danh sách phiếu xuất |
| POST | `/api/exports` | Tạo phiếu xuất |
| GET | `/api/exports/:id` | Chi tiết phiếu xuất |
| PUT | `/api/exports/:id` | Cập nhật phiếu xuất |
| POST | `/api/exports/:id/confirm` | Xác nhận phiếu xuất |

### Stocktakes

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/stocktakes` | Danh sách kiểm kê |
| POST | `/api/stocktakes` | Tạo kiểm kê |
| GET | `/api/stocktakes/:id` | Chi tiết kiểm kê |
| PUT | `/api/stocktakes/:id` | Cập nhật kiểm kê |
| POST | `/api/stocktakes/:id/approve` | Phê duyệt kiểm kê |

### Reports

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/reports/inout-stock` | Báo cáo nhập-xuất-tồn |
| GET | `/api/reports/stock-structure` | Báo cáo cơ cấu tồn kho |
| GET | `/api/reports/export-analysis` | Báo cáo phân tích xuất kho |

---

## 📝 Hướng Dẫn Phát Triển

### Thêm Feature Mới

#### 1. Tạo Type (Frontend)

```typescript
// src/types/new-feature.ts
export interface NewFeature {
  id: number
  name: string
  // ...
}

export interface NewFeatureFormData {
  name: string
  // ...
}
```

#### 2. Tạo Component

```typescript
// src/components/feature/new-feature/index.tsx
'use client'

import { NewFeature } from '@/types'

export default function NewFeatureComponent({ data }: { data: NewFeature[] }) {
  return (
    <div>
      {/* Render your feature */}
    </div>
  )
}
```

#### 3. Thêm API Service

```typescript
// src/services/api.ts
export async function getNewFeatures() {
  const response = await apiClient.get('/api/new-feature')
  return response.data
}
```

#### 4. Tạo Page

```typescript
// src/app/(dashboard)/new-feature/page.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { getNewFeatures } from '@/services/api'

export default function NewFeaturePage() {
  const { data } = useQuery({
    queryKey: ['newFeature'],
    queryFn: getNewFeatures,
  })

  return (
    <div>
      {/* Render component */}
    </div>
  )
}
```

### Naming Convention

- **Components**: PascalCase (e.g., `UserForm.tsx`)
- **Files**: kebab-case (e.g., `user-form.ts`)
- **Functions**: camelCase (e.g., `getUserData()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)
- **Types**: PascalCase (e.g., `UserFormData`)

### ESLint & Prettier

```bash
# Frontend
cd fe
pnpm run lint      # Check
pnpm run lint --fix # Fix

# Backend
cd be
pnpm run lint
pnpm run lint --fix
```

---

## 🧪 Testing

### Frontend

```bash
cd fe
pnpm run test        # Run tests
pnpm run test --watch # Watch mode
```

### Backend

```bash
cd be
pnpm run test        # Unit tests
pnpm run test:e2e    # E2E tests
pnpm run test:cov    # Coverage
```

---

## 📦 Deployment

### Frontend (Vercel)

```bash
# Vercel CLI
npm install -g vercel
vercel
```

### Backend (Docker)

```bash
# Build image
docker build -f be/dockerfile -t vnpt-backend:latest .

# Run container
docker run -p 3001:3000 \
  -e DB_HOST=mysql \
  -e DB_USER=root \
  -e DB_PASSWORD=root \
  -e DB_NAME=vnpt_kho \
  vnpt-backend:latest
```

---

## 📞 Hỗ Trợ

- **Issues**: Tạo issue trên GitHub
- **Email**: [project-email@vnpt.vn]
- **Slack**: [project-slack-channel]

---

## 📄 License

Dự án này được phát triển cho VNPT Yên Bái.

---

**Cập nhật lần cuối**: January 2026
**Version**: 1.0.0-alpha
