# ARCHITECTURE READINESS REVIEW (ARR)
**Platform:** agentx
**Tanggal:** 14 Juli 2026
**Tim Review:** Tim Implementasi (Implementation Team)

Dokumen ini merupakan hasil tinjauan kesiapan arsitektur (*Architecture Readiness Review*) yang menyeluruh terhadap *handbook* `agentx`. Tinjauan ini bertujuan untuk memastikan tidak ada celah, kontradiksi, atau ambiguitas sebelum penulisan kode produksi dimulai.

---

## 1. Analisis Kontradiksi

Secara umum, *handbook* dijaga dengan sangat ketat oleh Konstitusi (Volume 1), sehingga kontradiksi fatal sangat minim. Namun, ditemukan beberapa potensi konflik dan inkonsistensi tingkat lanjut:

1. **Aturan Import (Vol 1) vs Realita Vol 16 (Secrets)**
   - *Aturan:* Volume dengan nomor rendah tidak boleh mengimpor Volume bernomor tinggi (Volume 1 Bab 3).
   - *Realita:* Volume 4 (Provider) membutuhkan `CredentialResolver` dan `SecretStore` yang didefinisikan di Volume 16.
   - *Penyelesaian Arsitektural:* Tidak ada kontradiksi jika menggunakan pola *Dependency Inversion*. Volume 4 mendefinisikan *interface* kosong atau menerima dependensi via *injection*, dan Volume 16 menyediakan implementasinya. Saat implementasi, modul `provider-sdk` tidak boleh mengimpor `secrets` secara langsung.
2. **Perilaku `EnvVarSecretStore.set()` (RFC-0022 vs ADR-0004)**
   - *Inkonsistensi:* RFC-0022 menyebutkan bahwa operasi `set()` dan `delete()` pada *env-var backend* adalah "no-op" (tidak melakukan apa-apa). Namun, prinsip *fail-closed* di ADR-0004 dan standar DX mengharuskan sistem tidak boleh gagal secara diam-diam (*silent failure*).
   - *Resolusi Implementasi:* Metode ini harus melempar error (`OperationNotSupportedError`), bukan *no-op*.
3. **Status Performance Targets (EEP vs PERFORMANCE_TARGETS.md)**
   - *Kontradiksi:* Engineering Execution Program (EEP) mensyaratkan *Performance Review Gate*. Namun, dokumen `PERFORMANCE_TARGETS.md` masih berstatus "Draft". Kriteria exit untuk fase apa pun tidak dapat diselesaikan jika target ini tidak diratifikasi.

## 2. Validasi Dependensi Antar-Volume

Dependensi secara tertulis **sudah benar dan tervalidasi**. Platform menggunakan arsitektur berbasis *Event Bus* (Vol 2) dan *Dependency Inversion* yang membuat *coupling* antar-modul menjadi sangat rendah.

**Poin Penting untuk Implementasi:**
- **Urutan Implementasi ≠ Urutan Volume.**
- **Volume 16 (Secrets)** dan **Volume 15 (Identity)** memiliki nomor tinggi karena mereka baru ditambahkan ke spesifikasi, tetapi mereka adalah **ketergantungan dasar (root dependencies)**. `Volume 16` harus dibuat bahkan sebelum `Volume 2` (Core Runtime) dan `Volume 4` (Provider SDK).

## 3. Konsistensi Implementation Roadmap

Roadmap implementasi yang disusun **100% konsisten** dengan *Engineering Execution Program (EEP) v1.0* dan *Architecture Improvement Plan v1.0*.
- Pembagian paralel untuk SDK Layer (Agent SDK dan Provider SDK) sangat aman karena mereka diikat oleh abstraksi Core Runtime.
- Penempatan Dashboard dan Marketplace sebagai status "ditangguhkan" (Deferred) / diparkir sudah sesuai dengan instruksi di RFC-0039 dan ADR-0016.

## 4. Requirement yang Hilang (Missing Requirements)

Terdapat beberapa detail implementasi yang absen dari spesifikasi dan harus diputuskan sebelum kode ditulis:

1. **Konfigurasi Model "Rolling Summary" (Vol 6):** Memory Engine menyusutkan konteks menggunakan panggilan LLM. Tidak dijelaskan apakah ia menggunakan provider/model utama yang sama atau provider yang lebih ringan/murah.
2. **Skema IPC Plugin (RFC-0027):** Plugin berjalan di `child_process.fork()`. Dokumen menyebutkan komunikasi via "message port", namun tidak mendefinisikan *envelope schema* JSON untuk pertukaran pesan antara host dan sandbox.
3. **Lokasi Public Key Plugin (RFC-0027):** Dokumen menyebutkan verifikasi *signature* plugin tier *Verified*, tetapi tidak menyebutkan dari mana *host* membaca *public key* tersebut.
4. **Daftar Canonical BullMQ:** Topik antrian BullMQ secara implisit disamakan dengan *Event Bus topics* (Vol 2), namun tidak ada daftar spesifik antrian (misal: apakah dipisah per-agen atau satu antrian *scheduler* global).

## 5. Ambiguitas yang Berpotensi Menyebabkan Kesalahan

1. **Batas Transaksi Audit (ADR-0014):** ADR mengharuskan `INSERT ... RETURNING id` untuk log audit dilakukan dalam **satu transaksi database (DB transaction) yang sama** dengan perubahan *state* tugas. Mengingat Event Bus bersifat asinkron, hal ini ambigu. Jika *event* diterbitkan ke Redis lalu diproses, transaksi sudah berbeda.
   * *Mitigasi Implementasi:* Pola *transactional outbox* atau penyisipan log audit harus diikat sinkron (*synchronous*) dengan mutasi state di Prisma sebelum *event* dilempar ke Redis.
2. **Nilai Default `last-N` TaskContext (Vol 6):** Spesifikasi menyebutnya "configurable", tetapi jika tidak ada nilai default yang ditetapkan, developer bisa saja mengirim keseluruhan *history* dan menyebabkan *context window exceeded*.
3. **Konfigurasi Allowlist Shell (Vol 7):** Lokasi spesifik dalam `agentx.config.yaml` tidak dijabarkan.

## 6. Daftar Blocker Sebelum Coding

Seluruh tim implementasi **TIDAK BOLEH** menulis kode produksi sebelum hal-hal berikut diselesaikan (Fase 0):

1. **B-01:** Meratifikasi `PERFORMANCE_TARGETS.md` menjadi berstatus **Final** melalui pengajuan RFC dan ADR baru.
2. **B-02:** Membuat *custom* aturan ESLint untuk mencegah `AGENTX_SECRET_*` tercetak di log (memenuhi ADR-0012).
3. **B-03:** Membuat *package* `@agentx/handbook-lint` (sesuai RFC-0040) agar CI *pipeline* bisa berjalan.
4. **B-04:** Mendefinisikan letak pasti konfigurasi *allowlist shell* (`tools.shell.allowlist`) dan parameter default `last-N` (misal = 10) di skema konfigurasi Vol 9.

## 7. Daftar Asumsi Implementasi

Karena tidak boleh menebak di luar pedoman, jika spesifikasi diam, implementasi akan menggunakan asumsi konservatif berikut yang sejalan dengan Konstitusi:

1. **A-01:** Node.js/TypeScript akan dijalankan dengan konfigurasi `strict: true` dan pelarangan penggunaan tipe data `any` di *public interface* (sesuai RFC-0042).
2. **A-02:** Proses `LlmDecomposer` akan diulang (retry) maksimum 3 kali (sama dengan default Scheduler Vol 2) apabila gagal saat divalidasi oleh skema JSON (RFC-0004).
3. **A-03:** Metode `set()` pada `EnvVarSecretStore` akan *throw* `OperationNotSupportedError`, bukan gagal diam-diam.
4. **A-04:** Panggilan LLM untuk *rolling summary* (Vol 6) menggunakan *default provider* yang terkonfigurasi.
5. **A-05:** Lingkungan `child_process` (Tool SDK) secara eksplisit **menghapus** semua variabel lingkungan berawalan `AGENTX_SECRET_*` dari memori sebelum mengeksekusi shell pihak ketiga (mitigasi T-002).

