# REST API Produk dengan ExpressJS dan SQLite

Ini adalah implementasi sederhana REST API menggunakan **ExpressJS** dan **SQLite3**.

## Persyaratan
- Node.js

## Instalasi
1. Clone repositori ini.
2. Jalankan perintah berikut untuk menginstal dependensi:
   ```bash
   npm install
   ```

## Menjalankan Server
Gunakan perintah berikut untuk menjalankan server:
```bash
node index.js
```
Server akan berjalan di `http://localhost:3000`.

## Endpoints

1. **GET /api/products**
   - Menampilkan semua produk.

2. **POST /api/products**
   - Menambah produk baru.
   - Body (JSON):
     ```json
     {
       "name": "Buku Tulis",
       "price": 5000,
       "stock": 100,
       "category": "Alat Tulis"
     }
     ```

3. **PUT /api/products/:id**
   - Mengupdate data produk (Harga/Stok) berdasarkan ID.
   - Body (JSON):
     ```json
     {
       "price": 6000,
       "stock": 150
     }
     ```

4. **DELETE /api/products/:id**
   - Menghapus produk berdasarkan ID.

## Struktur Database (Tabel Produk)
- `id` (Integer, Primary Key, Auto Increment)
- `name` (Text) - Nama barang
- `price` (Integer) - Harga barang
- `stock` (Integer) - Jumlah stok
- `category` (Text) - Kategori barang
