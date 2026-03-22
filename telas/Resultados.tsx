"use client";

import { useEffect } from "react";
import { useJogoStore } from "@/store/useGameStore";

export default function Resultados() {
  const nome = useJogoStore((state) => state.nome);
  const pontos = useJogoStore((state) => state.pontuacao);
  const resetarJogo = useJogoStore((state) => state.resetarJogo);

  const aprovado = pontos >= 20;

  useEffect(() => {
    const enviarParaPlanilha = async () => {
      const URL_APPS_SCRIPT = "SUA_URL_DO_WEB_APP_AQUI";

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
        console.log("[ OK ] DADOS_ENVIADOS_PARA_O_NUCLEO");
      } catch (error) {
        console.error("[ ERRO ] FALHA_NA_SINCRONIZACAO_COM_PLANILHA", error);
      }
    };

    if (nome) {
      enviarParaPlanilha();
    }
  }, [nome, pontos]);

  return (
    <div className="flex flex-col items-start gap-2 py-4 px-4 md:px-12 font-mono animate-in fade-in duration-700">
      <div className="w-full space-y-1 text-xs text-green-800 uppercase text-left">
        <p>[ OK ] CALCULATION_COMPLETE</p>
        <p>[ OK ] GENERATING_FINAL_REPORT</p>
        <p>[ OK ] SYNCING_WITH_EXTERNAL_DATABASE...</p>
        <p>--------------------------------------------------</p>
      </div>

      <h1 className="text-2xl font-black text-green-500 tracking-tighter">
        RESULTADO FINAL
      </h1>

      <div className="w-full bg-zinc-950 border border-green-900 p-4 space-y-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_auto] gap-8 relative z-10 text-left items-end">
          <div className="space-y-1 border-l-2 border-green-900 pl-4">
            <span className="text-xs text-green-800 uppercase font-bold tracking-widest">
              Operador
            </span>
            <p className="text-2xl md:text-3xl text-white font-bold truncate">
              {nome || "DESCONHECIDO"}
            </p>
          </div>

          <div className="space-y-1 bg-green-900/10 p-4 border border-green-900/30">
            <span className="text-xs text-green-800 uppercase font-bold tracking-widest">
              Score_Binário
            </span>
            <p className="text-2xl text-green-400 font-mono font-bold whitespace-nowrap">
              {pontos.toString().padStart(3, "0")}{" "}
              <span className="text-sm">PTS</span>
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-green-900/50 text-left">
          {aprovado ? (
            <div className="space-y-2">
              <p className="text-xl text-green-500 font-bold uppercase">
                [ STATUS: SISTEMA SINCRONIZADO ]
              </p>
              <p className="text-sm text-green-700 leading-relaxed italic">
                A tradução entre os protocolos Decimal e Binário/ASCII foi
                concluída com sucesso. Sua proficiência digital está acima da
                média de segurança.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xl text-red-500 font-bold uppercase">
                [ STATUS: ERRO DE COMPILAÇÃO ]
              </p>
              <p className="text-sm text-red-900/80 leading-relaxed italic">
                Foram detectados bits corrompidos na conversão de dados.
                Sugerimos uma nova reinicialização para calibrar o entendimento
                dos protocolos.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex flex-col items-start gap-4 mt-2">
        <button
          onClick={resetarJogo}
          className="group relative border border-green-500 px-8 py-3 font-bold text-green-500 hover:text-black transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-green-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 -z-10" />
          [ INICIAR NOVA SESSÃO ]
        </button>

        <div className="w-full space-y-2">
          <div className="w-full h-px bg-green-900/30" />
          <p className="text-[10px] text-green-900 animate-pulse uppercase">
            Sessão encerrada. Sistema aguardando novo operador...
          </p>
        </div>
      </div>
    </div>
  );
}
