"use client";

import { useJogoStore } from "@/store/useGameStore";
import Boot from "@/telas/Boot"; // Importe a nova tela
import Inicio from "@/telas/Inicio";
import Fases from "@/telas/Fases";
import Resultados from "@/telas/Resultados";
import { useEffect, useRef } from "react";

export default function Home() {
  const tela = useJogoStore((state) => state.telaAtiva);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Monitora a mudança de tela para dar play na música quando sair do 'boot'
  useEffect(() => {
    if (tela !== "boot" && audioRef.current) {
      audioRef.current.volume = 0.3; // Volume mais baixo para não atrapalhar
      audioRef.current.play().catch(err => console.log("Erro ao tocar áudio:", err));
    }
  }, [tela]);

  return (
    <main className="min-h-screen bg-black text-green-400 font-mono p-3 select-none flex justify-center items-center overflow-hidden">
      {/* Elemento de Áudio Global */}
      <audio ref={audioRef} src="/sounds/background.mp3" loop />

      <div className="min-w-3xl mx-auto border-2 border-green-500/30 p-3 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.2)] bg-zinc-950/50">
        
        {/* Lógica de Roteamento das Telas */}
        {tela === "boot" && <Boot />}
        {tela === "inicio" && <Inicio />}
        {tela === "fases" && <Fases />}
        {tela === "resultados" && <Resultados />}
        
        {/* Fallback */}
        {!["boot", "inicio", "fases", "resultados"].includes(tela) && <Boot />}
      </div>
    </main>
  );
}