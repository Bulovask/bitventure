"use client";

import { useEffect, useState } from "react";

interface Aluno {
  operador: string;
  score: number;
  tempo: string;
  precisao: string;
}

export default function PainelProjetor() {
  const [ranking, setRanking] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarDados = async () => {
    try {
      const URL = "https://script.google.com/macros/s/AKfycbxG_r7W8lWaHPgW5sy5WLSPzbR_23AZ3W6-oyfNZXZBKd9ItIY1x5iLgZqS8Z7_bepu/exec";
      const res = await fetch(URL);
      const data = await res.json();
      
      // Ordenação: Maior Score -> Menor Tempo
      const ordenado = data.sort((a: Aluno, b: Aluno) => b.score - a.score);
      setRanking(ordenado);
      setLoading(false);
    } catch (e) {
      console.error("Erro ao buscar dados do ranking");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarDados();
    const interval = setInterval(carregarDados, 15000); // Atualiza a cada 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4 overflow-hidden">
      {/* Header Tático */}
      <div className="border-b-2 border-green-900 mb-4 pb-2 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-green-400">
            SISTEMA_FALCÕES_NOTURNOS // MONITORAMENTO_GLOBAL
          </h1>
          <p className="text-xs text-green-900 mt-1 uppercase">
            [ STATUS: SINCRONIZAÇÃO_ATIVA ] [ FREQUÊNCIA: 15S ]
          </p>
        </div>
        <div className="text-right">
          <p className="text-5xl font-black text-green-900/30">{ranking.length}</p>
          <p className="text-[10px] uppercase tracking-widest">Agentes_Ativos</p>
        </div>
      </div>

      {/* Grid de Ranking */}
      <div className="grid grid-cols-1 gap-3 mx-auto">
        {ranking.map((aluno, index) => (
          <div 
            key={index}
            className={`flex items-center gap-6 p-2 border ${
              index === 0 
                ? 'border-yellow-500 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.1)]' 
                : 'border-green-900 bg-zinc-950/50'
            } animate-in slide-in-from-right duration-500`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="text-3xl font-black w-16 text-center italic opacity-50">
              {index + 1}º
            </div>
            
            <div className="flex-1">
              <p className="text-[9px] text-green-900 uppercase font-bold">Identificação_Agente</p>
              <p className="text-2xl font-black truncate">{aluno.operador}</p>
            </div>

            <div className="w-40 text-center border-l border-green-900/30">
              <p className="text-[9px] text-green-900 uppercase">Potencial_XP</p>
              <p className="text-2xl font-black text-green-400">{aluno.score}</p>
            </div>

            <div className="w-32 text-center border-l border-green-900/30">
              <p className="text-[9px] text-green-900 uppercase">Tempo_OP</p>
              <p className="text-xl font-bold">{aluno.tempo}</p>
            </div>

            <div className="w-24 text-center border-l border-green-900/30">
              <p className="text-[9px] text-green-900 uppercase">Precisão</p>
              <p className={`text-xl font-bold ${parseInt(aluno.precisao) > 70 ? 'text-green-500' : 'text-red-500'}`}>
                {aluno.precisao}
              </p>
            </div>
          </div>
        ))}

        {ranking.length === 0 && !loading && (
          <div className="text-center py-20 border-2 border-dashed border-green-900 rounded-lg">
            <p className="text-2xl font-black text-green-900 animate-pulse italic">
              AGUARDANDO FINALIZAÇÃO DO PRIMEIRO PROTOCOLO...
            </p>
          </div>
        )}
      </div>

      {/* Rodapé Decorativo */}
      <div className="fixed bottom-4 right-8 text-[9px] text-green-900/50 uppercase tracking-[0.3em]">
        BitVenture_Security_Protocol_2026 // PIBID_EDU
      </div>
    </div>
  );
}