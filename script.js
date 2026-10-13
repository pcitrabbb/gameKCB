// =====================================================
//  GAME ONE LINE (versi grid, 3 mode)
//  Aturan: mulai dari lingkaran di kotak awal, geser ke kotak
//  tetangga (atas/bawah/kiri/kanan) sampai SEMUA kotak terisi.
//  Kotak yang sudah dilewati tidak boleh dilewati lagi.
//  Mundur: ketuk kotak yang sudah dilewati, jalur langsung
//  ditarik balik sampai kotak itu.
//
//  Alur halaman: Pilih Mode -> Pilih Level (1-10) -> Permainan.
//  Level baru terbuka setelah level sebelumnya dimenangkan.
//  Level yang sudah terbuka boleh dimainkan ulang (papan kosong lagi).
//
//  Setiap mode punya JATAH HINT 3 untuk satu mode (dipakai bersama
//  di semua level mode itu). Satu hint = 2 langkah garis yang benar.
// =====================================================

// ---------- 1. DATA LEVEL ----------
// "#" = kotak biasa, "." = kosong (tidak ada kotak), "S" = kotak awal
// Semua level sudah diuji: pasti ada jalan yang mengisi semua kotak.
const MODES = {
    easy: {
        nama: "Easy",
        levels: [
            // L1 3x3
            ["S##",
             "###",
             "##."],
            // L2 3x4
            ["S##.",
             "####",
             "####"],
            // L3 3x5
            ["####.",
             "S####",
             ".####"],
            // L4 4x4
            ["###S",
             "####",
             "####",
             "..##"],
            // L5 4x4
            [".###",
             "S###",
             "####",
             "####"],
            // L6 4x5
            [".###S",
             ".####",
             "#####",
             "#####"],
            // L7 5x4
            ["####",
             "####",
             "####",
             "###S",
             "..##"],
            // L8 5x5
            [".####",
             "#####",
             "#####",
             "####.",
             "###S."],
            // L9 5x5
            [".###.",
             ".####",
             "S####",
             "#####",
             "#####"],
            // L10 5x5
            ["S####",
             "#####",
             "#####",
             "####.",
             "####."]
        ]
    },

    medium: {
        nama: "Medium",
        levels: [
            // L1 5x5
            ["#####",
             "#####",
             "S#.##",
             ".####",
             "#####"],
            // L2 5x5
            ["#####",
             "#####",
             "#S.##",
             "#####",
             ".##.#"],
            // L3 5x6
            ["#####.",
             "######",
             "S#.#.#",
             "######",
             "#####."],
            // L4 6x6
            [".#####",
             "##.###",
             "#.####",
             "###.##",
             "##.S##",
             "######"],
            // L5 6x6
            [".####.",
             "#####.",
             "###.#S",
             "##.###",
             "######",
             "#####."],
            // L6 6x7
            ["##.###.",
             "####.##",
             "#####.#",
             "##.S###",
             "####.#.",
             "######."],
            // L7 6x7
            ["#######",
             "#.#####",
             "#.#..##",
             "###.###",
             "#####.#",
             "..S####"],
            // L8 7x7
            [".####..",
             "##..###",
             "#.#####",
             "#.S..##",
             "#######",
             "#######",
             "####.##"],
            // L9 7x7
            ["##S....",
             "#######",
             "##..###",
             "####.##",
             "##.#.##",
             ".#.####",
             ".######"],
            // L10 7x7
            ["#######",
             "##.####",
             ".#...##",
             ".#.S.##",
             ".#.#.##",
             ".######",
             "..#####"]
        ]
    },

    hard: {
        nama: "Hard",
        levels: [
            // L1 7x7
            ["...###.",
             "#.##.##",
             "#######",
             ".#.S.##",
             ".#.####",
             ".##.###",
             "..#####"],
            // L2 7x7
            [".#####.",
             "#######",
             "#...###",
             "##.S...",
             ".#.##..",
             ".##.###",
             "..#####"],
            // L3 7x8
            ["##.####.",
             "##.#..#.",
             "####..#.",
             "###.S.#.",
             ".##.###.",
             "##...##.",
             "########"],
            // L4 8x8
            ["#####...",
             "#...##..",
             "####.##.",
             "##.##.#.",
             "###.S.##",
             "#.##...#",
             "##.#####",
             ".###..##"],
            // L5 8x8
            ["....##..",
             ".######.",
             "##.##.#.",
             "###.#.#.",
             ".##.S.##",
             "##.###.#",
             "####.###",
             ".##....."],
            // L6 8x9
            ["...####..",
             "..##..##.",
             "###.##.#.",
             "#...####.",
             "###.S.###",
             "..##.##.#",
             "..####.##",
             "..######."],
            // L7 9x9
            [".###.....",
             ".#.####..",
             "#####.##.",
             "#.#.#..#.",
             "###.S.##.",
             "..#######",
             "###..##.#",
             "##.######",
             ".###....."],
            // L8 9x9
            [".....###.",
             "....#####",
             "...##.#.#",
             "..##.##.#",
             ".##.S####",
             "##..##.##",
             "##.######",
             ".###..###",
             "..##....."],
            // L9 9x9
            ["..####...",
             ".##.##...",
             ".#..####.",
             ".##.#..##",
             "..#.S####",
             "###..#...",
             "#######..",
             "...##.##.",
             "...#####."],
            // L10 9x9
            [".###.....",
             ".#.####..",
             "##....##.",
             "#......#.",
             "##.#S.##.",
             ".#.####..",
             ".######..",
             "..###.###",
             "....###.#"]
        ]
    }
};

