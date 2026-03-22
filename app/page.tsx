"use client";

import { useJogoStore } from "@/store/useGameStore";
import Inicio from "@/telas/Inicio";
import Fases from "@/telas/Fases";
import Resultados from "@/telas/Resultados";

export default function Home() {
  const tela = useJogoStore((state) => state.telaAtiva);

  return (
    <main className="min-h-screen bg-black text-green-400 font-mono p-4 md:p-8 select-none">
      <div className="max-w-4xl mx-auto border-2 border-green-500/30 p-4 md:p-6 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.2)]">
        {/* Renderização direta: mais limpa e performática */}
        {tela === "inicio" && <Inicio />}
        {tela === "fases" && <Fases />}
        {tela === "resultados" && <Resultados />}
        
        {/* Fallback caso o estado se perca (raro com persist) */}
        {!["inicio", "fases", "resultados"].includes(tela) && <Inicio />}
      </div>
    </main>
  );
}