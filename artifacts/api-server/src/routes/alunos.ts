import { Router, type IRouter } from "express";

const router: IRouter = Router();

const data = {
  overview: {
    total: 239,
    totalMasculino: 152,
    totalFeminino: 86,
    mediaConducoes: 3.2,
    percentualComCond: Math.round((198 / 239) * 100),
    percentualTrabalham: Math.round(((33 + 2) / 239) * 100),
    idadeMedia: 17.8,
    percentualSolteiros: Math.round((233 / 239) * 100),
  },
  sexo: [
    { name: "Masculino", value: 152 },
    { name: "Feminino", value: 86 },
    { name: "Não binário", value: 1 },
  ],
  cursos: [
    { name: "CT - Técnico em Desenvolvimento de Sistemas", value: 123 },
    { name: "CT - Técnico em Logística", value: 84 },
    { name: "CAI - Operador de Processos Logísticos", value: 32 },
  ],
  periodo: [
    { name: "Integral (Manhã e Tarde)", value: 92 },
    { name: "Manhã", value: 89 },
    { name: "Tarde", value: 58 },
  ],
  regiao: [
    { name: "Zona Leste", value: 174 },
    { name: "ABCD", value: 21 },
    { name: "Zona Norte", value: 19 },
    { name: "Zona Sul", value: 11 },
    { name: "Zona Oeste", value: 8 },
    { name: "Centro", value: 3 },
    { name: "Outros", value: 3 },
  ],
  faixaEtaria: [
    { name: "13–17 anos", value: 171 },
    { name: "18–24 anos", value: 49 },
    { name: "25–34 anos", value: 15 },
    { name: "35+ anos", value: 4 },
  ],
  transporte: [
    { name: "Ônibus", value: 55 },
    { name: "Metrô", value: 28 },
    { name: "Trem", value: 20 },
    { name: "Particular", value: 6 },
    { name: "A pé", value: 6 },
    { name: "Nenhum", value: 1 },
  ],
  conducoes: [
    { name: "1 condução", value: 31 },
    { name: "2 conduções", value: 72 },
    { name: "3 conduções", value: 21 },
    { name: "4 conduções", value: 34 },
    { name: "5 conduções", value: 8 },
    { name: "6 conduções", value: 24 },
    { name: "7+ conduções", value: 8 },
  ],
  escolaridade: [
    { name: "Cursando 2º ano EM", value: 133 },
    { name: "EM Completo", value: 54 },
    { name: "Cursando 3º ano EM", value: 34 },
    { name: "Cursando 1º ano EM", value: 7 },
    { name: "Superior Completo", value: 7 },
    { name: "Cursando Superior", value: 2 },
    { name: "Outro", value: 2 },
  ],
  trabalho: [
    { name: "Não trabalha", value: 204 },
    { name: "Empregado formal", value: 33 },
    { name: "Informal/Autônomo", value: 2 },
  ],
  residencia: [
    { name: "Própria", value: 15 },
    { name: "Alugada", value: 12 },
    { name: "Cedida", value: 2 },
  ],
  financeiro: [
    { name: "Boa", value: 20 },
    { name: "Ruim", value: 9 },
  ],
  dificuldades: [
    { name: "Nenhuma", value: 11 },
    { name: "Distância residência/SENAI", value: 10 },
    { name: "Pagamento das conduções", value: 6 },
    { name: "Financeira", value: 4 },
    { name: "Alimentação", value: 4 },
    { name: "Outras", value: 4 },
    { name: "Distância trabalho/SENAI", value: 2 },
    { name: "Manter frequência", value: 2 },
    { name: "Cumprir horários", value: 1 },
  ],
  saude: [
    { name: "Ansiedade", value: 5 },
    { name: "Depressão", value: 3 },
    { name: "Outra condição", value: 3 },
    { name: "Pressão alta", value: 2 },
    { name: "Asma/Bronquite", value: 1 },
    { name: "Transtorno bipolar", value: 1 },
  ],
  deslocamento: [
    { name: "Menos de 1h", value: 16 },
    { name: "1h a 2h", value: 12 },
    { name: "Mais de 2h", value: 1 },
  ],
};

router.get("/overview", (_req, res) => {
  res.json(data.overview);
});

router.get("/sexo", (_req, res) => {
  res.json(data.sexo);
});

router.get("/cursos", (_req, res) => {
  res.json(data.cursos);
});

router.get("/periodo", (_req, res) => {
  res.json(data.periodo);
});

router.get("/regiao", (_req, res) => {
  res.json(data.regiao);
});

router.get("/faixa-etaria", (_req, res) => {
  res.json(data.faixaEtaria);
});

router.get("/transporte", (_req, res) => {
  res.json(data.transporte);
});

router.get("/conducoes", (_req, res) => {
  res.json(data.conducoes);
});

router.get("/escolaridade", (_req, res) => {
  res.json(data.escolaridade);
});

router.get("/trabalho", (_req, res) => {
  res.json(data.trabalho);
});

router.get("/residencia", (_req, res) => {
  res.json(data.residencia);
});

router.get("/financeiro", (_req, res) => {
  res.json(data.financeiro);
});

router.get("/dificuldades", (_req, res) => {
  res.json(data.dificuldades);
});

router.get("/saude", (_req, res) => {
  res.json(data.saude);
});

router.get("/deslocamento", (_req, res) => {
  res.json(data.deslocamento);
});

export default router;
