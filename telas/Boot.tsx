"use client";

import { useJogoStore } from "@/store/useGameStore";
import { TerminalButton } from "@/components/UI";

export default function Boot() {
  const setTela = useJogoStore((state) => state.setTela);

  const iniciarSistema = () => {
    // 1. Tentar Fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {
        console.log("Fullscreen negado ou não suportado");
      });
    }

    // 2. Mudar para a tela de início
    setTela("inicio");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-12 text-center">
      <div className="space-y-4 animate-pulse">
        <h1 className="text-4xl font-black tracking-tighter text-green-500">
          SISTEMA_OPERACIONAL_FALCÕES
        </h1>
        <p className="text-xs text-green-900 font-mono">
          [ AGUARDANDO AUTENTICAÇÃO BIO-MÉTRICA ]
        </p>
      </div>

      <div className="w-64">
        <TerminalButton 
          label="INICIALIZAR_PROTOCOLO" 
          onClick={iniciarSistema}
        />
      </div>

      <p className="text-[10px] text-zinc-600 uppercase italic">
        Nota: A inicialização ativa som ambiente e modo tela cheia.
      </p>
    </div>
  );
}