const MODE_KEYS = ["easy", "medium", "hard"];
const MAX_HINT = 3;      // jatah hint untuk SATU MODE (semua level)
const LANGKAH_HINT = 2;  // satu hint menunjukkan 2 langkah garis yang benar

// Warna tiap level (level 1..10): kotak terlewati, garis, kepala, warna hover tombol
const PALET = [
    { utama: "#ab6bde", garis: "#d89bff", kepala: "#e6c2ff", hover: "#c28af0" }, // 1 ungu
    { utama: "#3f8fdc", garis: "#86bff2", kepala: "#cde5fa", hover: "#5ea6e8" }, // 2 biru
    { utama: "#1fb097", garis: "#6fd9c6", kepala: "#c2f2ea", hover: "#44c4ad" }, // 3 tosca
    { utama: "#4cae52", garis: "#8fd493", kepala: "#cdecd0", hover: "#68c06d" }, // 4 hijau
    { utama: "#d99a0b", garis: "#f0c45a", kepala: "#fae6b0", hover: "#e5ae2e" }, // 5 amber
    { utama: "#ee7d2c", garis: "#f6ad78", kepala: "#fbd9bf", hover: "#f4944f" }, // 6 oranye
    { utama: "#e0484d", garis: "#f08d90", kepala: "#f9cfd0", hover: "#e8686c" }, // 7 merah
    { utama: "#e0609f", garis: "#f09ec8", kepala: "#f9d2e6", hover: "#e881b3" }, // 8 pink
    { utama: "#6b63e8", garis: "#a29cf4", kepala: "#d3d0fa", hover: "#8982ee" }, // 9 indigo
    { utama: "#2fb6d6", garis: "#79d4e8", kepala: "#c3eef7", hover: "#52c4de" }  // 10 cyan
];

// Pantun di popup menang (dipilih acak), tampil setelah "Level X selesai. "
const PUJIAN = [
    "Jalan-jalan membeli bakwan, Jago juga kamu mainnya, kawan! 😎",
    "Beli kopi pakai dolar, Akhirnya kelar! 😮‍💨",
    "Naik sepeda ke Kota Blitar, Kamu memang pintar! 🙌🏻",
    "Beli es krim rasa cokelat, Level selesai, kamu hebat! 🤩",
    "Pagi-pagi beli jamu, Keren juga kamu! 🫡"
];

// ---------- 2. AMBIL ELEMEN HALAMAN ----------
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const statusEl = document.getElementById("status");
const levelTitleEl = document.getElementById("level-title");
const btnReset = document.getElementById("btn-reset");
const btnHint = document.getElementById("btn-hint");
const btnMenu = document.getElementById("btn-menu");
const menuEl = document.getElementById("menu");
const pilihLevelEl = document.getElementById("pilih-level");
const judulModeEl = document.getElementById("judul-mode");
const gridLevelEl = document.getElementById("grid-level");
const btnKembali = document.getElementById("btn-kembali");
const areaGameEl = document.getElementById("area-game");
const overlayEl = document.getElementById("overlay");
const overlayJudulEl = document.getElementById("overlay-judul");
const overlayTeksEl = document.getElementById("overlay-teks");
const btnNext = document.getElementById("btn-next");
const btnPilihLevel = document.getElementById("btn-pilih-level");
const btnMenuAkhir = document.getElementById("btn-menu-akhir");
const btnClose = document.getElementById("btn-close");
const konfetiEl = document.getElementById("konfeti");
const kctx = konfetiEl.getContext("2d");

