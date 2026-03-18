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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sun, Moon, Download, Printer, Bus } from "lucide-react";

import {
  useGetAlunosOverview,
  useGetAlunosSexo,
  useGetAlunosCursos,
  useGetAlunosPeriodo,
  useGetAlunosRegiao,
  useGetAlunosFaixaEtaria,
  useGetAlunosTransporte,
  useGetAlunosConducoes,
  useGetAlunosEscolaridade,
  useGetAlunosTrabalho,
  useGetAlunosDificuldades,
  useGetAlunosSaude,
  useGetAlunosDeslocamento,
} from "@workspace/api-client-react";

const CHART_COLORS = {
  blue: "#0079F2",
  purple: "#795EFF",
  green: "#009118",
  red: "#A60808",
  pink: "#ec4899",
  orange: "#f97316",
  teal: "#14b8a6",
};

const CHART_COLOR_LIST = [
  CHART_COLORS.blue,
  CHART_COLORS.purple,
  CHART_COLORS.green,
  CHART_COLORS.orange,
  CHART_COLORS.teal,
  CHART_COLORS.red,
  CHART_COLORS.pink,
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "6px",
        padding: "10px 14px",
        border: "1px solid #e0e0e0",
        color: "#1a1a1a",
        fontSize: "13px",
      }}
    >
      <div style={{ marginBottom: "6px", fontWeight: 500, display: "flex", alignItems: "center", gap: "6px" }}>
        {payload.length === 1 && payload[0].color && payload[0].color !== "#ffffff" && (
          <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", backgroundColor: payload[0].color, flexShrink: 0 }} />
        )}
        {label}
      </div>
      {payload.map((entry: any, index: number) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "3px" }}>
          {payload.length > 1 && entry.color && entry.color !== "#ffffff" && (
            <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", backgroundColor: entry.color, flexShrink: 0 }} />
          )}
          <span style={{ color: "#444" }}>{entry.name}</span>
          <span style={{ marginLeft: "auto", fontWeight: 600 }}>
            {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function CustomLegend({ payload }: any) {
  if (!payload || payload.length === 0) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 16px", fontSize: "13px" }}>
      {payload.map((entry: any, index: number) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", backgroundColor: entry.color, flexShrink: 0 }} />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const overviewQuery = useGetAlunosOverview();
  const sexoQuery = useGetAlunosSexo();
  const cursosQuery = useGetAlunosCursos();
  const periodoQuery = useGetAlunosPeriodo();
  const regiaoQuery = useGetAlunosRegiao();
  const faixaEtariaQuery = useGetAlunosFaixaEtaria();
  const transporteQuery = useGetAlunosTransporte();
  const conducoesQuery = useGetAlunosConducoes();
  const escolaridadeQuery = useGetAlunosEscolaridade();
  const trabalhoQuery = useGetAlunosTrabalho();
  const dificuldadesQuery = useGetAlunosDificuldades();
  const saudeQuery = useGetAlunosSaude();
  const deslocamentoQuery = useGetAlunosDeslocamento();

  const loading =
    overviewQuery.isLoading ||
    sexoQuery.isLoading ||
    cursosQuery.isLoading ||
    periodoQuery.isLoading ||
    regiaoQuery.isLoading ||
    faixaEtariaQuery.isLoading ||
    transporteQuery.isLoading ||
    conducoesQuery.isLoading ||
    escolaridadeQuery.isLoading ||
    trabalhoQuery.isLoading ||
    dificuldadesQuery.isLoading ||
    saudeQuery.isLoading ||
    deslocamentoQuery.isLoading;

  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "#e5e5e5";
  const tickColor = isDark ? "#98999C" : "#71717a";

  const renderKPICard = (title: string, value: string | number | undefined, suffix: string = "") => (
    <Card>
      <CardContent className="p-6">
        {loading ? (
          <>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32" />
          </>
        ) : overviewQuery.data ? (
          <>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: CHART_COLORS.blue }}>
              {value !== undefined ? value : "--"}
              {value !== undefined ? suffix : ""}
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-muted-foreground mt-1">--</p>
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background px-5 py-4 pt-[32px] pb-[32px] pl-[24px] pr-[24px]">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="pt-2">
            <h1 className="font-bold text-[32px]">Dashboard de Alunos SENAI</h1>
            <p className="text-muted-foreground mt-1.5 text-[14px]">
              Visão geral do perfil dos 239 alunos matriculados
            </p>
          </div>
          <div className="flex items-center gap-3 pt-2 print:hidden">
            <button
              onClick={() => window.print()}
              disabled={loading}
              className="flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors disabled:opacity-50"
              style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2",
                color: isDark ? "#c8c9cc" : "#4b5563",
              }}
              aria-label="Export as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsDark((d) => !d)}
              className="flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors"
              style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2",
                color: isDark ? "#c8c9cc" : "#4b5563",
              }}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {renderKPICard("Total de Alunos", overviewQuery.data?.total)}
          {renderKPICard("Masc / Fem", overviewQuery.data ? `${overviewQuery.data.totalMasculino} / ${overviewQuery.data.totalFeminino}` : undefined)}
          {renderKPICard("Média de Conduções/dia", overviewQuery.data?.mediaConducoes)}
          {renderKPICard("Com Conduções", overviewQuery.data?.percentualComCond, "%")}
          {renderKPICard("Trabalham", overviewQuery.data?.percentualTrabalham, "%")}
          {renderKPICard("Idade Média", overviewQuery.data?.idadeMedia)}
          {renderKPICard("Solteiros", overviewQuery.data?.percentualSolteiros, "%")}
        </div>

        {/* Highlighted Section: Conduções */}
        <div className="mb-8">
          <Card className="border-l-4 border-l-blue-500 overflow-hidden">
            <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 border-b border-blue-100 dark:border-blue-800/30 flex items-center gap-3">
              <div className="p-2 bg-blue-500 text-white rounded-lg">
                <Bus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-blue-900 dark:text-blue-100">Transporte e Conduções</h2>
                <p className="text-sm text-blue-700 dark:text-blue-300">Análise detalhada de mobilidade, principal indicador para subsídios</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="p-6 border-b lg:border-b-0 lg:border-r border-border">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Meios de Transporte Utilizados</h3>
                  {!transporteQuery.isLoading && transporteQuery.data && transporteQuery.data.length > 0 && (
                    <CSVLink
                      data={transporteQuery.data}
                      filename="transporte.csv"
                      className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80"
                      style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </CSVLink>
                  )}
                </div>
                {transporteQuery.isLoading ? (
                  <Skeleton className="w-full h-[250px]" />
                ) : (
                  <ResponsiveContainer width="100%" height={250} debounce={0}>
                    <BarChart data={transporteQuery.data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} width={100} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                      <Bar dataKey="value" fill={CHART_COLORS.blue} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} isAnimationActive={false} radius={[0, 4, 4, 0]}>
                         {transporteQuery.data?.map((_, index) => (
                           <Cell key={`cell-${index}`} fill={CHART_COLOR_LIST[index % CHART_COLOR_LIST.length]} />
                         ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Quantidade de Conduções por Dia</h3>
                  {!conducoesQuery.isLoading && conducoesQuery.data && conducoesQuery.data.length > 0 && (
                    <CSVLink
                      data={conducoesQuery.data}
                      filename="conducoes.csv"
                      className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80"
                      style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </CSVLink>
                  )}
                </div>
                {conducoesQuery.isLoading ? (
                  <Skeleton className="w-full h-[250px]" />
                ) : (
                  <ResponsiveContainer width="100%" height={250} debounce={0}>
                    <BarChart data={conducoesQuery.data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                      <Bar dataKey="value" fill={CHART_COLORS.orange} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} isAnimationActive={false} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
          {/* Sexo (Pie) */}
          <Card>
            <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Distribuição por Sexo</CardTitle>
              {!sexoQuery.isLoading && sexoQuery.data && sexoQuery.data.length > 0 && (
                <CSVLink data={sexoQuery.data} filename="sexo.csv" className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }}>
                  <Download className="w-3.5 h-3.5" />
                </CSVLink>
              )}
            </CardHeader>
            <CardContent>
              {sexoQuery.isLoading ? <Skeleton className="w-full h-[300px]" /> : (
                <ResponsiveContainer width="100%" height={300} debounce={0}>
                  <PieChart>
                    <Pie data={sexoQuery.data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={110} cornerRadius={2} paddingAngle={2} isAnimationActive={false} stroke="none">
                      {sexoQuery.data?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name.toLowerCase().includes('fem') ? CHART_COLORS.green : CHART_COLORS.blue} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
                    <Legend content={<CustomLegend />} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Faixa Etária (Bar) */}
          <Card>
            <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Faixa Etária</CardTitle>
              {!faixaEtariaQuery.isLoading && faixaEtariaQuery.data && faixaEtariaQuery.data.length > 0 && (
                <CSVLink data={faixaEtariaQuery.data} filename="faixa-etaria.csv" className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }}>
                  <Download className="w-3.5 h-3.5" />
                </CSVLink>
              )}
            </CardHeader>
            <CardContent>
              {faixaEtariaQuery.isLoading ? <Skeleton className="w-full h-[300px]" /> : (
                <ResponsiveContainer width="100%" height={300} debounce={0}>
                  <BarChart data={faixaEtariaQuery.data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                    <Bar dataKey="value" fill={CHART_COLORS.purple} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} isAnimationActive={false} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Cursos (Bar Horizontal) */}
          <Card className="lg:col-span-2 xl:col-span-1">
            <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Distribuição por Curso</CardTitle>
              {!cursosQuery.isLoading && cursosQuery.data && cursosQuery.data.length > 0 && (
                <CSVLink data={cursosQuery.data} filename="cursos.csv" className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }}>
                  <Download className="w-3.5 h-3.5" />
                </CSVLink>
              )}
            </CardHeader>
            <CardContent>
              {cursosQuery.isLoading ? <Skeleton className="w-full h-[300px]" /> : (
                <ResponsiveContainer width="100%" height={300} debounce={0}>
                  <BarChart data={cursosQuery.data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: tickColor }} stroke={tickColor} width={120} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                    <Bar dataKey="value" fill={CHART_COLORS.teal} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} isAnimationActive={false} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Período (Pie) */}
          <Card>
            <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Período de Aula</CardTitle>
              {!periodoQuery.isLoading && periodoQuery.data && periodoQuery.data.length > 0 && (
                <CSVLink data={periodoQuery.data} filename="periodo.csv" className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }}>
                  <Download className="w-3.5 h-3.5" />
                </CSVLink>
              )}
            </CardHeader>
            <CardContent>
              {periodoQuery.isLoading ? <Skeleton className="w-full h-[300px]" /> : (
                <ResponsiveContainer width="100%" height={300} debounce={0}>
                  <PieChart>
                    <Pie data={periodoQuery.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} cornerRadius={2} paddingAngle={2} isAnimationActive={false} stroke="none">
                      {periodoQuery.data?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLOR_LIST[index % CHART_COLOR_LIST.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
                    <Legend content={<CustomLegend />} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Região (Bar) */}
          <Card>
            <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Distribuição por Região</CardTitle>
              {!regiaoQuery.isLoading && regiaoQuery.data && regiaoQuery.data.length > 0 && (
                <CSVLink data={regiaoQuery.data} filename="regiao.csv" className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }}>
                  <Download className="w-3.5 h-3.5" />
                </CSVLink>
              )}
            </CardHeader>
            <CardContent>
              {regiaoQuery.isLoading ? <Skeleton className="w-full h-[300px]" /> : (
                <ResponsiveContainer width="100%" height={300} debounce={0}>
                  <BarChart data={regiaoQuery.data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: tickColor }} stroke={tickColor} axisLine={false} tickLine={false} interval={0} angle={-45} textAnchor="end" height={60} />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                    <Bar dataKey="value" fill={CHART_COLORS.blue} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} isAnimationActive={false} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Situação Escolar (Bar Horizontal) */}
          <Card>
            <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Situação Escolar</CardTitle>
              {!escolaridadeQuery.isLoading && escolaridadeQuery.data && escolaridadeQuery.data.length > 0 && (
                <CSVLink data={escolaridadeQuery.data} filename="escolaridade.csv" className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }}>
                  <Download className="w-3.5 h-3.5" />
                </CSVLink>
              )}
            </CardHeader>
            <CardContent>
              {escolaridadeQuery.isLoading ? <Skeleton className="w-full h-[300px]" /> : (
                <ResponsiveContainer width="100%" height={300} debounce={0}>
                  <BarChart data={escolaridadeQuery.data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: tickColor }} stroke={tickColor} width={120} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                    <Bar dataKey="value" fill={CHART_COLORS.pink} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} isAnimationActive={false} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Situação de Trabalho (Pie Donut) */}
          <Card>
            <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Situação de Trabalho</CardTitle>
              {!trabalhoQuery.isLoading && trabalhoQuery.data && trabalhoQuery.data.length > 0 && (
                <CSVLink data={trabalhoQuery.data} filename="trabalho.csv" className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }}>
                  <Download className="w-3.5 h-3.5" />
                </CSVLink>
              )}
            </CardHeader>
            <CardContent>
              {trabalhoQuery.isLoading ? <Skeleton className="w-full h-[300px]" /> : (
                <ResponsiveContainer width="100%" height={300} debounce={0}>
                  <PieChart>
                    <Pie data={trabalhoQuery.data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={110} cornerRadius={2} paddingAngle={2} isAnimationActive={false} stroke="none">
                      {trabalhoQuery.data?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLOR_LIST[(index + 2) % CHART_COLOR_LIST.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
                    <Legend content={<CustomLegend />} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Principais Dificuldades (Bar Horizontal) */}
          <Card>
            <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Principais Dificuldades</CardTitle>
              {!dificuldadesQuery.isLoading && dificuldadesQuery.data && dificuldadesQuery.data.length > 0 && (
                <CSVLink data={dificuldadesQuery.data} filename="dificuldades.csv" className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }}>
                  <Download className="w-3.5 h-3.5" />
                </CSVLink>
              )}
            </CardHeader>
            <CardContent>
              {dificuldadesQuery.isLoading ? <Skeleton className="w-full h-[300px]" /> : (
                <ResponsiveContainer width="100%" height={300} debounce={0}>
                  <BarChart data={dificuldadesQuery.data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: tickColor }} stroke={tickColor} width={120} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                    <Bar dataKey="value" fill={CHART_COLORS.red} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} isAnimationActive={false} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Condições de Saúde (Bar Horizontal) */}
          <Card>
            <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Condições de Saúde Relatadas</CardTitle>
              {!saudeQuery.isLoading && saudeQuery.data && saudeQuery.data.length > 0 && (
                <CSVLink data={saudeQuery.data} filename="saude.csv" className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }}>
                  <Download className="w-3.5 h-3.5" />
                </CSVLink>
              )}
            </CardHeader>
            <CardContent>
              {saudeQuery.isLoading ? <Skeleton className="w-full h-[300px]" /> : (
                <ResponsiveContainer width="100%" height={300} debounce={0}>
                  <BarChart data={saudeQuery.data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: tickColor }} stroke={tickColor} width={100} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                    <Bar dataKey="value" fill={CHART_COLORS.green} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} isAnimationActive={false} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Tempo de Deslocamento (Pie) */}
          <Card className="lg:col-span-2 xl:col-span-3">
            <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Tempo de Deslocamento</CardTitle>
              {!deslocamentoQuery.isLoading && deslocamentoQuery.data && deslocamentoQuery.data.length > 0 && (
                <CSVLink data={deslocamentoQuery.data} filename="deslocamento.csv" className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }}>
                  <Download className="w-3.5 h-3.5" />
                </CSVLink>
              )}
            </CardHeader>
            <CardContent>
              {deslocamentoQuery.isLoading ? <Skeleton className="w-full h-[300px]" /> : (
                <div className="flex flex-col md:flex-row items-center">
                  <ResponsiveContainer width="100%" height={300} debounce={0} className="md:w-1/2">
                    <PieChart>
                      <Pie data={deslocamentoQuery.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} cornerRadius={2} paddingAngle={2} isAnimationActive={false} stroke="none">
                        {deslocamentoQuery.data?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLOR_LIST[(index + 4) % CHART_COLOR_LIST.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="w-full md:w-1/2 flex justify-center mt-4 md:mt-0">
                     <CustomLegend payload={deslocamentoQuery.data?.map((entry, index) => ({ value: entry.name, color: CHART_COLOR_LIST[(index + 4) % CHART_COLOR_LIST.length] }))} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
