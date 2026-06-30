"use client";

import { Fragment, useState, type ChangeEvent, type ComponentType, type ReactNode } from "react";
import {
  LayoutDashboard, Wallet, ArrowDownCircle, ArrowUpCircle, PiggyBank,
  BarChart3, Sparkles, FileText, Wallet2, Search, Plus, Filter,
  Download, ChevronRight, Eye, EyeOff, Mail, Lock, X, TrendingUp,
  TrendingDown, AlertTriangle, MoreHorizontal, Compass, MapPin,
  CreditCard, Smartphone, Banknote, Landmark, ShoppingBag, Utensils,
  Fuel, Zap, Droplet, Wifi, GraduationCap, Film, HeartPulse, Package,
  CheckCircle2, ChevronDown, Menu, Bell, Settings, LogOut, Flag,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
} from "recharts";

/* ----------------------------------------------------------------------- */
/*  DESIGN TOKENS                                                          */
/*  bg cream  #FAF8F4 | ink #15231C | forest #0F4C3A | gold #C99A4B        */
/*  mist #EFEBE3 | danger #D14B3D | line #E3DFD3                          */
/* ----------------------------------------------------------------------- */

type Tone = "neutral" | "good" | "warn" | "bad";
type PageSetter = (open: boolean) => void;
type IconType = ComponentType<{ size?: number; className?: string }>;
type CategoryMeta = {
  icon: IconType;
  color: string;
};

const COLORS = {
  forest: "#0F4C3A",
  forestDeep: "#0A3528",
  gold: "#C99A4B",
  goldSoft: "#E7CC9C",
  ink: "#15231C",
  danger: "#D14B3D",
  mist: "#EFEBE3",
};

const CATEGORY_META: Record<string, CategoryMeta> = {
  Makanan: { icon: Utensils, color: "#C99A4B" },
  Belanja: { icon: ShoppingBag, color: "#7D8F69" },
  "Bahan Bakar": { icon: Fuel, color: "#9A6B4F" },
  Listrik: { icon: Zap, color: "#D9A93C" },
  Air: { icon: Droplet, color: "#5C8C8A" },
  Internet: { icon: Wifi, color: "#4A6E8C" },
  Pendidikan: { icon: GraduationCap, color: "#6B5B95" },
  Hiburan: { icon: Film, color: "#B05C6B" },
  Kesehatan: { icon: HeartPulse, color: "#C0584A" },
  Lainnya: { icon: Package, color: "#8C8579" },
};

const fmtIDR = (n: number) =>
  "Rp" + Math.round(n).toLocaleString("id-ID", { maximumFractionDigits: 0 });

/* ----------------------------------------------------------------------- */
/*  DUMMY DATA                                                             */
/* ----------------------------------------------------------------------- */

const monthlyTrend = [
  { month: "Jan", income: 18500000, expense: 12200000 },
  { month: "Feb", income: 18500000, expense: 13800000 },
  { month: "Mar", income: 19200000, expense: 14100000 },
  { month: "Apr", income: 18500000, expense: 11900000 },
  { month: "Mei", income: 21000000, expense: 15400000 },
  { month: "Jun", income: 18500000, expense: 14700000 },
];

const expenseByCategory = [
  { name: "Makanan", value: 3850000 },
  { name: "Belanja", value: 2620000 },
  { name: "Bahan Bakar", value: 980000 },
  { name: "Listrik", value: 740000 },
  { name: "Internet", value: 450000 },
  { name: "Pendidikan", value: 2100000 },
  { name: "Hiburan", value: 610000 },
  { name: "Kesehatan", value: 980000 },
  { name: "Lainnya", value: 420000 },
];

const accounts = [
  { id: 1, name: "Tunai", type: "Cash", balance: 1850000, icon: Banknote, tone: "#7D8F69" },
  { id: 2, name: "BNI Tabungan", type: "Bank", balance: 14250000, icon: Landmark, tone: "#0F4C3A" },
  { id: 3, name: "BCA Payroll", type: "Bank", balance: 8420000, icon: Landmark, tone: "#4A6E8C" },
  { id: 4, name: "OVO", type: "E-Wallet", balance: 620000, icon: Smartphone, tone: "#9A6B4F" },
  { id: 5, name: "GoPay", type: "E-Wallet", balance: 415000, icon: Smartphone, tone: "#C99A4B" },
];

const transactions = [
  { id: 1, type: "expense", category: "Makanan", desc: "Belanja bulanan Superindo", amount: 540000, date: "2026-06-28", method: "BCA", icon: Utensils },
  { id: 2, type: "income", category: "Gaji", desc: "Gaji bulanan", amount: 18500000, date: "2026-06-25", method: "BNI", icon: ArrowUpCircle },
  { id: 3, type: "expense", category: "Listrik", desc: "Token listrik PLN", amount: 350000, date: "2026-06-24", method: "OVO", icon: Zap },
  { id: 4, type: "expense", category: "Pendidikan", desc: "SPP sekolah anak", amount: 2100000, date: "2026-06-22", method: "BCA", icon: GraduationCap },
  { id: 5, type: "expense", category: "Bahan Bakar", desc: "Isi bensin Pertamina", amount: 200000, date: "2026-06-20", method: "Tunai", icon: Fuel },
  { id: 6, type: "income", category: "Freelance", desc: "Proyek desain logo", amount: 1500000, date: "2026-06-18", method: "GoPay", icon: ArrowUpCircle },
  { id: 7, type: "expense", category: "Hiburan", desc: "Netflix & Spotify", amount: 165000, date: "2026-06-15", method: "BCA", icon: Film },
  { id: 8, type: "expense", category: "Kesehatan", desc: "Vitamin & obat keluarga", amount: 280000, date: "2026-06-12", method: "Tunai", icon: HeartPulse },
];