// ---------- 3. STATE (kondisi game saat ini) ----------
let modeKey = "easy";    // mode yang sedang dimainkan
let levelIndex = 0;      // level ke berapa (mulai dari 0)
let grid = [];           // grid[baris][kolom] = true kalau ada kotak
let rows = 0;
let cols = 0;
let startCell = null;    // { r, c } kotak awal
let path = [];           // daftar kotak yang sudah dilewati, urut
let visited = [];        // visited[baris][kolom] = true kalau sudah dilewati
let totalCells = 0;      // jumlah semua kotak aktif di level ini
let dragging = false;    // apakah jari/mouse sedang menekan
let finished = false;    // apakah level sudah selesai
let cellSize = 60;       // ukuran satu kotak (piksel), dihitung otomatis
const GAP = 8;           // jarak antar kotak
let hintsLeft = MAX_HINT;  // sisa hint di mode ini
let hint = null;         // petunjuk aktif: { asal, langkah: [kotak, kotak], mundur } atau null
let warna = PALET[0];    // warna level yang sedang tampil

// Daftar level mode yang sedang aktif
function levelsAktif() {
    return MODES[modeKey].levels;
}

// Menerapkan warna level ke canvas dan ke tombol/popup (lewat variabel CSS)
function terapkanWarna(index) {
    warna = PALET[index % PALET.length];
    const root = document.documentElement.style;
    root.setProperty("--aksen", warna.utama);
    root.setProperty("--aksen-hover", warna.hover);
    root.setProperty("--aksen-terang", warna.kepala);
}

// ---------- 4. MEMUAT LEVEL ----------
// Selalu memuat papan KOSONG (termasuk saat level lama dimainkan ulang)
function loadLevel(index) {
    levelIndex = index;
    const data = levelsAktif()[index];
    rows = data.length;
    cols = Math.max(...data.map(function (baris) { return baris.length; }));
    grid = [];
    visited = [];
    totalCells = 0;

    for (let r = 0; r < rows; r++) {
        grid.push([]);
        visited.push([]);
        for (let c = 0; c < cols; c++) {
            const ch = data[r][c] || ".";
            const aktif = ch === "#" || ch === "S";
            grid[r].push(aktif);
            visited[r].push(false);
            if (aktif) totalCells++;
            if (ch === "S") startCell = { r: r, c: c };
        }
    }

    // CATATAN: hint TIDAK diisi ulang di sini (jatah 3 berlaku satu mode)
    terapkanWarna(index);
    levelTitleEl.textContent = MODES[modeKey].nama + " · Level " +
        (index + 1) + " / " + levelsAktif().length;
    resizeCanvas();
    resetLevel();
}

// Mengulang level dari awal
function resetLevel() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            visited[r][c] = false;
        }
    }
    path = [{ r: startCell.r, c: startCell.c }];
    visited[startCell.r][startCell.c] = true;
    finished = false;
    hint = null;
    updateHintButton(); // Reset TIDAK mengembalikan jatah hint
    setStatus("Seret dari lingkaran terang. Ketuk kotak yang sudah dilewati untuk mundur.");
    draw();
}

// ---------- 5. UKURAN CANVAS ----------
function resizeCanvas() {
    // ukuran kotak menyesuaikan lebar layar, maksimal 64 piksel
    const lebarTersedia = Math.min(window.innerWidth - 32, 500);
    cellSize = Math.min(64, Math.floor((lebarTersedia - GAP) / cols) - GAP);
    if (cellSize < 16) cellSize = 16;
    canvas.width = cols * (cellSize + GAP) + GAP;
    canvas.height = rows * (cellSize + GAP) + GAP;
}

