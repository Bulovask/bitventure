'use client';

import { useEffect, useRef } from 'react';
import { useJogoStore } from '@/store/useGameStore';
import { TerminalLogs, TerminalTitle, TerminalButton, StatusBadge, InfoBlock } from '@/components/UI';

export default function Resultados() {
  const { nome, pontuacao: pontos, resetarJogo } = useJogoStore();
  const aprovado = pontos >= 20;
  const jaEnviado = useRef(false);

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
            data_hora: new Date().toLocaleString("pt-BR"),
          }),
        });
      } catch (error) {
        jaEnviado.current = false;
      }
    };
    enviarParaPlanilha();
  }, [nome, pontos]);

  return (
    <div className="flex flex-col items-start gap-6 py-2 px-4 md:px-8 font-mono animate-in fade-in duration-700 select-none">
      
      <TerminalLogs logs={["REPORT_READY // SYNC_COMPLETED"]} />

      <TerminalTitle title="RESULTADO_FINAL" />

      {/* Container Principal */}
      <div className="w-full bg-zinc-950 border border-green-900 p-4 md:p-6 space-y-6 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <InfoBlock label="Operador_ID" value={nome || "DESCONHECIDO"} />

          <InfoBlock 
            label="Performance" 
            value={`${pontos.toString().padStart(3, "0")} PTS`} 
            highlight 
          />
        </div>

        {/* Mensagem de Status */}
        <div className="pt-4 border-t border-green-900/30 space-y-2">
          <StatusBadge 
            success={aprovado} 
            label={aprovado ? "Status: Acesso Concedido" : "Status: Falha de Paridade"} 
          />
          <p className="text-xs text-green-800 leading-relaxed max-w-md italic ml-5">
            {aprovado 
              ? "Protocolos validados. Integridade de dados mantida no núcleo binário." 
              : "Bits corrompidos detectados. O score de segurança está abaixo do mínimo."}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-start gap-3 w-full">
        <TerminalButton label="NOVA_SESSÃO" onClick={resetarJogo} className="text-sm py-2 px-6" />
        <p className="text-[9px] text-green-900 uppercase">Aguardando novo comando do terminal...</p>
      </div>
    </div>
  );
}