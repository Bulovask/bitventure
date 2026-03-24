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

  const TOTAL_FASES = 30;

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
          <PuzzleBinario numeroObjetivo={10} onAcerto={handleAcerto} pontos={100} />
        )}

        {faseAtual === 2 && (
          <PuzzleBinario numeroObjetivo={15} onAcerto={handleAcerto} pontos={100} />
        )}

        {faseAtual === 3 && (
          <PuzzleBinario numeroObjetivo={37} onAcerto={handleAcerto} pontos={100} />
        )}

        {faseAtual === 4 && (
          <PuzzleBinario numeroObjetivo={44} onAcerto={handleAcerto} pontos={100} />
        )}

        {faseAtual === 5 && (
          <PuzzleDecimal numeroObjetivo={20} onAcerto={handleAcerto} pontos={200} />
        )}

        {faseAtual === 6 && (
          <PuzzleDecimal numeroObjetivo={23} onAcerto={handleAcerto} pontos={200} />
        )}

        {faseAtual === 7 && (
          <PuzzleDecimal numeroObjetivo={39} onAcerto={handleAcerto} pontos={200} />
        )}

        {faseAtual === 8 && (
          <PuzzleDecimal numeroObjetivo={54} onAcerto={handleAcerto} pontos={200} />
        )}

        {faseAtual === 9 && (
          <PuzzlePotencias numeroObjetivo={100} onAcerto={handleAcerto} pontos={300} />
        )}

        {faseAtual === 10 && (
          <PuzzlePotencias numeroObjetivo={115} onAcerto={handleAcerto} pontos={300} />
        )}

        {faseAtual === 11 && (
          <PuzzlePotencias numeroObjetivo={130} onAcerto={handleAcerto} pontos={300} />
        )}

        {faseAtual === 12 && (
          <PuzzlePotencias numeroObjetivo={185} onAcerto={handleAcerto} pontos={300} />
        )}

        {faseAtual === 13 && (
          <PuzzleASCII onAcerto={handleAcerto} letraObjetivo={"B"} pontos={300} />
        )}

        {faseAtual === 14 && (
          <PuzzleASCII onAcerto={handleAcerto} letraObjetivo={"X"} pontos={300} />
        )}

        {faseAtual === 15 && (
          <PuzzleASCII onAcerto={handleAcerto} letraObjetivo={"L"} pontos={300} />
        )}

        {faseAtual === 16 && (
          <PuzzleASCII onAcerto={handleAcerto} letraObjetivo={"M"} pontos={300} />
        )}

        {faseAtual === 17 && (
          <PuzzlePotencias numeroObjetivo={225} onAcerto={handleAcerto} pontos={300} />
        )}

        {faseAtual === 18 && (
          <PuzzleReverseASCII letraObjetivo="C" onAcerto={handleAcerto} pontos={300} />
        )}

        {faseAtual === 19 && (
          <PuzzleReverseASCII letraObjetivo="H" onAcerto={handleAcerto} pontos={300} />
        )}

        {faseAtual === 20 && (
          <PuzzleReverseASCII letraObjetivo="J" onAcerto={handleAcerto} pontos={300} />
        )}

        {faseAtual === 21 && (
          <PuzzleReverseASCII letraObjetivo="K" onAcerto={handleAcerto} pontos={300} />
        )}

        {faseAtual === 22 && (
          <PuzzleDecimal numeroObjetivo={99} onAcerto={handleAcerto} pontos={200} />
        )}

        {faseAtual === 23 && (
          <PuzzleReverseASCII letraObjetivo="W" onAcerto={handleAcerto} pontos={300} />
        )}

        {faseAtual === 24 && (
          <PuzzleBinario numeroObjetivo={211} onAcerto={handleAcerto} pontos={100} />
        )}

        {faseAtual === 25 && (
          <PuzzleReverseASCII letraObjetivo="T" onAcerto={handleAcerto} pontos={300} />
        )}

        {faseAtual === 26 && (
          <PuzzleDecimal numeroObjetivo={66} onAcerto={handleAcerto} pontos={200} />
        )}

        {faseAtual === 27 && (
          <PuzzleReverseASCII letraObjetivo="M" onAcerto={handleAcerto} pontos={300} />
        )}

        {faseAtual === 28 && (
          <PuzzleBinario numeroObjetivo={10} onAcerto={handleAcerto} pontos={100} />
        )}

        {faseAtual === 29 && (
          <PuzzleReverseASCII letraObjetivo="V" onAcerto={handleAcerto} pontos={300} />
        )}

        {faseAtual === 30 && (
          <PuzzleDecimal numeroObjetivo={73} onAcerto={handleAcerto} pontos={200} />
        )}
      </div>

      <div className="fixed bottom-4 right-4">
        <ButtonASCIITableModal onClick={() => setModalAberto(true)} />
      </div>
      <ASCIITable isOpen={modalAberto} onClose={() => setModalAberto(false)} />
    </div>
  );
}