// ---------- 6. MENGGAMBAR ----------
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (path.length === 0) return;
    const head = path[path.length - 1];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!grid[r][c]) continue; // lewati yang kosong

            const x = GAP + c * (cellSize + GAP);
            const y = GAP + r * (cellSize + GAP);

            // pilih warna kotak
            if (visited[r][c]) {
                ctx.fillStyle = warna.utama; // sudah dilewati
            } else {
                ctx.fillStyle = "#5a6b82";   // belum dilewati
            }
            roundRect(x, y, cellSize, cellSize, 10);
            ctx.fill();
        }
    }

    // garis penghubung antar kotak yang sudah dilewati
    if (path.length > 1) {
        ctx.strokeStyle = warna.garis;
        ctx.lineWidth = cellSize * 0.25;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        for (let i = 0; i < path.length; i++) {
            const p = centerOf(path[i]);
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
    }

    // buletan di kotak AWAL: selalu tampil, walaupun kepala sudah jalan jauh
    const ps = centerOf(startCell);
    ctx.fillStyle = warna.kepala;
    ctx.beginPath();
    ctx.arc(ps.x, ps.y, cellSize * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // buletan di posisi KEPALA (yang sedang jalan), diberi cincin putih
    const pc = centerOf(head);
    ctx.fillStyle = warna.kepala;
    ctx.beginPath();
    ctx.arc(pc.x, pc.y, cellSize * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();

    gambarHint();
}

// Petunjuk: garis putus-putus putih melewati 2 langkah yang benar,
// kotaknya dibingkai putih dan diberi nomor 1 dan 2.
// Kalau jalur pemain sudah salah, kotak tujuan mundur ikut dibingkai.
function gambarHint() {
    if (!hint) return;

    ctx.save();
    ctx.strokeStyle = "#ffffff";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // garis putus-putus dari kotak asal lewat 2 langkah
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 7]);
    ctx.beginPath();
    const a = centerOf(hint.asal);
    ctx.moveTo(a.x, a.y);
    for (let i = 0; i < hint.langkah.length; i++) {
        const p = centerOf(hint.langkah[i]);
        ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // bingkai kotak tujuan mundur
    if (hint.mundur) bingkai(hint.asal);

    // bingkai + nomor di tiap langkah
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold " + Math.round(cellSize * 0.4) + "px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < hint.langkah.length; i++) {
        bingkai(hint.langkah[i]);
        const p = centerOf(hint.langkah[i]);
        ctx.fillText(String(i + 1), p.x, p.y);
    }
    ctx.restore();
}

function bingkai(cell) {
    const hx = GAP + cell.c * (cellSize + GAP);
    const hy = GAP + cell.r * (cellSize + GAP);
    ctx.lineWidth = 4;
    roundRect(hx + 2, hy + 2, cellSize - 4, cellSize - 4, 10);
    ctx.stroke();
}

// Titik tengah sebuah kotak
function centerOf(cell) {
    return {
        x: GAP + cell.c * (cellSize + GAP) + cellSize / 2,
        y: GAP + cell.r * (cellSize + GAP) + cellSize / 2
    };
}

