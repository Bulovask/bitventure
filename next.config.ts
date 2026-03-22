import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  
  // Opcional: Se você for hospedar no GitHub Pages (ex: seu-usuario.github.io/nome-do-repositorio/)
  basePath: '/bitventure',
  
  // Opcional: Desativa a otimização de imagens nativa (que precisa de um servidor Node)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
