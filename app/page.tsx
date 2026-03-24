"use client";

import { useJogoStore } from "@/store/useGameStore";
import Boot from "@/telas/Boot";
import Inicio from "@/telas/Inicio";
import Fases from "@/telas/Fases";
import Resultados from "@/telas/Resultados";
import { useEffect, useRef } from "react";

export default function Home() {
  // Pegamos a tela salva e a flag de bloqueio
  const tela = useJogoStore((state) => state.telaAtiva);
  const sistemaBloqueado = useJogoStore((state) => state.sistemaBloqueado);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // O áudio agora observa a flag de bloqueio
  useEffect(() => {
    // Se o sistema foi desbloqueado (o aluno clicou no botão do Boot)
    if (!sistemaBloqueado && audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.play().catch(err => 
        console.warn("Autoplay bloqueado pelo navegador até interação:", err)
      );
    }
  }, [sistemaBloqueado]);

  return (
    <main className="min-h-screen bg-black text-green-400 font-mono p-3 select-none flex justify-center items-center overflow-hidden">
      {/* Elemento de Áudio Global */}
      <audio ref={audioRef} src="/bitventure/sounds/spy.mp3" loop />

      <div className="min-w-3xl mx-auto border-2 border-green-500/30 p-3 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.2)] bg-zinc-950/50">
        
        {/* PRIORIDADE DE RENDERIZAÇÃO:
            Se sistemaBloqueado for true (caso do F5), mostra o Boot.
            Caso contrário, mostra a tela que está no estado (Ex: Fases).
        */}
        {sistemaBloqueado ? (
          <Boot />
        ) : (
          <>
            {tela === "inicio" && <Inicio />}
            {tela === "fases" && <Fases />}
            {tela === "resultados" && <Resultados />}
            
            {/* Fallback de segurança */}
            {!["inicio", "fases", "resultados"].includes(tela) && <Inicio />}
          </>
        )}
      </div>
    </main>
  );
}