// Menggambar persegi dengan sudut membulat
function roundRect(x, y, w, h, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// ---------- 7. LOGIKA GAME ----------

// Mengubah posisi jari (piksel) menjadi baris & kolom kotak
function cellFromPoint(px, py) {
    const c = Math.floor((px - GAP / 2) / (cellSize + GAP));
    const r = Math.floor((py - GAP / 2) / (cellSize + GAP));
    if (r < 0 || r >= rows || c < 0 || c >= cols) return null;
    if (!grid[r][c]) return null;
    return { r: r, c: c };
}

// Apakah dua kotak bertetangga (atas/bawah/kiri/kanan)?
function isNeighbor(a, b) {
    return Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1;
}

// Cari posisi sebuah kotak di dalam jalur (-1 kalau belum dilewati)
function indexDiJalur(cell) {
    for (let i = 0; i < path.length; i++) {
        if (path[i].r === cell.r && path[i].c === cell.c) return i;
    }
    return -1;
}

// Tarik jalur mundur sampai kotak ke-idx (kotak itu jadi kepala baru)
function mundurKe(idx) {
    const tujuan = path[idx];
    // kalau pemain mundur persis ke kotak yang ditunjuk hint,
    // petunjuk 2 langkahnya tetap tampil (tanpa memakai hint lagi)
    const pertahankan = hint && hint.mundur &&
        hint.asal.r === tujuan.r && hint.asal.c === tujuan.c;

    while (path.length > idx + 1) {
        const last = path.pop();
        visited[last.r][last.c] = false;
    }
    hint = pertahankan ? { asal: hint.asal, langkah: hint.langkah, mundur: false } : null;
    draw();
    checkState();
    if (pertahankan && !finished) setStatus("Ikuti garis putus-putus: 2 langkah yang benar.");
}

// Mencoba pindah ke kotak target.
// dariKetukan = true kalau berasal dari tap/klik awal (boleh mundur jauh),
// false kalau dari geseran (hanya boleh mundur satu langkah, supaya
// jari yang melintas tidak sengaja menghapus jalur panjang).
function tryMove(target, dariKetukan) {
    if (finished || !target) return;
    const head = path[path.length - 1];

    // kotak yang sudah dilewati = mundur
    const idx = indexDiJalur(target);
    if (idx !== -1) {
        if (idx === path.length - 1) return; // kepala sendiri
        if (dariKetukan || idx === path.length - 2) mundurKe(idx);
        return;
    }

    // aturan: harus bertetangga dan kotak aktif (belum dilewati sudah pasti di sini)
    if (!isNeighbor(head, target)) return;

    hint = null; // petunjuk hilang setelah pemain melangkah
    path.push({ r: target.r, c: target.c });
    visited[target.r][target.c] = true;
    draw();
    checkState();
}

// Cek menang atau buntu
function checkState() {
    if (path.length === totalCells) {
        finished = true;
        updateHintButton();
        setStatus("Kamu menang!");
        tampilkanMenang();
        return;
    }
    if (countFreeNeighbors(path[path.length - 1]) === 0) {
        setStatus("Buntu! Ketuk kotak yang sudah dilewati untuk mundur, atau tekan Reset.");
    } else {
        setStatus("Terus lanjut... (" + path.length + " / " + totalCells + ")");
    }
}

// Menghitung tetangga yang masih bisa dituju
function countFreeNeighbors(cell) {
    const arah = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    let jumlah = 0;
    for (let i = 0; i < arah.length; i++) {
        const r = cell.r + arah[i][0];
        const c = cell.c + arah[i][1];
        if (r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c] && !visited[r][c]) {
            jumlah++;
        }
    }
    return jumlah;
}

function setStatus(teks) {
    statusEl.textContent = teks;
}

// ---------- 8. INPUT (mouse dan sentuhan) ----------
function pointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    // sesuaikan kalau canvas tampil lebih kecil dari ukuran aslinya
    const skalaX = canvas.width / rect.width;
    const skalaY = canvas.height / rect.height;
    return {
        x: (e.clientX - rect.left) * skalaX,
        y: (e.clientY - rect.top) * skalaY
    };
}

canvas.addEventListener("pointerdown", function (e) {
    dragging = true;
    canvas.setPointerCapture(e.pointerId);
    const p = pointerPos(e);
    tryMove(cellFromPoint(p.x, p.y), true); // ketukan: boleh mundur ke kotak mana pun di jalur
});

canvas.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    const p = pointerPos(e);
    tryMove(cellFromPoint(p.x, p.y), false);
});

canvas.addEventListener("pointerup", function () { dragging = false; });
canvas.addEventListener("pointercancel", function () { dragging = false; });

// ---------- 9. TOMBOL ----------
btnReset.addEventListener("click", resetLevel);
btnHint.addEventListener("click", useHint);
btnMenu.addEventListener("click", tampilkanPilihLevel);
btnKembali.addEventListener("click", tampilkanMenu);

// Tombol di popup menang
btnNext.addEventListener("click", function () {
    tutupPopup();
    if (levelIndex < levelsAktif().length - 1) {
        loadLevel(levelIndex + 1);
    }
});
btnPilihLevel.addEventListener("click", tampilkanPilihLevel);
btnMenuAkhir.addEventListener("click", tampilkanMenu);
btnClose.addEventListener("click", tutupPopup); // tutup saja, tetap di level terakhir

