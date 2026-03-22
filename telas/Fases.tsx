"use client";

import { useJogoStore } from "@/store/useGameStore";
import PuzzleBinario from "@/components/PuzzleBinario";
import { useCallback } from "react";

export default function Fases() {
  const nomeAluno = useJogoStore((state) => state.nome);
  const faseAtual = useJogoStore((state) => state.faseAtual);
  const avancarFaseStore = useJogoStore((state) => state.avancarFase);
  const adicionarPontos = useJogoStore((state) => state.adicionarPontos);
  const setTela = useJogoStore((state) => state.setTela);

  const TOTAL_FASES = 4;

  const handleAcerto = useCallback(() => {
    adicionarPontos(10);
    if (faseAtual < TOTAL_FASES) {
      avancarFaseStore();
    } else {
      setTela("resultados");
    }
  }, [faseAtual, adicionarPontos, avancarFaseStore, setTela]);

  return (
    <div className="py-4 font-mono">
      <header className="flex justify-between border-b border-green-500/30 pb-2 mb-6 text-xs md:text-sm">
        <span className="text-green-700">
          OPERADOR: <span className="text-green-400">{nomeAluno}</span>
        </span>
        <span className="text-green-700">
          PROTOCOLO: <span className="text-green-400">{faseAtual}/{TOTAL_FASES}</span>
        </span>
      </header>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* Renderização DIRETA no corpo do return */}
        {faseAtual === 1 && (
          <PuzzleBinario
            key="fase-1-puzzle"
            numeroObjetivo={50}
            onAcerto={handleAcerto}
          />
        )}

        {faseAtual >= 2 && faseAtual <= TOTAL_FASES && (
          <div className="flex flex-col items-center gap-4 py-10" key={`fase-auto-${faseAtual}`}>
            <p className="text-green-700 font-mono text-sm italic text-center">
              [ SISTEMA: DESAFIO_LEVEL_{faseAtual}_PENDENTE ]
            </p>
            <button
              onClick={handleAcerto}
              className="border border-green-500 px-6 py-2 hover:bg-green-500 hover:text-black transition-all font-bold"
            >
              SIMULAR_DECODIFICAÇÃO_FASE_{faseAtual}()
            </button>
          </div>
        )}
      </div>
    </div>
  );
}