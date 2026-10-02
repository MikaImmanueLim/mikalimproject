# Burnice Portfolio - Struktur GitHub Pages

Website ini dipisahkan tanpa mengubah struktur DOM, CSS selector, efek, animasi, atau alur JavaScript dari file asli.

## File yang paling sering diedit

- `data/projects.js` — tambah/edit/hapus project portofolio.
- `assets/images/` — tempat yang disiapkan untuk gambar lokal jika nanti URL gambar eksternal ingin dipindahkan ke repository.

## File inti

- `index.html` — struktur halaman.
- `css/style.css` — seluruh styling dan animasi.
- `js/app.js` — seluruh logic/interaksi. Sebaiknya tidak perlu disentuh untuk update project biasa.

## Menambah project

Buka `data/projects.js`, lalu duplikasi salah satu object di dalam `database` dan ubah:
- `category`: `design`, `photo`, atau `iot`
- `title`
- `meta`
- `desc`
- `image`

Pastikan setiap object dipisahkan koma.

## Publish GitHub Pages

Upload seluruh isi folder ini ke root repository GitHub Pages. `index.html` harus berada di root repository.
