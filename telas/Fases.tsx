"use client";

import { useJogoStore } from "@/store/useGameStore";
import PuzzleBinario from "@/components/PuzzleBinario";
import { useCallback, useState } from "react";
import { TerminalHeader } from "@/components/UI";
import PuzzleDecimal from "@/components/PuzzleDecimal";
import PuzzlePotencias from "@/components/PuzzlePotencias";
import PuzzleASCII from "@/components/PuzzleASCII";
import ASCIITable, { ButtonASCIITableModal } from "@/components/ASCIITable";
import PuzzleReverseASCII from "@/components/PuzzleReverseASCII";

export default function Fases() {
  const [modalAberto, setModalAberto] = useState(false);
  const { nome: nomeAluno, faseAtual, registrarFase, setTela } = useJogoStore();

  const TOTAL_FASES = 6;

  const handleAcerto = useCallback(
    (basePontos: number = 50, tempoMs: number, erros: number) => {
      // Cálculo de Bônus de Velocidade (ex: bônus se fizer em menos de 20s)
      const bonusVelocidade = Math.max(0, 20 - Math.floor(tempoMs / 1000));

      // Penalidade por erros cometidos nessa fase
      const penalidade = erros * 5;

      const pontuacaoFinal = Math.max(
        10,
        basePontos + bonusVelocidade - penalidade,
      );

      // Registra na Store: pontos, tempo gasto e se o aluno errou alguma vez
      registrarFase(pontuacaoFinal, tempoMs, erros > 2);

      // Verifica se era a última fase
      if (faseAtual >= TOTAL_FASES) {
        setTela("resultados");
      }
    },
    [faseAtual, registrarFase, setTela],
  );

  return (
    <div className="py-1 font-mono">
      <TerminalHeader
        items={[
          { label: "OPERADOR", value: nomeAluno || "ANÔNIMO" },
          { label: "PROTOCOLO_SYNC", value: `${faseAtual}/${TOTAL_FASES}` },
        ]}
      />

      <div className="animate-in fade-in slide-in-from-bottom-3 duration-700 ease-out">
        {faseAtual === 1 && (
          <PuzzleBinario numeroObjetivo={10} onAcerto={handleAcerto} />
        )}

        {faseAtual === 2 && (
          <PuzzleDecimal numeroObjetivo={20} onAcerto={handleAcerto} />
        )}

        {faseAtual === 3 && (
          <PuzzlePotencias numeroObjetivo={100} onAcerto={handleAcerto} />
        )}

        {faseAtual === 4 && (
          <PuzzleASCII onAcerto={handleAcerto} letraObjetivo={"3"} />
        )}

        {faseAtual === 5 && (
          <PuzzleReverseASCII letraObjetivo="D" onAcerto={handleAcerto} />
        )}

        {faseAtual === 6 && (
          <PuzzleReverseASCII letraObjetivo="M" onAcerto={handleAcerto} />
        )}
      </div>

      <div className="fixed bottom-4 right-4">
        <ButtonASCIITableModal onClick={() => setModalAberto(true)} />
      </div>
      <ASCIITable isOpen={modalAberto} onClose={() => setModalAberto(false)} />
    </div>
  );
}
