'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { TerminalButton } from './UI';
import { useFaseLogic } from '@/hooks/useFaseLogic';

interface Props {
  letraObjetivo: string; // Ex: 'A', 'B', 'Z'
  onAcerto: (basePontos: number, tempoMs: number, erros: number) => void;
}

export default function PuzzleASCII({ letraObjetivo, onAcerto }: Props) {
  const { registrarErro, finalizarFase } = useFaseLogic(onAcerto);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputChar, setInputChar] = useState('');
  const [erro, setErro] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // O valor decimal da letra (Ex: 'A' é 65)
  const valorDecimal = useMemo(() => letraObjetivo.charCodeAt(0), [letraObjetivo]);
  
  // Converte o decimal para o array de bits que o aluno verá
  const bitsVisual = useMemo(() => {
    return valorDecimal.toString(2).padStart(8, '0').split('').map(Number);
  }, [valorDecimal]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const verificarResposta = (e?: React.FormEvent) => {
  e?.preventDefault();
  
  // Compara a letra digitada (em maiúsculo) com o objetivo
  if (inputChar.toUpperCase() === letraObjetivo.toUpperCase()) {
    setSucesso(true);
    setErro(false);
    
    // Chamamos o finalizarFase do Hook. 
    // Ele vai calcular o tempo e enviar (pontos, tempo, erros) para o onAcerto.
    setTimeout(() => finalizarFase(60), 1500); 
    
  } else {
    // Registra o erro no nosso contador de telemetria do Hook
    registrarErro(); 
    
    setErro(true);
    setInputChar('');
    setTimeout(() => setErro(false), 500);
    inputRef.current?.focus();
  }
};

  const pesos = [128, 64, 32, 16, 8, 4, 2, 1];

  return (
    <div className={`flex flex-col items-center gap-6 p-6 border-2 transition-all duration-500 rounded-lg ${
      sucesso ? 'border-blue-400 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : 'border-green-900 bg-zinc-900/30'
    }`}>
      
      <div className="text-center space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-blue-500 font-bold">
          [ MODO: INTERPRETADOR_ASCII ]
        </p>
        <h2 className="text-sm text-white opacity-80 italic font-mono uppercase">
          Converta o sinal de bits para o caractere Alfanumérico:
        </h2>
      </div>

      {/* Visualização dos Bits (Sinal de Entrada) */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {bitsVisual.map((bit, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-[8px] text-green-900 font-bold">{pesos[i]}</span>
            <div className={`w-9 h-12 flex items-center justify-center text-xl font-black border-2 ${
              bit === 1 ? 'border-blue-500 text-blue-400 bg-blue-900/20' : 'border-zinc-800 text-zinc-800'
            }`}>
              {bit}
            </div>
          </div>
        ))}
      </div>

      {/* Interface de Entrada de Texto */}
      <form onSubmit={verificarResposta} className="w-full max-w-90 space-y-4">
        <div className="flex flex-col items-center gap-2">
          <label className="text-[10px] text-blue-700 font-mono uppercase">Caractere Detectado:</label>
          <input
            ref={inputRef}
            type="text"
            maxLength={1}
            value={inputChar}
            disabled={sucesso}
            onChange={(e) => setInputChar(e.target.value)}
            placeholder='?'
            className={`w-20 h-20 bg-black border-2 text-center text-5xl font-mono focus:outline-none transition-all ${
              erro ? 'border-red-600 animate-shake' : 'border-blue-900 focus:border-blue-500 text-blue-400'
            } ${sucesso ? 'border-blue-400 text-white' : ''}`}
          />
        </div>

        <TerminalButton 
          label={sucesso ? "CARACTERE_VALIDADO" : "DECODIFICAR_SINAL"} 
          type="submit"
          disabled={sucesso || !inputChar}
          className="w-full"
        />
      </form>

      {/* Mini Tabela de Ajuda (Opcional, mas ótimo para o PIBID) */}
      <div className="p-2 bg-black/40 border border-blue-900/30 rounded text-[9px] font-mono text-blue-900 flex gap-4">
        <div>A = 65</div>
        <div>B = 66</div>
        <div>C = 67</div>
        <div>...</div>
        <div className="text-blue-500 underline decoration-dotted">Consulte a Tabela ASCII</div>
      </div>
    </div>
  );
}