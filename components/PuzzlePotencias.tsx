"use client";

import { useFaseLogic } from "@/hooks/useFaseLogic";
import { useState, useEffect, useMemo, useRef } from "react";

interface Props {
  numeroObjetivo: number;
  onAcerto: (basePontos: number, tempoMs: number, erros: number) => void;
}

export default function PuzzlePotencias({ numeroObjetivo, onAcerto }: Props) {
  const { registrarErro, finalizarFase } = useFaseLogic(onAcerto);
  const [bits, setBits] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [sucesso, setSucesso] = useState(false);

  // Valores reais: [128, 64, 32, 16, 8, 4, 2, 1]
  const pesos = useMemo(() => [7, 6, 5, 4, 3, 2, 1, 0], []);
  const valoresDecimais = useMemo(
    () => pesos.map((p) => Math.pow(2, p)),
    [pesos],
  );

  const somaAtual = bits.reduce(
    (acc, bit, i) => (bit === 1 ? acc + valoresDecimais[i] : acc),
    0,
  );

  const toggleBit = (index: number) => {
    if (sucesso) return;
    const novosBits = [...bits];
    novosBits[index] = novosBits[index] === 0 ? 1 : 0;
    setBits(novosBits);
  };

  // 2. Referência estável para a função de finalização (evita o bug do timer)
  const finalizarRef = useRef(finalizarFase);

  useEffect(() => {
    finalizarRef.current = finalizarFase;
  }, [finalizarFase]);

  // 3. Efeito de Verificação de Vitória
  useEffect(() => {
    // Se a soma bater e não for zero (evita disparar ao carregar se o objetivo for 0)
    if (somaAtual === numeroObjetivo && somaAtual !== 0 && !sucesso) {
      setSucesso(true);

      const timer = setTimeout(() => {
        // Usamos a Ref para disparar o avanço de fase com 50 pontos base
        finalizarRef.current(50);
      }, 1500);

      return () => clearTimeout(timer);
    }

    // Lógica de penalidade: se o aluno "estourar" o valor objetivo
    if (somaAtual > numeroObjetivo && !sucesso) {
      registrarErro();
    }

    // IMPORTANTE: Apenas somaAtual e numeroObjetivo aqui para estabilidade total
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [somaAtual, numeroObjetivo]);

  return (
    <div
      className={`flex flex-col items-center gap-6 p-6 border-2 transition-all duration-500 rounded-lg ${
        sucesso
          ? "border-green-400 bg-green-500/10"
          : "border-green-900 bg-zinc-900/30"
      }`}
    >
      <div className="text-center space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-green-700 font-bold">
          [ MODO: ARQUITETURA_DE_BASE ]
        </p>
        <h2
          className={`text-4xl font-black transition-colors ${sucesso ? "text-green-400" : "text-white"}`}
        >
          OBJETIVO: {numeroObjetivo}
        </h2>
      </div>

      {/* Grid de Potências */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {pesos.map((p, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            {/* Exibe 2^p */}
            <div className="flex text-green-500 font-mono text-sm group">
              <span>2</span>
              <span className="text-[10px] -mt-1 font-bold group-hover:text-white transition-colors">
                {p}
              </span>
            </div>

            <button
              onClick={() => toggleBit(i)}
              disabled={sucesso}
              className={`w-12 h-16 md:w-14 md:h-20 flex flex-col items-center justify-center transition-all border-2 ${
                bits[i] === 1
                  ? "bg-green-500 border-white text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                  : "bg-black border-green-900 text-green-900 hover:border-green-500"
              }`}
            >
              <span className="text-2xl font-black">{bits[i]}</span>
              {/* Mostra o valor decimal escondidinho embaixo do bit se estiver ativo */}
              {bits[i] === 1 && (
                <span className="text-[9px] font-bold mt-1 opacity-70">
                  ({valoresDecimais[i]})
                </span>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Barra de Progresso/Soma */}
      <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-green-900/30">
        <div
          className="h-full bg-green-500 transition-all duration-500 shadow-[0_0_10px_#22c55e]"
          style={{
            width: `${Math.min((somaAtual / numeroObjetivo) * 100, 100)}%`,
          }}
        />
      </div>

      <div className="text-[10px] text-green-900 uppercase font-mono italic">
        {sucesso
          ? "Estrutura binária validada com sucesso."
          : `Soma atual: ${somaAtual} de ${numeroObjetivo}`}
      </div>
    </div>
  );
}
