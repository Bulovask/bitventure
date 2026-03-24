import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Tela = 'boot' | 'inicio' | 'fases' | 'resultados';

interface JogoState {
  nome: string;
  pontuacao: number;
  telaAtiva: Tela;
  faseAtual: number;
  tempoTotal: number; // Tempo acumulado em ms
  respostas: number[]; // Ex: [1, 0, 1] -> 1: Acerto Direto, 0: Teve Erros
  
  // Ações
  setNome: (nome: string) => void;
  setTela: (tela: Tela) => void;
  // Agora passamos pontos, tempo da fase e se houve erro
  registrarFase: (pontos: number, tempoFase: number, houveErro: boolean) => void;
  resetarJogo: () => void;
}

export const useJogoStore = create<JogoState>()(
  persist(
    (set) => ({
      nome: '',
      pontuacao: 0,
      telaAtiva: 'inicio',
      faseAtual: 1,
      tempoTotal: 0,
      respostas: [],

      setNome: (nome) => set({ nome: nome.trim().toUpperCase() }),
      
      setTela: (tela) => set({ telaAtiva: tela }),

      // Lógica Centralizada de Registro
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
          respostas: []
        }),
    }),
    {
      name: 'terminal-binario-storage',
      storage: createJSONStorage(() => localStorage), 
    }
  )
);