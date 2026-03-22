'use client';

import { useState, useEffect } from 'react';

interface PuzzleProps {
  numeroObjetivo: number;
  onAcerto: () => void;
}

export default function PuzzleBinario({ numeroObjetivo, onAcerto }: PuzzleProps) {
  const [bits, setBits] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [sucesso, setSucesso] = useState(false);

  const valores = [128, 64, 32, 16, 8, 4, 2, 1];
  const parcelasAtivas = valores.filter((_, i) => bits[i] === 1);
  const somaAtual = parcelasAtivas.reduce((acc, curr) => acc + curr, 0);

  const toggleBit = (index: number) => {
    if (sucesso) return;
    const novosBits = [...bits];
    novosBits[index] = novosBits[index] === 0 ? 1 : 0;
    setBits(novosBits);
  };

 useEffect(() => {
    // 1. Verificamos se a soma bateu
    if (Number(somaAtual) === Number(numeroObjetivo) && somaAtual !== 0 && !sucesso) {
      console.log(">>> [SISTEMA] SOMA CORRETA DETECTADA. TRAVANDO...");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSucesso(true);
      
      const timer = setTimeout(() => {
        console.log(">>> [SISTEMA] DISPARANDO onAcerto()");
        onAcerto();
      }, 1500);

      return () => clearTimeout(timer); // Agora ele só vai limpar se a fase REALMENTE mudar
    }
    // Removi 'sucesso' e 'onAcerto' daqui para não resetar o efeito quando o estado mudar
  }, [somaAtual, numeroObjetivo]);
  
  return (
    <div className={`flex flex-col items-center gap-8 p-6 transition-all duration-500 border-2 rounded-lg ${
      sucesso ? 'bg-green-500/10 border-green-400 shadow-[0_0_30px_rgba(34,197,94,0.2)]' : 'bg-zinc-900/30 border-green-900'
    }`}>
      
      <div className="text-center space-y-2">
        <p className={`text-xs uppercase tracking-widest font-bold transition-colors ${sucesso ? 'text-green-400' : 'text-green-700'}`}>
          {sucesso ? '[ STATUS: DECODIFICADO ]' : 'Objetivo_Decimal'}
        </p>
        <h2 className={`text-5xl font-black transition-all duration-300 ${sucesso ? 'text-green-400 scale-110' : 'text-white'}`}>
          {numeroObjetivo}
        </h2>
      </div>

      {/* Visualização da Soma */}
      <div className={`w-full p-4 border-y transition-all duration-300 min-h-[60px] flex items-center justify-center italic ${
        sucesso ? 'bg-green-500/20 border-green-400' : 'bg-black/50 border-green-900/50'
      }`}>
        <p className={`text-xl font-mono transition-colors ${sucesso ? 'text-white' : 'text-green-400'}`}>
          {parcelasAtivas.length > 0 ? (
            <>
              {parcelasAtivas.join(' + ')} = <span className="font-bold underline">{somaAtual}</span>
            </>
          ) : (
            <span className="text-green-900">0 + 0 = 0</span>
          )}
        </p>
      </div>

      {/* Grid de Bits */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {bits.map((bit, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <span className={`text-[10px] font-bold transition-colors ${sucesso ? 'text-green-400' : 'text-green-800'}`}>
              {valores[i]}
            </span>
            <button
              onClick={() => toggleBit(i)}
              disabled={sucesso}
              className={`
                w-12 h-16 md:w-14 md:h-20 flex items-center justify-center text-2xl font-black transition-all duration-200
                border-2 ${bit === 1 
                  ? (sucesso ? 'bg-green-400 border-white text-black shadow-[0_0_20px_#4ade80]' : 'bg-green-500 border-white text-black shadow-[0_0_15px_rgba(34,197,94,0.5)]')
                  : 'bg-zinc-950 border-green-900 text-green-900 hover:border-green-500'}
              `}
            >
              {bit}
            </button>
          </div>
        ))}
      </div>

      <div className="text-[10px] text-green-900 uppercase font-medium">
        {sucesso ? 'Aguardando sincronização de dados...' : 'Instrução: Ative os bits (1) para realizar a soma binária.'}
      </div>
    </div>
  );
}