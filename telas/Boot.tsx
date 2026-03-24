"use client";

import { useJogoStore } from "@/store/useGameStore";
import { TerminalButton } from "@/components/UI";

export default function Boot() {
  // Pegamos a função que remove a trava do sistema
  const desbloquear = useJogoStore((state) => state.desbloquearSistema);

  const iniciarSistema = () => {
    // 1. Tenta colocar em Tela Cheia para aumentar a imersão dos alunos
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {
        console.log("Fullscreen negado ou não suportado pelo navegador.");
      });
    }

    // 2. Desbloqueia o sistema. 
    // O Home.tsx vai detectar essa mudança e renderizar a tela que estava salva.
    desbloquear();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-10 py-16 text-center">
      <div className="space-y-6">
        {/* Ícone ou Identidade Visual do Projeto PIBID */}
        <div className="w-16 h-16 border-2 border-green-500/50 rounded-full flex items-center justify-center mx-auto animate-pulse">
          <span className="text-green-500 text-2xl font-black">F</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-green-500">
            SISTEMA_OPERACIONAL_FALCÕES
          </h1>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-900 rounded-full animate-ping" />
            <p className="text-[10px] text-green-900 font-mono tracking-widest uppercase">
              Aguardando autorização do operador
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-xl px-4">
        <TerminalButton 
          label="INICIALIZAR_SISTEMA" 
          onClick={iniciarSistema}
        />
      </div>

      <div className="space-y-1">
        <p className="text-[9px] text-zinc-700 uppercase font-mono tracking-tight">
          Ambiente seguro detectado. Áudio e Visual ativos.
        </p>
        <p className="text-[8px] text-zinc-800 italic">
          v2.026.03 - Desenvolvido para Práticas Educativas (PIBID)
        </p>
      </div>
    </div>
  );
}