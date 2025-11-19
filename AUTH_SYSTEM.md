# Sistem Autentikasi dan Role-Based Access Control

## Deskripsi
Sistem ini mengimplementasikan login berbasis email dan password dengan pembatasan akses data berdasarkan role pengguna.

## Ketentuan Role

### 1. UIDRKR (Administrator)
- **Akses**: Tidak dibatasi (dapat melihat semua data)
- **Kolom filter**: -
- **Contoh user**: admin@admin.com, PLNRKR@pln.co.id

### 2. UP3 (Unit Pelayanan dan Pemeriksaan Pelanggan Level 3)
- **Akses**: Dibatasi berdasarkan kolom `nama_ap` pada database
- **Kolom filter**: Menggunakan nilai dari kolom `UI/UP` di user.csv (disimpan sebagai `ui_up`)
- **Contoh**: User dengan UL/UP = "UP3 BANGKINANG" hanya melihat data dengan nama_ap = "UP3 Bangkinang"

### 3. ULP (Unit Layanan Pelanggan)
- **Akses**: Dibatasi berdasarkan kolom `nama_up` pada database
- **Kolom filter**: Menggunakan nilai dari kolom `UL/UP` di user.csv (disimpan sebagai `ul_up`)
- **Contoh**: User dengan UL/UP = "ULP BANGKINANG" hanya melihat data dengan nama_up = "ULP BANGKINANG"

## Struktur Database

### Tabel Users
```sql
- id
- name (dari kolom NAMA di CSV)
- email (dari kolom EMAIL di CSV, atau generated dari PASSWORD@pln.co.id)
- password (dari kolom PASWORD di CSV, di-hash)
- jabatan (dari kolom JABATAN di CSV)
- ul_up (dari kolom UL/UP di CSV)
- ui_up (dari kolom UI/UP di CSV)
- remember_token
- timestamps
```

## Data yang Dibatasi

### ✅ Dibatasi berdasarkan role:
- **Data Pelanggan** (index, map, detail)
- **Export CSV** (hanya data yang bisa diakses)
- **Export Excel** (hanya data yang bisa diakses)
- **Peta Pelanggan** (hanya marker dari data yang bisa diakses)

### ⚠️ TIDAK dibatasi:
- **Dashboard** - Menampilkan semua data untuk overview

## Setup

### 1. Persiapan
Pastikan file `user.csv` ada di root folder Laravel dengan format:
```
NAMA,EMAIL,PASWORD,JABATAN,UL/UP,UI/UP
```

### 2. Jalankan Setup Script
```powershell
.\setup-auth.ps1
```

Script ini akan:
1. Menjalankan migration (create users table)
2. Import users dari user.csv

### 3. Manual Setup (Alternative)
```bash
php artisan migrate:fresh
php artisan db:seed --class=UserSeeder
```

## Login Credentials

### Admin User
```
Email: admin@admin.com
Password: admin123
Role: UIDRKR (Full Access)
```

### User dari CSV (tanpa email)
Format login untuk user yang tidak memiliki email di CSV:
```
Email: [PASSWORD]@pln.co.id
Password: [PASSWORD dari CSV]

Contoh:
Email: PLNBKN@pln.co.id
Password: PLNBKN
```

## Implementasi Teknis

### Middleware: ApplyDataFilter
Middleware ini menambahkan filter information ke request:
- `data_filter_type`: 'none', 'nama_ap', atau 'nama_up'
- `data_filter_value`: nilai filter yang akan digunakan

### Controller Method: applyUserFilter()
Helper method di DataPelangganController yang menerapkan filter ke query:
```php
protected function applyUserFilter($query, Request $request)
{
    $filterType = $request->input('data_filter_type');
    $filterValue = $request->input('data_filter_value');

    if ($filterType === 'nama_ap') {
        return $query->where('nama_ap', $filterValue);
    } elseif ($filterType === 'nama_up') {
        return $query->where('nama_up', $filterValue);
    }

    return $query; // UIDRKR - no filter
}
```

### User Model Helper Methods
```php
$user->isUidrkr()  // Check if user is UIDRKR (admin)
$user->isUp3()     // Check if user is UP3
$user->isUlp()     // Check if user is ULP
```

## Testing

### Test User UIDRKR
1. Login sebagai admin@admin.com
2. Verifikasi dapat melihat semua data

### Test User UP3
1. Login dengan user UP3 (contoh: yang memiliki UL/UP = "UP3 BANGKINANG")
2. Verifikasi hanya melihat data dengan nama_ap = "UP3 Bangkinang"

### Test User ULP
1. Login dengan user ULP (contoh: yang memiliki UL/UP = "ULP BANGKINANG")
2. Verifikasi hanya melihat data dengan nama_up = "ULP BANGKINANG"

## Troubleshooting

### Error: Users table not found
```bash
php artisan migrate:fresh
```

### Error: No users in database
```bash
php artisan db:seed --class=UserSeeder
```

### User tidak bisa login
1. Pastikan email format benar (@pln.co.id untuk user tanpa email di CSV)
2. Pastikan password sesuai dengan kolom PASWORD di CSV
3. Check database: `SELECT * FROM users WHERE email = '[email]'`
