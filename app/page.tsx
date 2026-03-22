"use client";

import { useJogoStore } from "@/store/useGameStore";
import Inicio from "@/telas/Inicio";
import Fases from "@/telas/Fases";
import Resultados from "@/telas/Resultados";

export default function Home() {
  // Consumimos apenas o estado da tela ativa da Store
  const tela = useJogoStore((state) => state.telaAtiva);

  // Mantemos sua lógica de switch para organizar a renderização
  const telaAtualComponente = (() => {
    switch (tela) {
      case "inicio":
        return <Inicio />;
      case "fases":
        return <Fases />;
      case "resultados":
        return <Resultados />;
      default:
        return <Inicio />;
    }
  })();

  return (
    <main className="min-h-screen bg-black text-green-400 font-mono p-8 select-none">
      <div className="max-w-4xl mx-auto border-2 border-green-500/30 p-6 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.2)]">
        {telaAtualComponente}
      </div>
    </main>
  );
}