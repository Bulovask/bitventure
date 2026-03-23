'use client';

import { useEffect, useRef, useMemo } from 'react';
import { useJogoStore } from '@/store/useGameStore';
import { TerminalLogs, TerminalTitle, TerminalButton, StatusBadge, InfoBlock } from '@/components/UI';

export default function Resultados() {
  // Pegamos os novos estados da Store
  const { nome, pontuacao: pontos, tempoTotal, respostas, resetarJogo } = useJogoStore();
  
  const jaEnviado = useRef(false);

  // Cálculos de Performance
  const aprovado = pontos >= 150; // Ajuste o limiar conforme suas novas fases
  const acertosTotais = respostas.filter(r => r === 1).length;
  const precisao = ((acertosTotais / respostas.length) * 100).toFixed(0);

  // Formatação de Tempo (ms -> mm:ss)
  const tempoFormatado = useMemo(() => {
    const totalSegundos = Math.floor(tempoTotal / 1000);
    const min = Math.floor(totalSegundos / 60);
    const seg = totalSegundos % 60;
    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
  }, [tempoTotal]);

  useEffect(() => {
    const enviarParaPlanilha = async () => {
      const URL_APPS_SCRIPT = "SUA_URL_DO_WEB_APP_AQUI";
      if (jaEnviado.current || !nome || URL_APPS_SCRIPT === "SUA_URL_DO_WEB_APP_AQUI") return;
      
      jaEnviado.current = true;
      try {
        await fetch(URL_APPS_SCRIPT, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operador: nome,
            score: pontos,
            tempo_total: tempoFormatado,
            precisao: `${precisao}%`,
            mapa_respostas: respostas.join(','), // Ex: "1,1,0,1" útil para estatística
            data_hora: new Date().toLocaleString("pt-BR"),
          }),
        });
      } catch (error) {
        console.error("Erro ao sincronizar:", error);
        jaEnviado.current = false;
      }
    };
    enviarParaPlanilha();
  }, [nome, pontos, tempoFormatado, precisao, respostas]);

  return (
    <div className="flex flex-col items-start gap-4 py-2 px-4 md:px-8 font-mono animate-in fade-in duration-1000 select-none w-full max-w-4xl mx-auto">
      
      <TerminalLogs logs={["DATA_TRANSFER_COMPLETE", "GENERATING_FINAL_REPORT..."]} />

      <TerminalTitle title="RELATÓRIO_DE_MISSÃO" />

      {/* Painel Principal */}
      <div className="w-full bg-zinc-950 border border-green-900 p-6 space-y-8 relative overflow-hidden">
        {/* Marca d'água decorativa */}
        <div className="absolute top-[-20px] right-[-20px] text-green-900/10 text-9xl font-black rotate-12 pointer-events-none">
          {aprovado ? "PASS" : "FAIL"}
        </div>

        {/* Linha 1: Identificação e Score */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <InfoBlock label="ID_OPERADOR" value={nome || "UNKNOWN"} />
          <InfoBlock label="SCORE_TOTAL" value={`${pontos.toString().padStart(4, "0")} XP`} highlight />
          <InfoBlock label="TEMPO_DE_INVASÃO" value={tempoFormatado} />
        </div>

        {/* Linha 2: Estatísticas de Precisão */}
        <div className="pt-6 border-t border-green-900/20 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 w-full">
            <p className="text-[10px] text-green-700 mb-2 uppercase tracking-widest">Integridade_dos_Dados</p>
            <div className="w-full h-3 bg-zinc-900 border border-green-900/30 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${aprovado ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500'}`}
                style={{ width: `${precisao}%` }}
              />
            </div>
            <p className="text-[10px] text-right mt-1 text-green-600">{precisao}% Precisão</p>
          </div>

          <div className="bg-green-950/20 p-3 border border-green-900/30 rounded">
            <p className="text-[10px] text-green-800 uppercase">Resumo_Fases</p>
            <div className="flex gap-1 mt-1">
              {respostas.map((r, i) => (
                <div 
                  key={i} 
                  title={`Fase ${i+1}`}
                  className={`w-3 h-3 border ${r === 1 ? 'bg-green-500 border-green-400' : 'bg-red-900 border-red-700'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Status Final */}
        <div className="pt-4 flex flex-col gap-2">
          <StatusBadge 
            success={aprovado} 
            label={aprovado ? "STATUS: AGENTE_NIVEL_1" : "STATUS: ACESSO_NEGADO"} 
          />
          <p className="text-xs text-green-800/80 italic ml-1">
            {aprovado 
              ? "> Todos os bits foram reordenados com sucesso. O núcleo central está estável." 
              : "> Erros críticos de paridade. Recomendado revisão dos protocolos de conversão."}
          </p>
        </div>
      </div>

      {/* Ações */}
      <div className="flex flex-col items-start gap-4 w-full pt-4">
        <div className="flex gap-4">
          <TerminalButton label="REINICIAR_SISTEMA" onClick={resetarJogo} className="text-xs py-2 px-8" />
          {/* Botão extra opcional se quiser que eles vejam a planilha */}
          <button className="text-[10px] text-green-900 hover:text-green-500 underline transition-colors uppercase">
            Visualizar Log Global
          </button>
        </div>
        <p className="text-[8px] text-green-900 tracking-tighter uppercase animate-pulse">
          Sincronização com servidor central via WebApp Protocol v2.6.3
        </p>
      </div>
    </div>
  );
}