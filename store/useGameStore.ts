import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Definição das telas para evitar erros de digitação
export type Tela = 'inicio' | 'fases' | 'resultados';

interface JogoState {
  // Dados do Aluno
  nome: string;
  pontuacao: number;
  
  // Controle de Navegação
  telaAtiva: Tela;
  faseAtual: number;
  
  // Ações (Actions)
  setNome: (nome: string) => void;
  setTela: (tela: Tela) => void;
  adicionarPontos: (pontos: number) => void;
  avancarFase: () => void;
  resetarJogo: () => void;
}

export const useJogoStore = create<JogoState>()(
  persist(
    (set) => ({
      nome: '',
      pontuacao: 0,
      telaAtiva: 'inicio',
      faseAtual: 1,

      setNome: (nome) => set({ nome: nome.toUpperCase() }),
      
      setTela: (tela) => set({ telaAtiva: tela }),

      adicionarPontos: (pontos) => 
        set((state) => ({ pontuacao: state.pontuacao + pontos })),

      avancarFase: () => 
        set((state) => ({ faseAtual: state.faseAtual + 1 })),

      resetarJogo: () => 
        set({ nome: '', pontuacao: 0, telaAtiva: 'inicio', faseAtual: 1 }),
    }),
    {
      name: 'terminal-binario-storage', // Nome da chave no localStorage
    }
  )
);