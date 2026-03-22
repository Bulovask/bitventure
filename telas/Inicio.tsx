'use client';

import { useState } from 'react';
import { useJogoStore } from '@/store/useGameStore';
import { TerminalLogs, TerminalTitle, TerminalButton } from '@/components/UI';

export default function Inicio() {
  const [inputNome, setInputNome] = useState('');
  const { setNome, setTela } = useJogoStore();

  const logsIniciais = [
    "INITIALIZING_KERNEL_V8.0.19",
    "MOUNTING_RESOURCES_BIN_ASCII",
    "ESTABLISHING_LOCAL_CONNECTION"
  ];

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputNome.trim()) {
      setNome(inputNome.trim());
      setTela('fases');
    }
  };

  return (
    <form onSubmit={enviar} className="flex flex-col items-start gap-8 py-4 px-4 md:px-12 font-mono">
      
      <TerminalLogs logs={logsIniciais} />

      <TerminalTitle 
        title="TERMINAL_LOGIN" 
        subtitle="IDENTIFIQUE-SE PARA ACESSAR O BANCO DE DADOS:" 
      />

      {/* Input - Mantive aqui por enquanto pois é o único com estado local */}
      <div className="w-full relative group">
        <label htmlFor="nome-operador" className="sr-only">Nome do Operador</label>
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 text-2xl font-bold pointer-events-none">
          &gt;
        </span>
        <input
          id="nome-operador"
          type="text"
          autoFocus
          autoComplete="off"
          value={inputNome}
          onChange={(e) => setInputNome(e.target.value)}
          placeholder="DIGITE_SEU_NOME..."
          className="w-full bg-zinc-950 border-2 border-green-900 text-green-400 p-4 pl-12 text-2xl uppercase tracking-widest focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-green-900 shadow-inner"
          required
        />
      </div>

      <TerminalButton label="EXECUTAR_LOGIN" type="submit" />

      <div className="mt-4 text-[10px] text-green-900 uppercase tracking-widest">
        <p>CAUTION: UNAUTHORIZED ACCESS IS LOGGED BY THE SYSTEM.</p>
      </div>
    </form>
  );
}