// ---------- 9a. POPUP MENANG + KONFETI ----------
function tampilkanMenang() {
    const terakhir = levelIndex === levelsAktif().length - 1;

    // buka level berikutnya (kalau belum terbuka) dan simpan
    saveProgress(Math.min(levelIndex + 1, levelsAktif().length - 1));

    // jeda sebentar supaya pemain sempat melihat papan yang sudah penuh
    setTimeout(function () {
        if (!finished) return; // pemain sudah menekan Reset / pindah level

        overlayJudulEl.textContent = "Kamu Menang!";
        if (terakhir) {
            overlayTeksEl.textContent = "Semua level mode " + MODES[modeKey].nama +
                " tamat. Logikamu luar biasa!";
        } else {
            overlayTeksEl.innerHTML = "Level " + (levelIndex + 1) + " selesai.<br>" +
                PUJIAN[Math.floor(Math.random() * PUJIAN.length)];
        }
        btnNext.hidden = terakhir;
        btnPilihLevel.hidden = !terakhir;
        btnMenuAkhir.hidden = !terakhir;
        btnClose.hidden = !terakhir;

        overlayEl.hidden = false;
        mulaiKonfeti();
    }, 350);
}

function tutupPopup() {
    overlayEl.hidden = true;
    hentikanKonfeti();
}

let partikel = [];
let animKonfeti = null;

function buatPartikel(acakTinggi) {
    const daftarWarna = [warna.utama, warna.garis, warna.kepala, "#ffffff",
                         "#ffd34d", "#ff6b9d", "#4dd0e1", "#8be28b"];
    return {
        x: Math.random() * konfetiEl.width,
        // awalnya tersebar di atas layar supaya hujan konfeti turun bertahap
        y: acakTinggi ? -Math.random() * konfetiEl.height : -20,
        w: 6 + Math.random() * 7,
        h: 8 + Math.random() * 9,
        vy: 2 + Math.random() * 3.5,
        vx: -1.5 + Math.random() * 3,
        rot: Math.random() * Math.PI * 2,
        vr: -0.2 + Math.random() * 0.4,
        fase: Math.random() * Math.PI * 2,
        warna: daftarWarna[Math.floor(Math.random() * daftarWarna.length)]
    };
}

function mulaiKonfeti() {
    hentikanKonfeti();
    konfetiEl.width = window.innerWidth;
    konfetiEl.height = window.innerHeight;
    partikel = [];
    for (let i = 0; i < 160; i++) partikel.push(buatPartikel(true));

    function langkah() {
        kctx.clearRect(0, 0, konfetiEl.width, konfetiEl.height);
        for (let i = 0; i < partikel.length; i++) {
            const p = partikel[i];
            p.fase += 0.05;
            p.x += p.vx + Math.sin(p.fase) * 0.8;
            p.y += p.vy;
            p.rot += p.vr;
            if (p.y > konfetiEl.height + 20) partikel[i] = buatPartikel(false);

            kctx.save();
            kctx.translate(p.x, p.y);
            kctx.rotate(p.rot);
            kctx.fillStyle = p.warna;
            kctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            kctx.restore();
        }
        animKonfeti = requestAnimationFrame(langkah);
    }
    animKonfeti = requestAnimationFrame(langkah);
}

function hentikanKonfeti() {
    if (animKonfeti !== null) {
        cancelAnimationFrame(animKonfeti);
        animKonfeti = null;
    }
    kctx.clearRect(0, 0, konfetiEl.width, konfetiEl.height);
}

// ---------- 9b. HINT ----------
// Satu hint menunjukkan 2 langkah garis yang benar (garis putus-putus + nomor 1, 2):
//  - kalau jalur pemain masih bisa diselesaikan: 2 langkah dimulai dari kepala
//  - kalau jalur pemain sudah salah (buntu): kotak tujuan mundur dibingkai putih
//    (ketuk kotak itu untuk mundur ke sana), lalu 2 langkah benar dari kotak itu

// Memperbarui teks dan status tombol Hint
function updateHintButton() {
    btnHint.textContent = "Hint (" + hintsLeft + ")";
    btnHint.disabled = hintsLeft <= 0 || finished;
}

