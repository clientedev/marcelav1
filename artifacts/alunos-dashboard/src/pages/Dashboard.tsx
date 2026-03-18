import { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Sun, Moon, Printer, Bus, GraduationCap, MapPin, Users, BookOpen, Briefcase, Heart, AlertTriangle, Home } from "lucide-react";
import { YEAR_DATA, YEAR_LABELS, YEAR_ORDER, type YearKey } from "@/data/semesterData";

const CHART_COLORS = {
  blue: "#0079F2",
  purple: "#795EFF",
  green: "#00a86b",
  red: "#A60808",
  pink: "#ec4899",
  orange: "#f97316",
  teal: "#0ea5e9",
  indigo: "#6366f1",
  amber: "#d97706",
};

const PALETTE = [
  CHART_COLORS.blue,
  CHART_COLORS.purple,
  CHART_COLORS.green,
  CHART_COLORS.orange,
  CHART_COLORS.teal,
  CHART_COLORS.indigo,
  CHART_COLORS.pink,
  CHART_COLORS.amber,
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div style={{
      background: "rgba(15,23,42,0.92)",
      borderRadius: "10px",
      padding: "10px 14px",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "#f8fafc",
      fontSize: "13px",
      backdropFilter: "blur(8px)",
    }}>
      {label && <div style={{ marginBottom: "6px", fontWeight: 600, color: "#cbd5e1" }}>{label}</div>}
      {payload.map((entry: any, i: number) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: entry.color || entry.fill, flexShrink: 0, display: "inline-block" }} />
          <span style={{ color: "#94a3b8" }}>{entry.name}</span>
          <span style={{ marginLeft: "auto", fontWeight: 700, paddingLeft: 16 }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

function CustomLegend({ payload }: any) {
  if (!payload?.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 14px", fontSize: "12px", marginTop: 4 }}>
      {payload.map((e: any, i: number) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: e.color, display: "inline-block" }} />
          <span style={{ color: "var(--muted-fg)" }}>{e.value}</span>
        </div>
      ))}
    </div>
  );
}

function renderBarLabel(props: any) {
  const { x, y, width, value, isDark } = props;
  if (!value) return null;
  return (
    <text
      x={x + width + 5}
      y={y + (props.height ?? 18) / 2 + 1}
      fill={isDark ? "#94a3b8" : "#64748b"}
      fontSize={11}
      fontWeight={600}
      dominantBaseline="middle"
    >
      {value}
    </text>
  );
}

function renderBarLabelTop(props: any) {
  const { x, y, width, value, isDark } = props;
  if (!value) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 5}
      fill={isDark ? "#94a3b8" : "#64748b"}
      fontSize={11}
      fontWeight={600}
      textAnchor="middle"
    >
      {value}
    </text>
  );
}

function renderPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (value < 3) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="middle" fontSize={13} fontWeight={700}>
      {value}
    </text>
  );
}

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  accent: string;
  isDark: boolean;
}

