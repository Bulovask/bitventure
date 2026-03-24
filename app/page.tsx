"use client";

import { useJogoStore } from "@/store/useGameStore";
import Boot from "@/telas/Boot";
import Inicio from "@/telas/Inicio";
import Fases from "@/telas/Fases";
import Resultados from "@/telas/Resultados";
import { useEffect, useRef } from "react";

export default function Home() {
  const tela = useJogoStore((state) => state.telaAtiva);
  const sistemaBloqueado = useJogoStore((state) => state.sistemaBloqueado);
  const bloquearSistema = useJogoStore((state) => state.bloquearSistema);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // 1. MONITOR DE FULLSCREEN
  useEffect(() => {
    const checkFullscreen = () => {
      // Se não houver elemento em tela cheia, bloqueia
      if (!document.fullscreenElement) {
        bloquearSistema();
        if (audioRef.current) audioRef.current.pause();
      }
    };

    document.addEventListener("fullscreenchange", checkFullscreen);
    // Para suporte a navegadores antigos/Safari
    document.addEventListener("webkitfullscreenchange", checkFullscreen);

    return () => {
      document.removeEventListener("fullscreenchange", checkFullscreen);
      document.removeEventListener("webkitfullscreenchange", checkFullscreen);
    };
  }, [bloquearSistema]); // Dependência importante

  // 2. CONTROLE DE ÁUDIO
  useEffect(() => {
    if (!sistemaBloqueado && audioRef.current) {
      audioRef.current.volume = 0.1;
      audioRef.current.play().catch(err => 
        console.warn("Áudio aguardando interação:", err)
      );
    } else {
      audioRef.current?.pause();
    }
  }, [sistemaBloqueado]);

  return (
    <main className="min-h-screen bg-black text-green-400 font-mono p-3 select-none flex justify-center items-center overflow-hidden">
      <audio ref={audioRef} src="/bitventure/sounds/spy.mp3" loop />

      <div className="min-w-3xl mx-auto border-2 border-green-500/30 p-3 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.2)] bg-zinc-950/50">
        
        {/* Renderização Condicional */}
        {sistemaBloqueado ? (
          <Boot />
        ) : (
          <>
            {tela === "inicio" && <Inicio />}
            {tela === "fases" && <Fases />}
            {tela === "resultados" && <Resultados />}
            
            {!["inicio", "fases", "resultados"].includes(tela) && <Inicio />}
          </>
        )}
      </div>
    </main>
  );
}