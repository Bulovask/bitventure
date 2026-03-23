"use client";

import { useFaseLogic } from "@/hooks/useFaseLogic";
import { useState, useEffect, useRef } from "react";

interface PuzzleProps {
  numeroObjetivo: number;
  onAcerto: (basePontos: number, tempoMs: number, erros: number) => void;
}

export default function PuzzleBinario({
  numeroObjetivo,
  onAcerto,
}: PuzzleProps) {
  const { registrarErro, finalizarFase } = useFaseLogic(onAcerto);
  const [bits, setBits] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [sucesso, setSucesso] = useState(false);

  const valores = [128, 64, 32, 16, 8, 4, 2, 1];

  // Cálculo derivado do estado (perfeito, evita redundância de estado)
  const somaAtual = bits.reduce(
    (acc, bit, i) => (bit === 1 ? acc + valores[i] : acc),
    0,
  );
  const parcelasAtivas = valores.filter((_, i) => bits[i] === 1);

  const toggleBit = (index: number) => {
    if (sucesso) return;
    setBits((prev) => {
      const novosBits = [...prev];
      novosBits[index] = novosBits[index] === 0 ? 1 : 0;
      return novosBits;
    });
  };

  // 2. Criamos uma referência para a função de finalização
// Isso permite usar a função dentro do useEffect sem disparar re-renders
const finalizarRef = useRef(finalizarFase);

// 3. Mantemos a Ref sempre atualizada com a versão mais nova da função
useEffect(() => {
  finalizarRef.current = finalizarFase;
}, [finalizarFase]);

// 4. O useEffect de Verificação (O CORAÇÃO DA LÓGICA)
useEffect(() => {
  // Verificamos se a soma bateu
  if (somaAtual === numeroObjetivo && somaAtual !== 0 && !sucesso) {
    setSucesso(true);

    const timer = setTimeout(() => {
      // Chamamos através da Ref para não precisar colocar no array de dependências
      finalizarRef.current(50); 
    }, 1500);

    return () => clearTimeout(timer);
  }

  // Lógica de erro (opcional): se passar do valor, registra erro
  if (somaAtual > numeroObjetivo && !sucesso) {
    registrarErro();
  }

  // IMPORTANTE: Mantemos apenas somaAtual e numeroObjetivo.
  // Isso garante que o timer NÃO seja resetado por funções externas.
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [somaAtual, numeroObjetivo]);

  return (
    <div
      className={`flex flex-col items-center gap-8 p-6 transition-all duration-500 border-2 rounded-lg ${
        sucesso
          ? "bg-green-500/10 border-green-400 shadow-[0_0_30px_rgba(34,197,94,0.2)]"
          : "bg-zinc-900/30 border-green-900"
      }`}
    >
      <div className="text-center space-y-2">
        <p
          className={`text-xs uppercase tracking-[0.2em] font-bold transition-colors ${sucesso ? "text-green-400" : "text-green-700"}`}
        >
          {sucesso ? "[ STATUS: DECODIFICADO ]" : "Objetivo_Decimal"}
        </p>
        <h2
          className={`text-6xl font-black transition-all duration-300 ${sucesso ? "text-green-400 scale-105" : "text-white"}`}
        >
          {numeroObjetivo}
        </h2>
      </div>

      {/* Display da Operação Matemática */}
      <div
        className={`w-full p-4 border-y transition-all duration-300 min-h-16 flex items-center justify-center font-mono ${
          sucesso
            ? "bg-green-500/20 border-green-400"
            : "bg-black/50 border-green-900/50"
        }`}
      >
        <p
          className={`text-xl transition-colors ${sucesso ? "text-white" : "text-green-400"}`}
        >
          {parcelasAtivas.length > 0 ? (
            <>
              {parcelasAtivas.join(" + ")} ={" "}
              <span className="font-bold underline">{somaAtual}</span>
            </>
          ) : (
            <span className="text-green-900 opacity-50">000 + 000 = 0</span>
          )}
        </p>
      </div>

      {/* Grid de Bits */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {bits.map((bit, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <span
              className={`text-[10px] font-bold transition-colors ${sucesso ? "text-green-400" : "text-green-800"}`}
            >
              {valores[i]}
            </span>
            <button
              onClick={() => toggleBit(i)}
              disabled={sucesso}
              className={`
                w-12 h-16 md:w-14 md:h-20 flex items-center justify-center text-2xl font-black transition-all duration-200
                border-2 ${
                  bit === 1
                    ? sucesso
                      ? "bg-green-400 border-white text-black shadow-[0_0_20px_#4ade80]"
                      : "bg-green-500 border-white text-black shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                    : "bg-zinc-950 border-green-900 text-green-900 hover:border-green-500 hover:text-green-400"
                }
              `}
            >
              {bit}
            </button>
          </div>
        ))}
      </div>

      <div className="text-[10px] text-green-900 uppercase font-medium tracking-tight">
        {sucesso
          ? "Aguardando sincronização de dados..."
          : "Instrução: Ative os bits (1) para realizar a soma binária."}
      </div>
    </div>
  );
}
