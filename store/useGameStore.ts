import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Tela = 'boot' | 'inicio' | 'fases' | 'resultados';

interface JogoState {
  nome: string;
  pontuacao: number;
  telaAtiva: Tela;
  faseAtual: number;
  tempoTotal: number;
  respostas: number[];
  // Nova Flag de Bloqueio
  sistemaBloqueado: boolean; 
  
  // Ações
  setNome: (nome: string) => void;
  setTela: (tela: Tela) => void;
  desbloquearSistema: () => void; // Ação para o botão do Boot
  registrarFase: (pontos: number, tempoFase: number, houveErro: boolean) => void;
  resetarJogo: () => void;
}

export const useJogoStore = create<JogoState>()(
  persist(
    (set) => ({
      nome: '',
      pontuacao: 0,
      telaAtiva: 'inicio', // O estado salvo será 'inicio', 'fases', etc.
      faseAtual: 1,
      tempoTotal: 0,
      respostas: [],
      sistemaBloqueado: true, // Sempre inicia como true ao carregar/recarregar

      setNome: (nome) => set({ nome: nome.trim().toUpperCase() }),
      
      setTela: (tela) => set({ telaAtiva: tela }),

      // Chamada pelo botão da tela de Boot
      desbloquearSistema: () => set({ sistemaBloqueado: false }),

      registrarFase: (pontos, tempoFase, houveErro) => 
        set((state) => ({ 
          pontuacao: state.pontuacao + pontos,
          tempoTotal: state.tempoTotal + tempoFase,
          respostas: [...state.respostas, houveErro ? 0 : 1],
          faseAtual: state.faseAtual + 1
        })),

      resetarJogo: () => 
        set({ 
          nome: '', 
          pontuacao: 0, 
          telaAtiva: 'inicio', 
          faseAtual: 1,
          tempoTotal: 0,
          respostas: [],
          sistemaBloqueado: false // Ao resetar, não precisa de boot de novo
        }),
    }),
    {
      name: 'terminal-binario-storage',
      storage: createJSONStorage(() => localStorage),
      // FILTRO DE PERSISTÊNCIA:
      // Salvamos tudo no localStorage, EXCETO a flag 'sistemaBloqueado'.
      partialize: (state) => {
        const { sistemaBloqueado, ...rest } = state;
        return rest;
      },
    }
  )
);