function SectionHeader({ icon, title, accent, isDark }: SectionHeaderProps) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 16,
      paddingBottom: 12,
      borderBottom: `2px solid ${accent}22`,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: accent + "22",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: accent, flexShrink: 0,
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 16, fontWeight: 700, color: isDark ? "#f1f5f9" : "#0f172a" }}>{title}</span>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${accent}44, transparent)` }} />
    </div>
  );
}

interface ChartCardProps {
  title: string;
  csvData?: any[];
  csvFilename?: string;
  children: React.ReactNode;
  isDark: boolean;
}

function ChartCard({ title, csvData, csvFilename, children, isDark }: ChartCardProps) {
  return (
    <div style={{
      background: isDark ? "rgba(30,41,59,0.8)" : "#ffffff",
      borderRadius: 16,
      border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
      overflow: "hidden",
      transition: "box-shadow 0.2s",
    }}>
      <div style={{
        padding: "14px 16px 10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>{title}</span>
        {csvData && csvData.length > 0 && (
          <CSVLink
            data={csvData}
            filename={csvFilename || "data.csv"}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 26, height: 26, borderRadius: 6,
              background: isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9",
              color: isDark ? "#94a3b8" : "#64748b",
              textDecoration: "none", flexShrink: 0,
            }}
            className="print:hidden"
            title="Exportar CSV"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
          </CSVLink>
        )}
      </div>
      <div style={{ padding: "16px" }}>{children}</div>
    </div>
  );
}

interface KPICardProps {
  label: string;
  value: string | number;
  suffix?: string;
  accent: string;
  isDark: boolean;
  sub?: string;
}

function KPICard({ label, value, suffix = "", accent, isDark, sub }: KPICardProps) {
  return (
    <div style={{
      background: isDark ? "rgba(30,41,59,0.8)" : "#ffffff",
      borderRadius: 16,
      padding: "20px 22px",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
      borderTop: `3px solid ${accent}`,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -20, right: -20,
        width: 80, height: 80, borderRadius: "50%",
        background: accent + "12",
      }} />
      <p style={{ fontSize: 12, fontWeight: 500, color: isDark ? "#94a3b8" : "#64748b", marginBottom: 6, letterSpacing: "0.02em", textTransform: "uppercase" }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 800, color: accent, letterSpacing: "-0.02em", lineHeight: 1 }}>
        {value}{suffix}
      </p>
      {sub && <p style={{ fontSize: 11, color: isDark ? "#64748b" : "#94a3b8", marginTop: 6 }}>{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [isDark, setIsDark] = useState(false);
  const [semester, setSemester] = useState<YearKey>("all");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const d = YEAR_DATA[semester];
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0";
  const tickColor = isDark ? "#64748b" : "#94a3b8";

  return (
    <div style={{
      minHeight: "100vh",
      background: isDark ? "#0f172a" : "#f8fafc",
      fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: isDark
          ? "linear-gradient(135deg, #1e3a5f 0%, #1e1b4b 100%)"
          : "linear-gradient(135deg, #0c4a8f 0%, #1e40af 60%, #0079F2 100%)",
        padding: "24px 28px 20px",
        color: "white",
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 8, padding: 6, display: "flex" }}>
                  <GraduationCap size={20} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.7 }}>
                  SENAI · Escola "Morvan Figueiredo"
                </span>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.2, margin: 0 }}>
                Pesquisa Social
              </h1>
              <p style={{ fontSize: 14, opacity: 0.75, marginTop: 4 }}>
                Perfil socioeconômico · {d.total} alunos matriculados · {YEAR_LABELS[semester]}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="print:hidden">
              <button
                onClick={() => window.print()}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 34, height: 34, borderRadius: 8,
                  background: "rgba(255,255,255,0.15)", border: "none",
                  color: "white", cursor: "pointer",
                }}
                title="Imprimir / Exportar PDF"
              >
                <Printer size={15} />
              </button>
              <button
                onClick={() => setIsDark(d => !d)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 34, height: 34, borderRadius: 8,
                  background: "rgba(255,255,255,0.15)", border: "none",
                  color: "white", cursor: "pointer",
                }}
                title="Alternar modo escuro"
              >
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </div>
          </div>

          {/* Year Selector */}
          <div style={{ display: "flex", gap: 6, marginTop: 20, flexWrap: "wrap" }}>
            {YEAR_ORDER.map(yr => (
              <button
                key={yr}
                onClick={() => setSemester(yr)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: "1.5px solid",
                  borderColor: semester === yr ? "white" : "rgba(255,255,255,0.35)",
                  background: semester === yr ? "white" : "rgba(255,255,255,0.1)",
                  color: semester === yr ? "#1e40af" : "white",
                  fontSize: 12,
                  fontWeight: semester === yr ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  letterSpacing: "0.01em",
                }}
              >
                {YEAR_LABELS[yr]}
                <span style={{
                  marginLeft: 6,
                  fontSize: 10,
                  background: semester === yr ? "#1e40af" : "rgba(255,255,255,0.2)",
                  color: semester === yr ? "white" : "rgba(255,255,255,0.85)",
                  borderRadius: 999,
                  padding: "1px 6px",
                }}>
                  {YEAR_DATA[yr].total}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 24px 40px" }}>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 12, marginBottom: 28 }}>
          <KPICard label="Total de Alunos" value={d.total} accent={CHART_COLORS.blue} isDark={isDark} />
          <KPICard label="Masculino / Feminino" value={`${d.totalMasculino} / ${d.totalFeminino}`} accent={CHART_COLORS.purple} isDark={isDark} />
          <KPICard label="Média de Conduções/dia" value={d.mediaConducoes} accent={CHART_COLORS.orange} isDark={isDark} sub="por aluno com transporte" />
          <KPICard label="Usam Transporte Pago" value={d.percentualComCond} suffix="%" accent={CHART_COLORS.teal} isDark={isDark} />
          <KPICard label="Trabalham" value={d.percentualTrabalham} suffix="%" accent={CHART_COLORS.green} isDark={isDark} />
          <KPICard label="Idade Média" value={d.idadeMedia} suffix=" anos" accent={CHART_COLORS.indigo} isDark={isDark} />
          <KPICard label="Solteiros(as)" value={d.percentualSolteiros} suffix="%" accent={CHART_COLORS.pink} isDark={isDark} />
        </div>

        {/* TRANSPORTE SECTION */}
        <div style={{ marginBottom: 28 }}>
          <SectionHeader icon={<Bus size={18} />} title="Transporte e Conduções" accent={CHART_COLORS.blue} isDark={isDark} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <ChartCard title="Meios de Transporte Utilizados" csvData={d.transporte} csvFilename="transporte.csv" isDark={isDark}>
              <ResponsiveContainer width="100%" height={220} debounce={0}>
                <BarChart data={d.transporte} layout="vertical" margin={{ top: 4, right: 50, left: 10, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false} width={65} />
                  <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={{ fill: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }} />
                  <Bar dataKey="value" isAnimationActive={false} radius={[0, 6, 6, 0]}>
                    {d.transporte.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                    <LabelList dataKey="value" content={(props: any) => renderBarLabel({ ...props, isDark })} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Quantidade de Conduções por Dia" csvData={d.conducoes} csvFilename="conducoes.csv" isDark={isDark}>
              <ResponsiveContainer width="100%" height={220} debounce={0}>
                <BarChart data={d.conducoes} margin={{ top: 24, right: 10, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={{ fill: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }} />
                  <Bar dataKey="value" fill={CHART_COLORS.orange} isAnimationActive={false} radius={[6, 6, 0, 0]}>
                    <LabelList dataKey="value" content={(props: any) => renderBarLabelTop({ ...props, isDark })} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* PERFIL SECTION */}
        <div style={{ marginBottom: 28 }}>
          <SectionHeader icon={<Users size={18} />} title="Perfil dos Alunos" accent={CHART_COLORS.purple} isDark={isDark} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <ChartCard title="Distribuição por Sexo" csvData={d.sexo} csvFilename="sexo.csv" isDark={isDark}>
              <ResponsiveContainer width="100%" height={240} debounce={0}>
                <PieChart>
                  <Pie data={d.sexo} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    innerRadius={65} outerRadius={100} paddingAngle={3} isAnimationActive={false} stroke="none"
                    label={renderPieLabel} labelLine={false}>
                    {d.sexo.map((e, i) => (
                      <Cell key={i} fill={e.name.toLowerCase().includes('fem') ? CHART_COLORS.green : CHART_COLORS.blue} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
                  <Legend content={<CustomLegend />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Faixa Etária" csvData={d.faixaEtaria} csvFilename="faixa-etaria.csv" isDark={isDark}>
              <ResponsiveContainer width="100%" height={240} debounce={0}>
                <BarChart data={d.faixaEtaria} margin={{ top: 24, right: 10, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={{ fill: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }} />
                  <Bar dataKey="value" fill={CHART_COLORS.purple} isAnimationActive={false} radius={[6, 6, 0, 0]}>
                    <LabelList dataKey="value" content={(props: any) => renderBarLabelTop({ ...props, isDark })} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Situação Civil e Trabalho" csvData={d.trabalho} csvFilename="trabalho.csv" isDark={isDark}>
              <ResponsiveContainer width="100%" height={240} debounce={0}>
                <PieChart>
                  <Pie data={d.trabalho} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    outerRadius={100} paddingAngle={3} isAnimationActive={false} stroke="none"
                    label={renderPieLabel} labelLine={false}>
                    {d.trabalho.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
                  <Legend content={<CustomLegend />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* CURSOS + REGIÃO */}
        <div style={{ marginBottom: 28 }}>
          <SectionHeader icon={<BookOpen size={18} />} title="Cursos e Localização" accent={CHART_COLORS.teal} isDark={isDark} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <ChartCard title="Distribuição por Curso" csvData={d.cursos} csvFilename="cursos.csv" isDark={isDark}>
              <ResponsiveContainer width="100%" height={200} debounce={0}>
                <BarChart data={d.cursos} layout="vertical" margin={{ top: 4, right: 50, left: 10, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} width={130} />
                  <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={{ fill: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }} />
                  <Bar dataKey="value" isAnimationActive={false} radius={[0, 6, 6, 0]}>
                    {d.cursos.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                    <LabelList dataKey="value" content={(props: any) => renderBarLabel({ ...props, isDark })} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Distribuição por Região" csvData={d.regiao} csvFilename="regiao.csv" isDark={isDark}>
              <ResponsiveContainer width="100%" height={200} debounce={0}>
                <BarChart data={d.regiao} layout="vertical" margin={{ top: 4, right: 50, left: 10, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={{ fill: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }} />
                  <Bar dataKey="value" fill={CHART_COLORS.blue} isAnimationActive={false} radius={[0, 6, 6, 0]}>
                    <LabelList dataKey="value" content={(props: any) => renderBarLabel({ ...props, isDark })} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* ESCOLARIDADE + PERIODO + RESIDENCIA */}
        <div style={{ marginBottom: 28 }}>
          <SectionHeader icon={<GraduationCap size={18} />} title="Situação Escolar e Moradia" accent={CHART_COLORS.indigo} isDark={isDark} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <ChartCard title="Situação Escolar" csvData={d.escolaridade} csvFilename="escolaridade.csv" isDark={isDark}>
              <ResponsiveContainer width="100%" height={230} debounce={0}>
                <BarChart data={d.escolaridade} layout="vertical" margin={{ top: 4, right: 50, left: 10, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} width={110} />
                  <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={{ fill: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }} />
                  <Bar dataKey="value" fill={CHART_COLORS.indigo} isAnimationActive={false} radius={[0, 6, 6, 0]}>
                    <LabelList dataKey="value" content={(props: any) => renderBarLabel({ ...props, isDark })} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Período de Aula" csvData={d.periodo} csvFilename="periodo.csv" isDark={isDark}>
              <ResponsiveContainer width="100%" height={230} debounce={0}>
                <PieChart>
                  <Pie data={d.periodo} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    outerRadius={90} paddingAngle={3} isAnimationActive={false} stroke="none"
                    label={renderPieLabel} labelLine={false}>
                    {d.periodo.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
                  <Legend content={<CustomLegend />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Tipo de Residência" csvData={d.residencia} csvFilename="residencia.csv" isDark={isDark}>
              <ResponsiveContainer width="100%" height={230} debounce={0}>
                <PieChart>
                  <Pie data={d.residencia} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    innerRadius={50} outerRadius={90} paddingAngle={3} isAnimationActive={false} stroke="none"
                    label={renderPieLabel} labelLine={false}>
                    {d.residencia.map((_, i) => <Cell key={i} fill={[CHART_COLORS.green, CHART_COLORS.orange, CHART_COLORS.pink][i % 3]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
                  <Legend content={<CustomLegend />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* DIFICULDADES + SAUDE */}
        <div style={{ marginBottom: 8 }}>
          <SectionHeader icon={<AlertTriangle size={18} />} title="Dificuldades e Saúde" accent={CHART_COLORS.red} isDark={isDark} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <ChartCard title="Principais Dificuldades para Frequentar o Curso" csvData={d.dificuldades} csvFilename="dificuldades.csv" isDark={isDark}>
              <ResponsiveContainer width="100%" height={280} debounce={0}>
                <BarChart data={d.dificuldades} layout="vertical" margin={{ top: 4, right: 50, left: 10, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: tickColor }} axisLine={false} tickLine={false} width={170} />
                  <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={{ fill: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }} />
                  <Bar dataKey="value" isAnimationActive={false} radius={[0, 6, 6, 0]}>
                    {d.dificuldades.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                    <LabelList dataKey="value" content={(props: any) => renderBarLabel({ ...props, isDark })} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Condições de Saúde Relatadas" csvData={d.saude} csvFilename="saude.csv" isDark={isDark}>
              <ResponsiveContainer width="100%" height={280} debounce={0}>
                <BarChart data={d.saude} layout="vertical" margin={{ top: 4, right: 50, left: 10, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false} width={110} />
                  <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={{ fill: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }} />
                  <Bar dataKey="value" isAnimationActive={false} radius={[0, 6, 6, 0]}>
                    {d.saude.map((_, i) => <Cell key={i} fill={[CHART_COLORS.red, CHART_COLORS.orange, CHART_COLORS.pink, CHART_COLORS.purple, CHART_COLORS.indigo, CHART_COLORS.teal, CHART_COLORS.green][i % 7]} />)}
                    <LabelList dataKey="value" content={(props: any) => renderBarLabel({ ...props, isDark })} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 32, textAlign: "center", fontSize: 11, color: isDark ? "#334155" : "#cbd5e1" }}>
          Pesquisa Social · SENAI Escola "Morvan Figueiredo" · {d.total} respostas coletadas
        </div>
      </div>
    </div>
  );
}