const incomesData = [
  { id: 1, source: "Gaji Bulanan", amount: 18500000, date: "2026-06-25", notes: "Gaji pokok + tunjangan" },
  { id: 2, source: "Freelance Desain", amount: 1500000, date: "2026-06-18", notes: "Proyek logo klien" },
  { id: 3, source: "Dividen Saham", amount: 420000, date: "2026-06-10", notes: "Dividen kuartalan" },
  { id: 4, source: "Jual Barang Bekas", amount: 350000, date: "2026-06-05", notes: "Sepeda anak" },
  { id: 5, source: "Bonus Proyek", amount: 2000000, date: "2026-05-29", notes: "Bonus akhir proyek kantor" },
];

const expensesData = [
  { id: 1, category: "Makanan", desc: "Belanja bulanan Superindo", amount: 540000, method: "BCA", date: "2026-06-28", notes: "Stok bulanan" },
  { id: 2, category: "Listrik", desc: "Token listrik PLN", amount: 350000, method: "OVO", date: "2026-06-24", notes: "" },
  { id: 3, category: "Pendidikan", desc: "SPP sekolah anak", amount: 2100000, method: "BCA", date: "2026-06-22", notes: "Semester ganjil" },
  { id: 4, category: "Bahan Bakar", desc: "Isi bensin Pertamina", amount: 200000, method: "Tunai", date: "2026-06-20", notes: "" },
  { id: 5, category: "Hiburan", desc: "Netflix & Spotify", amount: 165000, method: "BCA", date: "2026-06-15", notes: "Subscription bulanan" },
  { id: 6, category: "Kesehatan", desc: "Vitamin & obat keluarga", amount: 280000, method: "Tunai", date: "2026-06-12", notes: "" },
  { id: 7, category: "Belanja", desc: "Baju anak sekolah", amount: 620000, method: "GoPay", date: "2026-06-08", notes: "" },
  { id: 8, category: "Internet", desc: "Indihome bulanan", amount: 450000, method: "BCA", date: "2026-06-03", notes: "" },
];

const budgets = [
  { category: "Makanan", budget: 4000000, used: 3850000 },
  { category: "Belanja", budget: 2000000, used: 2620000 },
  { category: "Bahan Bakar", budget: 1200000, used: 980000 },
  { category: "Listrik", budget: 800000, used: 740000 },
  { category: "Air", budget: 300000, used: 210000 },
  { category: "Internet", budget: 450000, used: 450000 },
  { category: "Pendidikan", budget: 2200000, used: 2100000 },
  { category: "Hiburan", budget: 500000, used: 610000 },
  { category: "Kesehatan", budget: 700000, used: 980000 },
  { category: "Lainnya", budget: 500000, used: 420000 },
];

const insights = [
  { icon: TrendingUp, tone: "warn", text: "Pengeluaran Makanan naik 18% dibanding bulan lalu." },
  { icon: ShoppingBag, tone: "info", text: "Kategori dengan pengeluaran terbesar bulan ini adalah Belanja." },
  { icon: Sparkles, tone: "good", text: "Jika pola pengeluaran tetap seperti sekarang, estimasi saldo akhir bulan sekitar Rp10.500.000." },
  { icon: PiggyBank, tone: "good", text: "Tingkat tabungan bulan ini sangat baik, naik 6% dari target." },
];

const journeyMilestones = [
  { label: "Mulai", done: true },
  { label: "Dana Darurat", done: true },
  { label: "Lunas Hutang", done: true },
  { label: "Liburan Keluarga", done: false, current: true },
  { label: "Rumah Idaman", done: false },
];

/* ----------------------------------------------------------------------- */
/*  SHARED UI PRIMITIVES                                                   */
/* ----------------------------------------------------------------------- */

function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={
        "rounded-2xl border border-[#E3DFD3] bg-white/70 backdrop-blur-xl shadow-[0_4px_24px_-8px_rgba(15,76,58,0.12)] " +
        className
      }
    >
      {children}
    </div>
  );
}

function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  const tones = {
    neutral: "bg-[#EFEBE3] text-[#5B5446]",
    good: "bg-[#E7F0E5] text-[#2C5E3F]",
    warn: "bg-[#FBEFD9] text-[#8A5A1F]",
    bad: "bg-[#FBE6E3] text-[#A23A2D]",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

function ProgressBar({ percent, danger }: { percent: number; danger?: boolean }) {
  const pct = Math.min(percent, 100);
  return (
    <div className="h-2 w-full rounded-full bg-[#EFEBE3] overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${pct}%`,
          background: danger
            ? "linear-gradient(90deg,#E2685B,#D14B3D)"
            : "linear-gradient(90deg,#1C6B4F,#0F4C3A)",
        }}
      />
    </div>
  );
}

