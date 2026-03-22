"use client";

import { useJogoStore } from "@/store/useGameStore";
import PuzzleBinario from "@/components/PuzzleBinario";
import { useCallback } from "react";
import { TerminalHeader, TerminalButton } from "@/components/UI";
import PuzzleDecimal from "@/components/PuzzleDecimal";
import PuzzlePotencias from "@/components/PuzzlePotencias";

export default function Fases() {
  const {
    nome: nomeAluno,
    faseAtual,
    avancarFase: avancarFaseStore,
    adicionarPontos,
    setTela,
  } = useJogoStore();

  const TOTAL_FASES = 4;

  const handleAcerto = useCallback(
    (pontos: number = 10) => {
      adicionarPontos(pontos);
      if (faseAtual < TOTAL_FASES) {
        avancarFaseStore();
      } else {
        setTela("resultados");
      }
    },
    [faseAtual, adicionarPontos, avancarFaseStore, setTela],
  );

  return (
    <div className="py-4 font-mono select-none">
      <TerminalHeader
        items={[
          { label: "OPERADOR", value: nomeAluno || "ANÔNIMO" },
          { label: "PROTOCOLO_SYNC", value: `${faseAtual}/${TOTAL_FASES}` },
        ]}
      />

      <div className="animate-in fade-in slide-in-from-bottom-3 duration-700 ease-out">
        {/* FASE 1: Aprender a Somar */}
        {faseAtual === 1 && (
          <PuzzleBinario
            numeroObjetivo={10}
            onAcerto={() => handleAcerto(10)}
          />
        )}

        {/* FASE 2: Aprender a Ler */}
        {faseAtual === 2 && (
          <PuzzleDecimal
            numeroObjetivo={20}
            onAcerto={() => handleAcerto(10)}
          />
        )}

        {/* FASE 3: Aprender as Potências (A base de tudo!) */}
        {faseAtual === 3 && (
          <PuzzlePotencias
            numeroObjetivo={100}
            onAcerto={() => handleAcerto(30)}
          />
        )}

        {/* Placeholder para Fases Futuras */}
        {faseAtual >= 4 && faseAtual <= TOTAL_FASES && (
          <div
            className="flex flex-col items-center gap-6 py-12 border border-dashed border-green-900/50 rounded-lg bg-green-500/5"
            key={`fase-auto-${faseAtual}`}
          >
            <div className="space-y-1 text-center">
              <p className="text-green-500 font-bold text-lg uppercase">
                [ DESAFIO_LEVEL_0{faseAtual} ]
              </p>
              <p className="text-green-900 text-[10px] uppercase tracking-[0.2em]">
                Status: Aguardando injeção de pacotes...
              </p>
            </div>

            <TerminalButton
              label={`SIMULAR_DECODIFICAÇÃO_0${faseAtual}`}
              onClick={() => handleAcerto(0)}
            />

            <p className="text-green-900 text-[9px] italic">
              * Clique para pular esta fase durante os testes de integração.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
