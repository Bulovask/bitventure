'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { TerminalButton } from './UI';

interface PuzzleProps {
  numeroObjetivo: number;
  onAcerto: () => void;
  mostrarDica?: boolean; // Nova prop para controle pedagógico
}

export default function PuzzleDecimal({ numeroObjetivo, onAcerto, mostrarDica = true }: PuzzleProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValor, setInputValor] = useState('');
  const [erro, setErro] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // Foco automático ao carregar a fase
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const bitsGerados = useMemo(() => {
    return numeroObjetivo.toString(2).padStart(8, '0').split('').map(Number);
  }, [numeroObjetivo]);

  const verificarResposta = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (parseInt(inputValor) === numeroObjetivo) {
      setSucesso(true);
      setErro(false);
      setTimeout(() => onAcerto(), 1500);
    } else {
      setErro(true);
      setInputValor('');
      // O efeito shake dura 500ms
      setTimeout(() => setErro(false), 500);
      inputRef.current?.focus();
    }
  };

  const valoresPosicionais = [128, 64, 32, 16, 8, 4, 2, 1];

  return (
    <div className={`flex flex-col items-center gap-6 p-6 border-2 transition-all duration-500 rounded-lg ${
      sucesso ? 'border-green-400 bg-green-500/10 shadow-[0_0_30px_rgba(34,197,94,0.2)]' : 'border-green-900 bg-zinc-900/30'
    }`}>
      
      <div className="text-center space-y-1">
        <p className="text-[10px] uppercase tracking-[0.2em] text-green-700 font-bold">
          [ MODO: DECODIFICAÇÃO_INVERSA ]
        </p>
        <h2 className="text-sm text-white opacity-80 italic uppercase font-mono">
          Traduza o sinal de bits para decimal:
        </h2>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-3">
        {bitsGerados.map((bit, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
             {/* A dica agora é condicional */}
             <span className={`text-[9px] font-mono font-bold transition-opacity duration-500 ${
               mostrarDica ? 'text-green-900 opacity-100' : 'opacity-0'
             }`}>
               {valoresPosicionais[i]}
             </span>

             <div className={`w-10 h-14 md:w-12 md:h-16 flex items-center justify-center text-2xl font-black border-2 transition-all ${
               bit === 1 
                ? 'border-green-400 text-green-400 bg-green-900/40 shadow-[inset_0_0_10px_rgba(74,222,128,0.2)]' 
                : 'border-zinc-800 text-zinc-800 bg-black/20'
             }`}>
               {bit}
             </div>
          </div>
        ))}
      </div>

      <form onSubmit={verificarResposta} className="w-full max-w-87 space-y-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="number"
            value={inputValor}
            disabled={sucesso}
            onChange={(e) => setInputValor(e.target.value)}
            placeholder="RESPOSTA_?"
            className={`w-full bg-black border-2 p-4 text-center text-3xl font-mono focus:outline-none transition-all ${
              erro ? 'border-red-600 animate-shake' : 'border-green-900 focus:border-green-500 text-green-400'
            } ${sucesso ? 'border-green-400 text-white' : ''}`}
          />
        </div>

        {/* Botão com px-4 e w-full para o texto respirar */}
        <TerminalButton 
          label={sucesso ? "CONVERSÃO_CONCLUÍDA" : "VERIFICAR_INTEGRIDADE"} 
          type="submit"
          disabled={sucesso || !inputValor}
          className="w-full px-4 text-xs md:text-sm"
        />
      </form>

      <div className="text-[10px] text-green-900 uppercase font-medium h-4">
        {!sucesso && mostrarDica && 'Dica: Some os pesos superiores dos bits ativos.'}
        {sucesso && 'Acesso concedido. Sincronizando...'}
      </div>
    </div>
  );
}