function PrimaryButton({ children, onClick, className = "", icon: Icon }: { children: ReactNode; onClick?: () => void; className?: string; icon?: IconType }) {
  return (
    <button
      onClick={onClick}
      className={
        "inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F4C3A] px-4 py-2.5 text-sm font-medium text-white shadow-[0_8px_20px_-8px_rgba(15,76,58,0.55)] transition-all hover:bg-[#0A3528] hover:shadow-[0_10px_24px_-6px_rgba(15,76,58,0.6)] active:scale-[0.98] " +
        className
      }
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, className = "", icon: Icon }: { children: ReactNode; onClick?: () => void; className?: string; icon?: IconType }) {
  return (
    <button
      onClick={onClick}
      className={
        "inline-flex items-center justify-center gap-2 rounded-xl border border-[#E3DFD3] bg-white px-4 py-2.5 text-sm font-medium text-[#15231C] transition-all hover:border-[#0F4C3A]/40 hover:bg-[#FAF8F4] active:scale-[0.98] " +
        className
      }
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0A1410]/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-[#E3DFD3] bg-[#FFFEFB] p-6 shadow-2xl animate-[fadeIn_.2s_ease]">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#15231C]" style={{ fontFamily: "Outfit, sans-serif" }}>{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[#8C8579] hover:bg-[#EFEBE3]">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-xs font-medium text-[#5B5446]">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-[#E3DFD3] bg-white px-3.5 py-2.5 text-sm text-[#15231C] placeholder:text-[#A8A192] outline-none transition-all focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/15";
const tooltipFormatter = ((value: any) => fmtIDR(Number(value ?? 0))) as any;

/* ----------------------------------------------------------------------- */
/*  LOGIN PAGE                                                             */
/* ----------------------------------------------------------------------- */

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [showPw, setShowPw] = useState(false);
  return (
    <div className="flex min-h-screen w-full bg-[#FAF8F4]" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Left illustration panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#0F4C3A] p-12 text-white lg:flex">
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }} />
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
            <Compass size={18} />
          </div>
          <span className="text-lg font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>New Journey</span>
        </div>

        <div className="relative z-10">
          <h1 className="mb-4 max-w-md text-4xl font-semibold leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
            Setiap rupiah punya tujuan.
          </h1>
          <p className="max-w-sm text-white/70">
            Kelola keuangan keluarga dengan mudah, dan lihat perjalanan finansialmu terbentang jelas — dari hari ini sampai tujuan besar.
          </p>

          {/* Journey path illustration */}
          <div className="mt-10 flex items-center gap-0">
            {journeyMilestones.map((m, i) => (
              <Fragment key={m.label}>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 ${m.done ? "border-[#C99A4B] bg-[#C99A4B]" : m.current ? "border-white bg-transparent" : "border-white/30 bg-transparent"
                      }`}
                  >
                    {m.done ? <CheckCircle2 size={16} /> : m.current ? <MapPin size={14} /> : null}
                  </div>
                  <span className="w-16 text-center text-[10px] leading-tight text-white/60">{m.label}</span>
                </div>
                {i < journeyMilestones.length - 1 && (
                  <div className={`h-[2px] w-10 ${m.done ? "bg-[#C99A4B]" : "bg-white/20"}`} />
                )}
              </Fragment>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/40">© 2026 New Journey. Dibuat untuk keluarga Indonesia.</p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F4C3A] text-white">
              <Compass size={18} />
            </div>
            <span className="text-lg font-semibold text-[#15231C]" style={{ fontFamily: "Outfit, sans-serif" }}>New Journey</span>
          </div>

          <h2 className="text-2xl font-semibold text-[#15231C]" style={{ fontFamily: "Outfit, sans-serif" }}>Selamat datang kembali</h2>
          <p className="mt-1.5 mb-8 text-sm text-[#5B5446]">Masuk untuk melanjutkan perjalanan keuanganmu.</p>

          <Field label="Email">
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A192]" />
              <input type="email" placeholder="nama@email.com" defaultValue="budi.santoso@email.com" className={inputCls + " pl-10"} />
            </div>
          </Field>

          <Field label="Password">
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A192]" />
              <input type={showPw ? "text" : "password"} placeholder="••••••••" defaultValue="passwordku123" className={inputCls + " pl-10 pr-10"} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A8A192]">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>

          <div className="mb-6 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-[#5B5446]">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-[#E3DFD3] text-[#0F4C3A] focus:ring-[#0F4C3A]/30" />
              Ingat saya
            </label>
            <button className="text-sm font-medium text-[#0F4C3A] hover:underline">Lupa password?</button>
          </div>

          <PrimaryButton className="w-full py-3" onClick={onLogin}>Masuk</PrimaryButton>

          <p className="mt-6 text-center text-sm text-[#5B5446]">
            Belum punya akun? <button className="font-medium text-[#0F4C3A] hover:underline">Buat akun baru</button>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/*  SIDEBAR / NAVBAR                                                       */
/* ----------------------------------------------------------------------- */

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "income", label: "Pemasukan", icon: ArrowUpCircle },
  { key: "expense", label: "Pengeluaran", icon: ArrowDownCircle },
  { key: "budget", label: "Anggaran", icon: PiggyBank },
  { key: "accounts", label: "Akun", icon: Wallet2 },
  { key: "analytics", label: "Analitik", icon: BarChart3 },
  { key: "insight", label: "AI Insight", icon: Sparkles },
  { key: "reports", label: "Laporan", icon: FileText },
];

function Sidebar({ page, setPage, mobileOpen, setMobileOpen }: { page: string; setPage: (page: string) => void; mobileOpen: boolean; setMobileOpen: PageSetter }) {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[82vw] max-w-80 flex-col border-r border-[#E3DFD3] bg-[#FFFEFB] shadow-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-64 lg:max-w-none lg:translate-x-0 lg:shadow-none ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          } overflow-y-auto`}
      >
        <div className="flex items-center gap-2.5 px-6 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F4C3A] text-white">
            <Compass size={18} />
          </div>
          <span className="text-lg font-semibold text-[#15231C]" style={{ fontFamily: "Outfit, sans-serif" }}>New Journey</span>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = page === item.key;
            return (
              <button
                key={item.key}
                onClick={() => { setPage(item.key); setMobileOpen(false); }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${active ? "bg-[#0F4C3A] text-white shadow-[0_6px_16px_-6px_rgba(15,76,58,0.5)]" : "text-[#5B5446] hover:bg-[#EFEBE3]"
                  }`}
              >
                <Icon size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mx-3 mb-4 rounded-2xl bg-[#EFEBE3] p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-[#5B5446]">
            <Flag size={13} className="text-[#C99A4B]" /> Perjalanan saat ini
          </div>
          <p className="text-sm font-semibold text-[#15231C]">Liburan Keluarga</p>
          <div className="mt-2"><ProgressBar percent={62} /></div>
          <p className="mt-1.5 text-xs text-[#5B5446]">Rp9.300.000 dari Rp15.000.000</p>
        </div>

        <div className="flex items-center gap-3 border-t border-[#E3DFD3] px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C99A4B] text-sm font-semibold text-white">BS</div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-[#15231C]">Budi Santoso</p>
            <p className="truncate text-xs text-[#8C8579]">budi.santoso@email.com</p>
          </div>
          <LogOut size={16} className="text-[#8C8579]" />
        </div>
      </aside>
    </>
  );
}

function Topbar({ title, subtitle, setMobileOpen }: { title: string; subtitle?: string; setMobileOpen: PageSetter }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3 sm:mb-7 sm:gap-4">
      <div className="flex items-center gap-3">
        <button aria-label="Open navigation menu" className="rounded-lg p-2.5 text-[#5B5446] hover:bg-[#EFEBE3] lg:hidden" onClick={() => setMobileOpen(true)}>
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-[#15231C] sm:text-2xl" style={{ fontFamily: "Outfit, sans-serif" }}>{title}</h1>
          {subtitle && <p className="mt-0.5 text-xs text-[#5B5446] sm:text-sm">{subtitle}</p>}
        </div>
      </div>
      <div className="hidden items-center gap-2.5 sm:flex">
        <button className="hidden rounded-xl border border-[#E3DFD3] bg-white p-2.5 text-[#5B5446] hover:bg-[#FAF8F4] sm:flex">
          <Bell size={17} />
        </button>
        <button className="hidden rounded-xl border border-[#E3DFD3] bg-white p-2.5 text-[#5B5446] hover:bg-[#FAF8F4] sm:flex">
          <Settings size={17} />
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/*  DASHBOARD PAGE                                                         */
/* ----------------------------------------------------------------------- */

function SummaryCard({ label, value, icon: Icon, tone, trend, sub }: { label: string; value: string; icon: IconType; tone: "forest" | "light"; trend?: number; sub?: string }) {
  const toneStyles = {
    forest: { bg: "#0F4C3A", text: "white", iconBg: "rgba(255,255,255,0.15)" },
    light: { bg: "white", text: "#15231C", iconBg: "#EFEBE3" },
  };
  const s = toneStyles[tone] || toneStyles.light;
  return (
    <GlassCard className={`p-5 ${tone === "forest" ? "" : ""}`}>
      <div style={{ background: s.bg, color: s.text }} className="-m-px rounded-2xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <div style={{ background: s.iconBg }} className="flex h-10 w-10 items-center justify-center rounded-xl">
            <Icon size={18} />
          </div>
          {trend && (
            <span className={`flex items-center gap-1 text-xs font-medium ${trend > 0 ? (tone === "forest" ? "text-[#D9EFE2]" : "text-[#2C5E3F]") : "text-[#E2685B]"}`}>
              {trend > 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
        <p className={`text-xs font-medium ${tone === "forest" ? "text-white/70" : "text-[#8C8579]"}`}>{label}</p>
        <p className="mt-1 text-xl font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>{value}</p>
        {sub && <p className={`mt-1 text-xs ${tone === "forest" ? "text-white/60" : "text-[#A8A192]"}`}>{sub}</p>}
      </div>
    </GlassCard>
  );
}

function DashboardPage({ setMobileOpen }: { setMobileOpen: PageSetter }) {
  const totalIncome = 19000000;
  const totalExpense = 12420000;
  const balance = 25555000;
  const remainingBudget = 12780000 - totalExpense + 12420000; // dummy calc, kept simple below
  return (
    <div>
      <Topbar title="Dashboard" subtitle="Ringkasan keuangan keluarga, Juni 2026" setMobileOpen={setMobileOpen} />

      {/* Summary grid */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        <SummaryCard label="Saldo Saat Ini" value={fmtIDR(balance)} icon={Wallet} tone="forest" trend={4.2} sub="Gabungan semua akun" />
        <SummaryCard label="Total Pemasukan" value={fmtIDR(totalIncome)} icon={ArrowUpCircle} tone="light" trend={2.6} sub="Bulan ini" />
        <SummaryCard label="Total Pengeluaran" value={fmtIDR(totalExpense)} icon={ArrowDownCircle} tone="light" trend={-8.1} sub="Bulan ini" />
        <SummaryCard label="Sisa Anggaran" value={fmtIDR(2480000)} icon={PiggyBank} tone="light" sub="Dari Rp14.900.000" />
        <SummaryCard label="Target Tabungan" value={fmtIDR(15000000)} icon={Flag} tone="light" sub="62% tercapai" />
        <SummaryCard label="Perjalanan Aktif" value="Liburan Keluarga" icon={Compass} tone="light" sub="Milestone ke-4 dari 5" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
        {/* Monthly expense chart */}
        <GlassCard className="col-span-1 p-4 sm:p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#15231C]" style={{ fontFamily: "Outfit, sans-serif" }}>Tren Pemasukan & Pengeluaran</h3>
              <p className="text-xs text-[#8C8579]">6 bulan terakhir</p>
            </div>
            <Pill tone="good">+ Surplus stabil</Pill>
          </div>
          <div className="h-56 w-full sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0F4C3A" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#0F4C3A" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C99A4B" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#C99A4B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3DFD3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8C8579" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#8C8579" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000000}jt`} />
                <Tooltip formatter={tooltipFormatter} contentStyle={{ borderRadius: 12, border: "1px solid #E3DFD3" }} />
                <Area type="monotone" dataKey="income" stroke="#0F4C3A" strokeWidth={2.5} fill="url(#incomeGrad)" name="Pemasukan" />
                <Area type="monotone" dataKey="expense" stroke="#C99A4B" strokeWidth={2.5} fill="url(#expenseGrad)" name="Pengeluaran" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Expense categories pie */}
        <GlassCard className="p-4 sm:p-5">
          <h3 className="mb-1 font-semibold text-[#15231C]" style={{ fontFamily: "Outfit, sans-serif" }}>Kategori Pengeluaran</h3>
          <p className="mb-4 text-xs text-[#8C8579]">Distribusi bulan ini</p>
          <div className="h-52 w-full sm:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenseByCategory} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={2}>
                  {expenseByCategory.map((e) => (
                    <Cell key={e.name} fill={CATEGORY_META[e.name]?.color || "#8C8579"} />
                  ))}
                </Pie>
                <Tooltip formatter={tooltipFormatter} contentStyle={{ borderRadius: 12, border: "1px solid #E3DFD3" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-x-3 gap-y-1.5 sm:grid-cols-2">
            {expenseByCategory.slice(0, 6).map((e) => (
              <div key={e.name} className="flex items-center gap-1.5 text-xs text-[#5B5446]">
                <span className="h-2 w-2 rounded-full" style={{ background: CATEGORY_META[e.name]?.color }} />
                <span className="truncate">{e.name}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
        {/* Recent transactions */}
        <GlassCard className="col-span-1 p-4 sm:p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-[#15231C]" style={{ fontFamily: "Outfit, sans-serif" }}>Transaksi Terbaru</h3>
            <button className="text-sm font-medium text-[#0F4C3A] hover:underline">Lihat semua</button>
          </div>
          <div className="divide-y divide-[#EFEBE3]">
            {transactions.slice(0, 5).map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.type === "income" ? "bg-[#E7F0E5] text-[#2C5E3F]" : "bg-[#EFEBE3] text-[#5B5446]"}`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#15231C]">{t.desc}</p>
                      <p className="text-xs text-[#8C8579]">{t.category} · {t.date}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-semibold ${t.type === "income" ? "text-[#2C5E3F]" : "text-[#15231C]"}`}>
                    {t.type === "income" ? "+" : "-"}{fmtIDR(t.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Quick actions + budget progress */}
        <div className="flex flex-col gap-4 sm:gap-5">
          <GlassCard className="p-4 sm:p-5">
            <h3 className="mb-4 font-semibold text-[#15231C]" style={{ fontFamily: "Outfit, sans-serif" }}>Aksi Cepat</h3>
            <div className="space-y-2.5">
              <PrimaryButton className="w-full" icon={Plus}>Tambah Pemasukan</PrimaryButton>
              <GhostButton className="w-full" icon={Plus}>Tambah Pengeluaran</GhostButton>
              <GhostButton className="w-full" icon={Download}>Export Laporan</GhostButton>
            </div>
          </GlassCard>

          <GlassCard className="p-4 sm:p-5">
            <h3 className="mb-4 font-semibold text-[#15231C]" style={{ fontFamily: "Outfit, sans-serif" }}>Progres Anggaran</h3>
            <div className="space-y-4">
              {budgets.slice(0, 3).map((b) => {
                const pct = (b.used / b.budget) * 100;
                const over = pct > 100;
                return (
                  <div key={b.category}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="font-medium text-[#15231C]">{b.category}</span>
                      <span className={over ? "text-[#D14B3D]" : "text-[#8C8579]"}>{Math.round(pct)}%</span>
                    </div>
                    <ProgressBar percent={pct} danger={over} />
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/*  INCOME PAGE                                                            */
/* ----------------------------------------------------------------------- */

function IncomePage({ setMobileOpen }: { setMobileOpen: PageSetter }) {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = incomesData.filter((i) =>
    i.source.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Topbar title="Pemasukan" subtitle="Catat dan pantau seluruh sumber pemasukan keluarga" setMobileOpen={setMobileOpen} />

      <GlassCard className="p-4 sm:p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A192]" />
            <input
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              placeholder="Cari sumber pemasukan..."
              className={inputCls + " pl-10"}
            />
          </div>
          <PrimaryButton icon={Plus} onClick={() => setModalOpen(true)} className="w-full sm:w-auto">Tambah Pemasukan</PrimaryButton>
        </div>

        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#E3DFD3] text-xs uppercase tracking-wide text-[#8C8579]">
                <th className="py-3 pr-4 font-medium">Sumber</th>
                <th className="py-3 pr-4 font-medium">Tanggal</th>
                <th className="py-3 pr-4 font-medium">Catatan</th>
                <th className="py-3 pr-4 text-right font-medium">Jumlah</th>
                <th className="py-3 pl-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEBE3]">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-[#FAF8F4]">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E7F0E5] text-[#2C5E3F]">
                        <ArrowUpCircle size={14} />
                      </div>
                      <span className="font-medium text-[#15231C]">{row.source}</span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 text-[#5B5446]">{row.date}</td>
                  <td className="py-3.5 pr-4 max-w-xs truncate text-[#8C8579]">{row.notes}</td>
                  <td className="py-3.5 pr-4 text-right font-semibold text-[#2C5E3F]">+{fmtIDR(row.amount)}</td>
                  <td className="py-3.5 pl-4 text-right">
                    <button className="rounded-lg p-1.5 text-[#A8A192] hover:bg-[#EFEBE3]"><MoreHorizontal size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 sm:hidden">
          {filtered.map((row) => (
            <div key={row.id} className="rounded-2xl border border-[#E3DFD3] bg-white p-4 shadow-[0_2px_12px_-10px_rgba(15,76,58,0.25)]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E7F0E5] text-[#2C5E3F]">
                    <ArrowUpCircle size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#15231C]">{row.source}</p>
                    <p className="mt-0.5 text-xs text-[#8C8579]">{row.date}</p>
                  </div>
                </div>
                <p className="shrink-0 text-sm font-semibold text-[#2C5E3F]">+{fmtIDR(row.amount)}</p>
              </div>
              <p className="mt-3 line-clamp-2 text-xs text-[#5B5446]">{row.notes}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Tambah Pemasukan">
        <Field label="Sumber"><input className={inputCls} placeholder="Gaji, Freelance, dll." /></Field>
        <Field label="Jumlah"><input className={inputCls} placeholder="Rp0" /></Field>
        <Field label="Tanggal"><input type="date" className={inputCls} /></Field>
        <Field label="Catatan"><textarea className={inputCls} rows={3} placeholder="Tambahkan catatan (opsional)" /></Field>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <GhostButton className="w-full flex-1" onClick={() => setModalOpen(false)}>Batal</GhostButton>
          <PrimaryButton className="w-full flex-1" onClick={() => setModalOpen(false)}>Simpan Pemasukan</PrimaryButton>
        </div>
      </Modal>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/*  EXPENSE PAGE                                                           */
/* ----------------------------------------------------------------------- */

function ExpensePage({ setMobileOpen }: { setMobileOpen: PageSetter }) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("Semua");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = expensesData.filter(
    (e) =>
      (filterCat === "Semua" || e.category === filterCat) &&
      e.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Topbar title="Pengeluaran" subtitle="Lacak semua pengeluaran rumah tangga secara rinci" setMobileOpen={setMobileOpen} />

      <GlassCard className="p-4 sm:p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A192]" />
              <input
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                placeholder="Cari pengeluaran..."
                className={inputCls + " pl-10"}
              />
            </div>
            <div className="relative w-full sm:w-48">
              <Filter size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A192]" />
              <select
                value={filterCat}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterCat(e.target.value)}
                className={inputCls + " appearance-none pl-10"}
              >
                <option>Semua</option>
                {Object.keys(CATEGORY_META).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A8A192]" />
            </div>
          </div>
          <PrimaryButton icon={Plus} onClick={() => setModalOpen(true)} className="w-full sm:w-auto">Tambah Pengeluaran</PrimaryButton>
        </div>

        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#E3DFD3] text-xs uppercase tracking-wide text-[#8C8579]">
                <th className="py-3 pr-4 font-medium">Deskripsi</th>
                <th className="py-3 pr-4 font-medium">Kategori</th>
                <th className="py-3 pr-4 font-medium">Metode</th>
                <th className="py-3 pr-4 font-medium">Tanggal</th>
                <th className="py-3 pr-4 text-right font-medium">Jumlah</th>
                <th className="py-3 pl-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEBE3]">
              {filtered.map((row) => {
                const meta = CATEGORY_META[row.category];
                const Icon = meta?.icon || Package;
                return (
                  <tr key={row.id} className="hover:bg-[#FAF8F4]">
                    <td className="py-3.5 pr-4 font-medium text-[#15231C]">{row.desc}</td>
                    <td className="py-3.5 pr-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: `${meta?.color}1A`, color: meta?.color }}>
                        <Icon size={12} /> {row.category}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-[#5B5446]">{row.method}</td>
                    <td className="py-3.5 pr-4 text-[#5B5446]">{row.date}</td>
                    <td className="py-3.5 pr-4 text-right font-semibold text-[#15231C]">-{fmtIDR(row.amount)}</td>
                    <td className="py-3.5 pl-4 text-right">
                      <button className="rounded-lg p-1.5 text-[#A8A192] hover:bg-[#EFEBE3]"><MoreHorizontal size={16} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 sm:hidden">
          {filtered.map((row) => {
            const meta = CATEGORY_META[row.category];
            const Icon = meta?.icon || Package;
            return (
              <div key={row.id} className="rounded-2xl border border-[#E3DFD3] bg-white p-4 shadow-[0_2px_12px_-10px_rgba(15,76,58,0.25)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#15231C]">{row.desc}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: `${meta?.color}1A`, color: meta?.color }}>
                        <Icon size={12} /> {row.category}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-[#EFEBE3] px-2.5 py-1 text-xs font-medium text-[#5B5446]">{row.method}</span>
                    </div>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-[#15231C]">-{fmtIDR(row.amount)}</p>
                </div>
                <div className="mt-3 text-xs text-[#8C8579]">{row.date}</div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Tambah Pengeluaran">
        <Field label="Kategori">
          <select className={inputCls}>
            {Object.keys(CATEGORY_META).map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Jumlah"><input className={inputCls} placeholder="Rp0" /></Field>
        <Field label="Metode Pembayaran">
          <select className={inputCls}>
            <option>Tunai</option><option>BNI</option><option>BCA</option><option>OVO</option><option>GoPay</option>
          </select>
        </Field>
        <Field label="Tanggal"><input type="date" className={inputCls} /></Field>
        <Field label="Catatan"><textarea className={inputCls} rows={3} placeholder="Tambahkan catatan (opsional)" /></Field>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <GhostButton className="w-full flex-1" onClick={() => setModalOpen(false)}>Batal</GhostButton>
          <PrimaryButton className="w-full flex-1" onClick={() => setModalOpen(false)}>Simpan Pengeluaran</PrimaryButton>
        </div>
      </Modal>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/*  BUDGET PAGE                                                            */
/* ----------------------------------------------------------------------- */

function BudgetPage({ setMobileOpen }: { setMobileOpen: PageSetter }) {
  return (
    <div>
      <Topbar title="Anggaran" subtitle="Pantau penggunaan anggaran per kategori bulan ini" setMobileOpen={setMobileOpen} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {budgets.map((b) => {
          const meta = CATEGORY_META[b.category];
          const Icon = meta?.icon || Package;
          const pct = (b.used / b.budget) * 100;
          const over = pct > 100;
          const remaining = b.budget - b.used;
          return (
            <GlassCard key={b.category} className={`p-5 ${over ? "ring-1 ring-[#D14B3D]/40" : ""}`}>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${meta?.color}1A`, color: meta?.color }}>
                    <Icon size={16} />
                  </div>
                  <span className="font-medium text-[#15231C]">{b.category}</span>
                </div>
                {over && <Pill tone="bad"><AlertTriangle size={12} /> Lebih</Pill>}
              </div>

              <div className="mb-3 flex items-baseline justify-between">
                <span className="text-lg font-semibold text-[#15231C]" style={{ fontFamily: "Outfit, sans-serif" }}>{fmtIDR(b.used)}</span>
                <span className="text-xs text-[#8C8579]">dari {fmtIDR(b.budget)}</span>
              </div>

              <ProgressBar percent={pct} danger={over} />

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className={over ? "font-medium text-[#D14B3D]" : "text-[#5B5446]"}>
                  {over ? `Melebihi ${fmtIDR(Math.abs(remaining))}` : `Sisa ${fmtIDR(remaining)}`}
                </span>
                <span className="text-[#8C8579]">{Math.round(pct)}%</span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/*  ACCOUNTS PAGE                                                         */
/* ----------------------------------------------------------------------- */

function AccountsPage({ setMobileOpen }: { setMobileOpen: PageSetter }) {
  const total = accounts.reduce((s, a) => s + a.balance, 0);
  return (
    <div>
      <Topbar title="Akun" subtitle="Semua rekening dan dompet digital keluarga dalam satu tempat" setMobileOpen={setMobileOpen} />

      <GlassCard className="mb-6 p-6">
        <div style={{ background: COLORS.forest }} className="-m-px flex flex-col items-start justify-between gap-4 rounded-2xl p-6 text-white sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-white/70">Total Saldo Gabungan</p>
            <p className="mt-1 text-3xl font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>{fmtIDR(total)}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
            <Wallet size={22} />
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((a) => {
          const Icon = a.icon;
          return (
            <GlassCard key={a.id} className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${a.tone}1A`, color: a.tone }}>
                  <Icon size={18} />
                </div>
                <Pill>{a.type}</Pill>
              </div>
              <p className="text-sm font-medium text-[#5B5446]">{a.name}</p>
              <p className="mt-1 text-xl font-semibold text-[#15231C]" style={{ fontFamily: "Outfit, sans-serif" }}>{fmtIDR(a.balance)}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-[#0F4C3A]">
                Lihat riwayat transaksi <ChevronRight size={13} />
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/*  ANALYTICS PAGE                                                        */
/* ----------------------------------------------------------------------- */

function AnalyticsPage({ setMobileOpen }: { setMobileOpen: PageSetter }) {
  const barData = expenseByCategory.map((e) => ({ name: e.name, value: e.value }));
  const topCategories = [...expenseByCategory].sort((a, b) => b.value - a.value).slice(0, 5);
  return (
    <div>
      <Topbar title="Analitik" subtitle="Pahami pola pengeluaran keluarga lebih dalam" setMobileOpen={setMobileOpen} />

      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
        <GlassCard className="p-4 sm:p-5">
          <h3 className="mb-1 font-semibold text-[#15231C]" style={{ fontFamily: "Outfit, sans-serif" }}>Distribusi Kategori</h3>
          <p className="mb-4 text-xs text-[#8C8579]">Persentase pengeluaran bulan ini</p>
          <div className="h-60 w-full sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenseByCategory} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={2}>
                  {expenseByCategory.map((e) => (
                    <Cell key={e.name} fill={CATEGORY_META[e.name]?.color || "#8C8579"} />
                  ))}
                </Pie>
                <Tooltip formatter={tooltipFormatter} contentStyle={{ borderRadius: 12, border: "1px solid #E3DFD3" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-4 sm:p-5">
          <h3 className="mb-1 font-semibold text-[#15231C]" style={{ fontFamily: "Outfit, sans-serif" }}>Perbandingan Kategori</h3>
          <p className="mb-4 text-xs text-[#8C8579]">Jumlah pengeluaran per kategori</p>
          <div className="h-60 w-full sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3DFD3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#8C8579" }} axisLine={false} tickLine={false} interval={0} angle={-25} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11, fill: "#8C8579" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000000}jt`} />
                <Tooltip formatter={tooltipFormatter} contentStyle={{ borderRadius: 12, border: "1px solid #E3DFD3" }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {barData.map((e) => (
                    <Cell key={e.name} fill={CATEGORY_META[e.name]?.color || "#8C8579"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="mt-5 p-4 sm:p-5">
        <h3 className="mb-1 font-semibold text-[#15231C]" style={{ fontFamily: "Outfit, sans-serif" }}>Tren Bulanan</h3>
        <p className="mb-4 text-xs text-[#8C8579]">Pemasukan vs pengeluaran, 6 bulan terakhir</p>
        <div className="h-60 w-full sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3DFD3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8C8579" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#8C8579" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000000}jt`} />
              <Tooltip formatter={tooltipFormatter} contentStyle={{ borderRadius: 12, border: "1px solid #E3DFD3" }} />
              <Line type="monotone" dataKey="income" stroke="#0F4C3A" strokeWidth={2.5} dot={{ r: 3 }} name="Pemasukan" />
              <Line type="monotone" dataKey="expense" stroke="#C99A4B" strokeWidth={2.5} dot={{ r: 3 }} name="Pengeluaran" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard className="mt-5 p-4 sm:p-5">
        <h3 className="mb-4 font-semibold text-[#15231C]" style={{ fontFamily: "Outfit, sans-serif" }}>Kategori Pengeluaran Teratas</h3>
        <div className="space-y-3">
          {topCategories.map((c, i) => {
            const meta = CATEGORY_META[c.name];
            const Icon = meta?.icon || Package;
            const max = topCategories[0].value;
            return (
              <div key={c.name} className="flex items-center gap-3">
                <span className="w-5 text-sm font-semibold text-[#A8A192]">{i + 1}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${meta?.color}1A`, color: meta?.color }}>
                  <Icon size={14} />
                </div>
                <span className="w-28 shrink-0 text-sm font-medium text-[#15231C]">{c.name}</span>
                <div className="flex-1">
                  <div className="h-2 rounded-full bg-[#EFEBE3]">
                    <div className="h-full rounded-full" style={{ width: `${(c.value / max) * 100}%`, background: meta?.color }} />
                  </div>
                </div>
                <span className="w-28 shrink-0 text-right text-sm font-semibold text-[#15231C]">{fmtIDR(c.value)}</span>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/*  AI INSIGHT PAGE                                                       */
/* ----------------------------------------------------------------------- */

function InsightPage({ setMobileOpen }: { setMobileOpen: PageSetter }) {
  const toneStyles: Record<string, { bg: string; text: string; icon: string }> = {
    warn: { bg: "#FBEFD9", text: "#8A5A1F", icon: "#C99A4B" },
    info: { bg: "#EFEBE3", text: "#5B5446", icon: "#5B5446" },
    good: { bg: "#E7F0E5", text: "#2C5E3F", icon: "#2C5E3F" },
  };
  return (
    <div>
      <Topbar title="AI Financial Insight" subtitle="Wawasan otomatis dari kebiasaan keuangan keluargamu" setMobileOpen={setMobileOpen} />

      <GlassCard className="mb-6 overflow-hidden p-0">
        <div style={{ background: `linear-gradient(135deg, ${COLORS.forest}, ${COLORS.forestDeep})` }} className="flex flex-col gap-4 p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <Sparkles size={22} />
            </div>
            <div>
              <p className="text-sm text-white/70">Ringkasan AI Bulan Ini</p>
              <p className="text-lg font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Keuanganmu dalam kondisi sehat, dengan beberapa hal untuk diperhatikan.</p>
            </div>
          </div>
          <Pill tone="good"><CheckCircle2 size={12} /> Skor Kesehatan: 82/100</Pill>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {insights.map((ins, i) => {
          const Icon = ins.icon;
          const s = toneStyles[ins.tone];
          return (
            <GlassCard key={i} className="p-5">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: s.bg, color: s.icon }}>
                  <Icon size={18} />
                </div>
                <p className="text-sm leading-relaxed text-[#15231C]">{ins.text}</p>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard className="mt-5 p-4 sm:p-5">
        <h3 className="mb-4 font-semibold text-[#15231C]" style={{ fontFamily: "Outfit, sans-serif" }}>Estimasi Saldo Akhir Bulan</h3>
        <div className="h-48 w-full sm:h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrend.map((m) => ({ month: m.month, projected: m.income - m.expense }))}>
              <defs>
                <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C99A4B" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#C99A4B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3DFD3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8C8579" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#8C8579" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000000}jt`} />
              <Tooltip formatter={tooltipFormatter} contentStyle={{ borderRadius: 12, border: "1px solid #E3DFD3" }} />
              <Area type="monotone" dataKey="projected" stroke="#C99A4B" strokeWidth={2.5} fill="url(#projGrad)" name="Surplus" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/*  REPORTS PAGE                                                          */
/* ----------------------------------------------------------------------- */

function ReportsPage({ setMobileOpen }: { setMobileOpen: PageSetter }) {
  return (
    <div>
      <Topbar title="Laporan" subtitle="Unduh laporan keuangan bulanan keluarga" setMobileOpen={setMobileOpen} />

      <GlassCard className="mb-6 p-4 sm:p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#8C8579]">Laporan Bulanan</p>
            <h3 className="mt-1 text-xl font-semibold text-[#15231C]" style={{ fontFamily: "Outfit, sans-serif" }}>Juni 2026</h3>
            <p className="mt-1 text-sm text-[#5B5446]">Pemasukan Rp19.000.000 · Pengeluaran Rp12.420.000 · Surplus Rp6.580.000</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <GhostButton className="w-full sm:w-auto" icon={Download}>Unduh Excel</GhostButton>
            <PrimaryButton className="w-full sm:w-auto" icon={Download}>Unduh PDF</PrimaryButton>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["April 2026", "Mei 2026", "Juni 2026"].map((m, i) => (
          <GlassCard key={m} className="p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EFEBE3] text-[#5B5446]">
                <FileText size={16} />
              </div>
              {i === 2 && <Pill tone="good">Terbaru</Pill>}
            </div>
            <p className="font-medium text-[#15231C]">{m}</p>
            <p className="mt-1 text-xs text-[#8C8579]">Laporan lengkap pemasukan & pengeluaran</p>
            <div className="mt-4 flex gap-2">
              <GhostButton className="flex-1 px-2 py-2 text-xs" icon={Download}>Excel</GhostButton>
              <GhostButton className="flex-1 px-2 py-2 text-xs" icon={Download}>PDF</GhostButton>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/*  APP SHELL                                                              */
/* ----------------------------------------------------------------------- */

export default function NewJourneyApp() {
  const [authed, setAuthed] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!authed) {
    return <LoginPage onLogin={() => setAuthed(true)} />;
  }

  const pages: Record<string, ComponentType<{ setMobileOpen: PageSetter }>> = {
    dashboard: DashboardPage,
    income: IncomePage,
    expense: ExpensePage,
    budget: BudgetPage,
    accounts: AccountsPage,
    analytics: AnalyticsPage,
    insight: InsightPage,
    reports: ReportsPage,
  };
  const ActivePage = pages[page] ?? DashboardPage;

  return (
    <div className="flex min-h-screen w-full bg-[#FAF8F4]" style={{ fontFamily: "Inter, sans-serif" }}>
      <Sidebar page={page} setPage={setPage} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main className="min-h-screen flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-9 lg:py-8">
        <ActivePage setMobileOpen={setMobileOpen} />
      </main>
    </div>
  );
}
