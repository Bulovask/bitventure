import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Tela = 'inicio' | 'fases' | 'resultados';

interface JogoState {
  nome: string;
  pontuacao: number;
  telaAtiva: Tela;
  faseAtual: number;
  
  // Ações
  setNome: (nome: string) => void;
  setTela: (tela: Tela) => void;
  adicionarPontos: (pontos: number) => void;
  avancarFase: () => void;
  resetarJogo: () => void;
}

export const useJogoStore = create<JogoState>()(
  persist(
    (set) => ({
      // Estados Iniciais
      nome: '',
      pontuacao: 0,
      telaAtiva: 'inicio',
      faseAtual: 1,

      // Setters Diretos
      setNome: (nome) => set({ nome: nome.trim().toUpperCase() }),
      
      setTela: (tela) => set({ telaAtiva: tela }),

      // Lógica de Acúmulo
      adicionarPontos: (pontos) => 
        set((state) => ({ pontuacao: state.pontuacao + pontos })),

      avancarFase: () => 
        set((state) => ({ faseAtual: state.faseAtual + 1 })),

      // Reset Completo do Estado
      resetarJogo: () => 
        set({ 
          nome: '', 
          pontuacao: 0, 
          telaAtiva: 'inicio', 
          faseAtual: 1 
        }),
    }),
    {
      name: 'terminal-binario-storage',
      // Opcional: define explicitamente o storage para evitar erros de hidratação no Next.js
      storage: createJSONStorage(() => localStorage), 
    }
  )
);