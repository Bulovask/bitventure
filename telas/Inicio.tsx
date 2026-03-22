'use client';

import { useState } from 'react';
import { useJogoStore } from '@/store/useGameStore';

export default function Inicio() {
  const [inputNome, setInputNome] = useState('');
  
  // Pegamos as ações da nossa Store
  const setNome = useJogoStore((state) => state.setNome);
  const setTela = useJogoStore((state) => state.setTela);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputNome.trim()) {
      // 1. Salva o nome globalmente
      setNome(inputNome.toUpperCase());
      // 2. Muda a tela globalmente para iniciar as fases
      setTela('fases');
    }
  };

  return (
    <form 
      onSubmit={enviar} 
      className="flex flex-col items-start gap-4 py-4 px-4 md:px-12 font-mono"
    >
      {/* Cabeçalho de Log de Sistema */}
      <div className="w-full space-y-1 text-xs md:text-sm text-green-800 uppercase">
        <p>[ OK ] INITIALIZING_KERNEL_V8.0.19</p>
        <p>[ OK ] MOUNTING_RESOURCES_BIN_ASCII</p>
        <p>[ OK ] ESTABLISHING_LOCAL_CONNECTION</p>
      </div>

      <div className="w-full space-y-2">
        <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-green-500">
          TERMINAL_LOGIN_
        </h1>
        <p className="text-green-700 text-sm">IDENTIFIQUE-SE PARA ACESSAR O BANCO DE DADOS:</p>
      </div>

      {/* Input de Nome Estilizado e Maior */}
      <div className="w-full relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 text-2xl font-bold">
          &gt;
        </span>
        <input
          type="text"
          autoFocus
          value={inputNome}
          onChange={(e) => setInputNome(e.target.value)}
          placeholder="DIGITE_SEU_NOME..."
          className="w-full bg-zinc-950 border-2 border-green-900 text-green-400 p-4 pl-12 text-2xl uppercase tracking-widest focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-green-900"
          required
        />
      </div>

      {/* Botão de Comando */}
      <button 
        type="submit" 
        className="group relative overflow-hidden border border-green-500 px-10 py-2 font-bold text-green-500 hover:text-green-950 transition-colors duration-300"
      >
        <div className="absolute inset-0 bg-green-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-10" />
        [ EXECUTAR_LOGIN ]
      </button>

      <div className="mt-4 text-[10px] text-green-900">
        <p>CAUTION: UNAUTHORIZED ACCESS IS LOGGED BY THE SYSTEM.</p>
      </div>
    </form>
  );
}