## 8. Rekomendasi Struktur Repository Awal

Berdasarkan Volume 1 Bab 4, RFC-0039, dan praktik terbaik *pnpm workspace*, struktur *scaffolding* monorepo harus dieksekusi sebagai berikut (di dalam `/root/agentx/`):

```text
agentx/
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
├── agentx.config.yaml          # Konfigurasi workspace
├── apps/
│   ├── cli/                    # (Volume 9) Aplikasi Utama v0.1
│   └── dashboard/              # (RFC-0039) Ditahan hingga v1.0
├── packages/
│   ├── shared/                 # Tipe data, logger (Vol 13), utilitas
│   ├── secrets/                # (Volume 16) Harus dibangun pertama
│   ├── core-runtime/           # (Volume 2) Event Bus, Scheduler
│   ├── provider-sdk/           # (Volume 4) Abstraksi LLM
│   ├── tool-sdk/               # (Volume 7) Sandboxing & Izin
│   ├── agent-platform/         # (Volume 3) Logika Prompts & Agen
│   ├── workflow-engine/        # (Volume 5) DAG & Approval Gates
│   ├── memory-engine/          # (Volume 6) Prisma & Audit Log
│   ├── plugin-sdk/             # (Volume 8) Sandbox Ekstensi
│   └── auth/                   # (Volume 15) Identity Foundation
├── prisma/
│   └── schema.prisma           # Skema terpusat untuk Memory & Enterprise
└── tooling/
    └── handbook-lint/          # (RFC-0040) Linter untuk dokumentasi
```

## 9. Milestone Implementasi Lengkap (M1 sampai Rilis v0.1)

Urutan ini sangat ketat berdasarkan analisis grafik ketergantungan (Dependency Graph).

### **M0: Foundation & Tooling (Pre-requisite)**
*Pekerjaan: CI, Linters, dan Resolusi Blocker.*
* Membuat `@agentx/handbook-lint` (schema, xref, template linter).
* Menginisiasi *pnpm workspace*, ESLint custom rules (termasuk filter rahasia).
* Meratifikasi `PERFORMANCE_TARGETS.md`.

### **M1: Core Contracts**
*Pekerjaan: Membangun tulang punggung event dan resolusi kredensial.*
* **Vol 16 (Secrets):** `EnvVarSecretStore`, LRU Cache, antarmuka `CredentialResolver`.
* **Vol 2 (Core Runtime):** `EventBus` (BullMQ), State Machine Task, dan interface `Scheduler`.
* **Vol 4 (Provider):** Antarmuka utama dan 2 adapter (Anthropic & Google).
* **Vol 13 (Observability):** Structured JSON Logger (sebagai basis ke semua modul).

### **M2: Extensibility & Workflow**
*Pekerjaan: Memastikan agen dibatasi keamanannya dan alur graf berjalan.*
* **Vol 7 (Tool SDK):** Sandbox `fs.realpath()`, *allowlist shell*, fungsi *destructive classification*.
* **Vol 3 (Agent Platform):** Roster 4 agen, perakitan *system prompt*, `LlmDecomposer`.
* **Vol 5 (Workflow Engine):** Pembangunan graf tugas (topological sort), *Approval Gates* 2 lapis.

### **M3: v0.1 Release**
*Pekerjaan: Menggabungkan lapisan sistem menjadi satu produk (CLI).*
* **Vol 6 (Memory Engine):** Migrasi Prisma, trigger `BEFORE UPDATE/DELETE` pada Audit Log (ADR-0014), fungsi perhitungan hash berantai (RFC-0024).
* **Vol 9 (CLI Platform):** Perintah `submit`, `status`, `approve`, `reject`, `cost`, `audit`. UX *Approval prompt*.
* **Vol 14 (Testing):** Evaluasi *Golden Set* berjalan untuk memverifikasi output akhir.
* **Release Gate:** Uji integrasi ujung-ke-ujung (E2E), failover test, self-hosted check via `docker-compose`.

---
*Laporan Kesiapan Arsitektur selesai.*
*Semua blocker, asumsi, dan roadmap telah diverifikasi selaras dengan pedoman EEP v1.0.*