// Mencari langkah yang benar kalau jalur pemain dihitung sampai panjang
// "panjang" kotak pertama saja.
// Hasil: { status: "ok", langkah: [kotak, kotak] } | { status: "buntu" } | { status: "timeout" }
function hitungLangkah(panjang) {
    // salinan papan supaya pencarian tidak merusak game yang sedang jalan
    const seen = [];
    for (let r = 0; r < rows; r++) seen.push(new Array(cols).fill(false));
    for (let i = 0; i < panjang; i++) seen[path[i].r][path[i].c] = true;

    const head = path[panjang - 1];
    const arah = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const BATAS = 2000000;  // batas percobaan supaya browser tidak hang
    const jejak = [];       // kotak-kotak yang sedang dicoba (urut dari kepala)
    let dicoba = 0;
    let habis = false;

    function bisaDipakai(r, c) {
        return r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c] && !seen[r][c];
    }

    // Semua kotak yang tersisa harus masih nyambung dari posisi sekarang,
    // dan paling banyak SATU kotak ujung buntu (kotak yang cuma punya 1 jalan masuk)
    function semuaTerjangkau(r, c, sisa) {
        const dilihat = new Set();
        const antre = [[r, c]];
        while (antre.length > 0) {
            const cur = antre.pop();
            for (let i = 0; i < 4; i++) {
                const nr = cur[0] + arah[i][0];
                const nc = cur[1] + arah[i][1];
                const kunci = nr * cols + nc;
                if (bisaDipakai(nr, nc) && !dilihat.has(kunci)) {
                    dilihat.add(kunci);
                    antre.push([nr, nc]);
                }
            }
        }
        if (dilihat.size !== sisa) return false;

        let ujung = 0;
        for (const kunci of dilihat) {
            const ur = Math.floor(kunci / cols);
            const uc = kunci % cols;
            let jalan = 0;
            for (let i = 0; i < 4; i++) {
                const nr = ur + arah[i][0];
                const nc = uc + arah[i][1];
                if (bisaDipakai(nr, nc) || (nr === r && nc === c)) jalan++;
            }
            if (jalan <= 1) {
                ujung++;
                if (ujung > 1) return false;
            }
        }
        return true;
    }

    // Backtracking: coba semua kemungkinan sampai semua kotak terisi
    function cari(r, c, sisa) {
        if (sisa === 0) return true;
        if (++dicoba > BATAS) { habis = true; return false; }
        if (!semuaTerjangkau(r, c, sisa)) return false;
        for (let i = 0; i < 4; i++) {
            const nr = r + arah[i][0];
            const nc = c + arah[i][1];
            if (bisaDipakai(nr, nc)) {
                seen[nr][nc] = true;
                jejak.push({ r: nr, c: nc });
                if (cari(nr, nc, sisa - 1)) return true;
                jejak.pop();
                seen[nr][nc] = false;
                if (habis) return false;
            }
        }
        return false;
    }

    const sisaAwal = totalCells - panjang;
    for (let i = 0; i < 4; i++) {
        const nr = head.r + arah[i][0];
        const nc = head.c + arah[i][1];
        if (bisaDipakai(nr, nc)) {
            seen[nr][nc] = true;
            jejak.push({ r: nr, c: nc });
            if (cari(nr, nc, sisaAwal - 1)) {
                // jejak berisi seluruh jalan penyelesaian; ambil 2 langkah pertama
                return { status: "ok", langkah: jejak.slice(0, LANGKAH_HINT) };
            }
            jejak.pop();
            seen[nr][nc] = false;
            if (habis) return { status: "timeout" };
        }
    }
    return { status: "buntu" };
}

// Dipanggil saat tombol Hint ditekan
function useHint() {
    if (finished || hintsLeft <= 0) return;

    const hasil = hitungLangkah(path.length);
    if (hasil.status === "timeout") {
        setStatus("Hint terlalu lama dihitung. Jatah hint tidak dipakai.");
        return;
    }

    if (hasil.status === "ok") {
        hint = { asal: path[path.length - 1], langkah: hasil.langkah, mundur: false };
        setStatus("Hint: ikuti garis putus-putus, 2 langkah yang benar.");
    } else {
        // jalur pemain sudah salah: cari sampai kotak mana harus mundur
        let balik = 0;
        let hasilBalik = null;
        for (let p = path.length - 1; p >= 1; p--) {
            const h = hitungLangkah(p);
            if (h.status === "timeout") {
                setStatus("Hint terlalu lama dihitung. Jatah hint tidak dipakai.");
                return;
            }
            if (h.status === "ok") { balik = p; hasilBalik = h; break; }
        }
        if (balik === 0) {
            setStatus("Level ini tidak punya jalan keluar dari kotak awal.");
            return;
        }
        hint = { asal: path[balik - 1], langkah: hasilBalik.langkah, mundur: true };
        setStatus("Hint: jalurmu sudah salah. Ketuk kotak berbingkai putih untuk mundur ke sana, " +
                  "lalu ikuti garis putus-putus.");
    }

    hintsLeft--;
    saveProgress(); // jatah hint tersimpan, tidak bisa "diisi ulang" dengan refresh
    updateHintButton();
    draw();
}

