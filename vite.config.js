import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Plugin to prevent Vite from processing legacy HTML files
function ignoreLegacyHtmlPlugin() {
  return {
    name: 'ignore-legacy-html',
    resolveId(id) {
      // Block resolution of .js files imported from Oyunlar HTML files
      if (id.match(/\/(BreakoutGame|CityRunner|DartGame|FlappyBird|PongGame|SkyJumper|SnakeGame|CizimGame|Game2048|JigsawPuzzle|MemoryGame|MinesweeperGame|NonogramGame|PuzzleGame|SekerEslestirmece|TetrisGame|WordSearchGame|BatakGame|CardGames|ConnectFourGame|OkeyGame101|OkeyPro|PokerGame|TicTacToeGame|MazeGame)\.js$/)) {
        return { id, external: true }
      }
    },
    configureServer(server) {
      // Middleware to block serving of legacy HTML files
      server.middlewares.use((req, res, next) => {
        if (req.url && (req.url.includes('/Oyunlar/') || req.url.includes('/frontend/')) && req.url.endsWith('.html')) {
          res.statusCode = 404
          res.end('Legacy HTML files are not served. Please use the React app at /NeuranaWorld/')
          return
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [
    react({
      include: /\.(jsx|js)$/,
    }),
    ignoreLegacyHtmlPlugin(),
  ],
  base: '/NeuranaWorld/',
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/,
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    watch: {
      // Ignore Oyunlar HTML files to prevent Vite from processing them
      ignored: ['**/Oyunlar/**/*.html', '**/frontend/**'],
    },
  },
})
