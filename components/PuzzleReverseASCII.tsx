"use client";

import { useFaseLogic } from "@/hooks/useFaseLogic";
import { useState, useEffect, useMemo, useRef } from "react";

interface Props {
  letraObjetivo: string; // Ex: 'A', 'B', 'Z', '7'
  onAcerto: (basePontos: number, tempoMs: number, erros: number) => void;
}

export default function PuzzleReverseASCII({ letraObjetivo, onAcerto }: Props) {
  const { registrarErro, finalizarFase } = useFaseLogic(onAcerto);
  // Inicializa com todos os bits zerados
  const [bits, setBits] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [sucesso, setSucesso] = useState(false);

  // O valor decimal da letra objetivo (Ex: 'A' é 65)
  const decimalObjetivo = useMemo(
    () => letraObjetivo.charCodeAt(0),
    [letraObjetivo],
  );

  // Os pesos de cada bit (potências de 2)
  const pesos = [128, 64, 32, 16, 8, 4, 2, 1];

  // Cálculo derivado da soma atual baseada nos bits ativos
  const somaAtual = bits.reduce(
    (acc, bit, i) => (bit === 1 ? acc + pesos[i] : acc),
    0,
  );

  // Converte a soma atual para o caractere ASCII correspondente
  // Limitamos a 255 para evitar erros, mas ASCII padrão vai até 127
  const caractereAtual = useMemo(() => {
    if (somaAtual > 0 && somaAtual <= 255) {
      return String.fromCharCode(somaAtual);
    }
    return "?"; // Caractere indefinido ou nulo
  }, [somaAtual]);

  // Função para alternar o valor do bit (0 ou 1)
  const toggleBit = (index: number) => {
    if (sucesso) return; // Trava após o acerto
    setBits((prev) => {
      const novosBits = [...prev];
      novosBits[index] = novosBits[index] === 0 ? 1 : 0;
      return novosBits;
    });
  };

  // 2. Referência para a função de finalização (Evita o bug do timer resetar)
const finalizarRef = useRef(finalizarFase);

useEffect(() => {
  finalizarRef.current = finalizarFase;
}, [finalizarFase]);

// 3. Efeito de Verificação de Vitória
useEffect(() => {
  // Se o aluno alcançou o valor decimal da letra objetivo
  if (somaAtual === decimalObjetivo && somaAtual !== 0 && !sucesso) {
    setSucesso(true);

    const timer = setTimeout(() => {
      // Dispara o avanço com 60 pontos (codificação é mais complexa)
      finalizarRef.current(60);
    }, 1500);

    return () => clearTimeout(timer);
  }

  // Registro de erro pedagógico: se o aluno passar do valor da letra
  if (somaAtual > decimalObjetivo && !sucesso) {
    registrarErro();
  }

  // IMPORTANTE: Dependências mínimas para evitar que o timer morra
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [somaAtual, decimalObjetivo]);

  return (
    <div
      className={`flex flex-col items-center gap-6 p-6 border-2 transition-all duration-500 rounded-lg ${
        sucesso
          ? "border-purple-400 bg-purple-500/10 shadow-[0_0_30px_rgba(168,85,247,0.2)]"
          : "border-green-900 bg-zinc-900/30"
      }`}
    >
      <div className="text-center space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-purple-500 font-bold">
          [ MODO: CODIFICADOR_ASCII ]
        </p>
        <h2 className="text-sm text-white opacity-80 italic font-mono uppercase">
          Ative os bits para gerar o caractere objetivo:
        </h2>
      </div>

      {/* Display do Objetivo */}
      <div className="flex gap-6 items-center border-y-2 border-purple-900/50 py-2 w-full justify-center bg-black/30">
        <div className="text-center">
          <p className="text-[10px] text-purple-700 font-mono">OBJETIVO</p>
          <p className="text-4xl font-black text-white">{letraObjetivo}</p>
        </div>
        <div className="text-4xl font-light text-purple-900">→</div>
        <div className="text-center">
          <p className="text-[10px] text-purple-700 font-mono">DECIMAL</p>
          <p className="text-4xl font-black text-purple-400">
            {decimalObjetivo}
          </p>
        </div>
      </div>

      {/* Display em Tempo Real do Resultado */}
      <div className="text-center p-3 bg-black/50 border border-purple-900 rounded-md w-full max-w-sm">
        <p className="text-xs text-purple-300 font-mono">
          Soma Atual:{" "}
          <span className="font-bold text-xl text-white">{somaAtual}</span>
          <span className="mx-2">|</span>
          Caractere:{" "}
          <span className="font-bold text-2xl text-purple-400 font-sans">
            {caractereAtual}
          </span>
        </p>
      </div>

      {/* Grid de Bits Interativos (Botões) */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {bits.map((bit, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <span
              className={`text-[10px] font-bold transition-colors ${sucesso ? "text-purple-400" : "text-green-800"}`}
            >
              {pesos[i]}
            </span>
            <button
              onClick={() => toggleBit(i)}
              disabled={sucesso}
              className={`
                w-10 h-12 md:w-12 md:h-14 flex items-center justify-center text-xl font-black transition-all duration-200
                border-2 ${
                  bit === 1
                    ? "bg-purple-500 border-white text-black shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                    : "bg-zinc-950 border-green-900 text-green-900 hover:border-purple-500 hover:text-purple-400"
                }
              `}
            >
              {bit}
            </button>
          </div>
        ))}
      </div>

      <div className="text-[10px] text-purple-900 uppercase font-mono italic h-4">
        {sucesso
          ? "Codificação aceita. Sincronizando fluxo..."
          : "Dica: Use a Tabela ASCII para confirmar o valor decimal."}
      </div>
    </div>
  );
}