// ---------- 10. SIMPAN PROGRESS (per mode) ----------
// Bentuk data: { easy: {terbuka, hints}, medium: {...}, hard: {...} }
//   terbuka = nomor level tertinggi yang sudah terbuka (mulai dari 0 = level 1)
//   hints   = sisa hint di mode itu
const KUNCI_SIMPAN = "oneline-progress-v2";

function progressBawaan() {
    const p = {};
    MODE_KEYS.forEach(function (k) {
        p[k] = { terbuka: 0, hints: MAX_HINT };
    });
    return p;
}

function bacaProgress() {
    const p = progressBawaan();
    try {
        const mentah = JSON.parse(localStorage.getItem(KUNCI_SIMPAN));
        if (mentah) {
            MODE_KEYS.forEach(function (k) {
                const m = mentah[k];
                if (!m) return;
                const maxLevel = MODES[k].levels.length - 1;
                // data lama memakai nama "level", tetap dibaca supaya progres tidak hilang
                const t = m.terbuka !== undefined ? m.terbuka : m.level;
                if (t >= 0 && t <= maxLevel) p[k].terbuka = t;
                if (m.hints >= 0 && m.hints <= MAX_HINT) p[k].hints = m.hints;
            });
        }
    } catch (e) {
        // data rusak / penyimpanan tidak tersedia: pakai bawaan
    }
    return p;
}

function tulisProgress(p) {
    try {
        localStorage.setItem(KUNCI_SIMPAN, JSON.stringify(p));
    } catch (e) {
        // kalau penyimpanan tidak tersedia, abaikan saja
    }
}

// Simpan keadaan mode yang sedang dimainkan.
// bukaLevel (opsional): buka level sampai nomor ini (tidak pernah mengunci lagi).
function saveProgress(bukaLevel) {
    const p = bacaProgress();
    p[modeKey].hints = hintsLeft;
    if (bukaLevel !== undefined) {
        p[modeKey].terbuka = Math.max(p[modeKey].terbuka, bukaLevel);
    }
    tulisProgress(p);
}

// ---------- 11. HALAMAN: MENU MODE -> PILIH LEVEL -> GAME ----------
function sembunyikanSemuaHalaman() {
    tutupPopup();
    menuEl.hidden = true;
    pilihLevelEl.hidden = true;
    areaGameEl.hidden = true;
}

// Halaman 1: pilih mode
function tampilkanMenu() {
    sembunyikanSemuaHalaman();
    menuEl.hidden = false;
    terapkanWarna(0); // warna bawaan (ungu)
}

// Halaman 2: pilih level (level yang belum dilewati terkunci)
function tampilkanPilihLevel() {
    sembunyikanSemuaHalaman();
    pilihLevelEl.hidden = false;
    terapkanWarna(0);
    judulModeEl.textContent = MODES[modeKey].nama;

    const terbuka = bacaProgress()[modeKey].terbuka;
    gridLevelEl.innerHTML = "";
    for (let i = 0; i < levelsAktif().length; i++) {
        const tombol = document.createElement("button");
        tombol.className = "btn-level";
        if (i <= terbuka) {
            tombol.textContent = String(i + 1);
            tombol.style.background = PALET[i].utama; // warna sama dengan warna levelnya
            tombol.addEventListener("click", mulaiLevel.bind(null, i));
        } else {
            tombol.textContent = "🔒";
            tombol.disabled = true;
        }
        gridLevelEl.appendChild(tombol);
    }
}

// Pilih mode -> buka halaman pilih level
function mulaiMode(key) {
    modeKey = key;
    hintsLeft = bacaProgress()[key].hints;
    tampilkanPilihLevel();
}

// Pilih level -> mulai main (papan selalu kosong)
function mulaiLevel(index) {
    sembunyikanSemuaHalaman();
    areaGameEl.hidden = false;
    loadLevel(index);
}

document.querySelectorAll(".kartu-mode").forEach(function (tombol) {
    tombol.addEventListener("click", function () {
        mulaiMode(tombol.dataset.mode);
    });
});

// ---------- 12. MULAI GAME ----------
window.addEventListener("resize", function () {
    if (areaGameEl.hidden) return;
    resizeCanvas();
    draw();
});

tampilkanMenu();
