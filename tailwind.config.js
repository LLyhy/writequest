/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 像素风配色
        pixel: {
          bg: '#2d2d2d',
          panel: '#3d3d3d',
          border: '#1a1a1a',
          highlight: '#4a4a4a',
          // 游戏主题色
          primary: '#4ade80',    // 绿色 - 经验值
          secondary: '#60a5fa',  // 蓝色 - 等级
          accent: '#fbbf24',     // 金色 - 金币
          danger: '#f87171',     // 红色 - Boss战
          magic: '#a78bfa',      // 紫色 - 技能
        },
        // 暗色奇幻RPG配色
        fantasy: {
          // 背景层次
          deep: '#0a0a0f',
          surface: '#12121a',
          elevated: '#1a1a2e',
          card: '#16162a',
          // 强调色
          gold: '#d4a843',
          'gold-light': '#f0d078',
          'gold-dark': '#a07830',
          'emerald-glow': '#34d399',
          'emerald-dark': '#059669',
          'arcane-purple': '#8b5cf6',
          'arcane-light': '#a78bfa',
          'arcane-dark': '#6d28d9',
          flame: '#f97316',
          'flame-light': '#fb923c',
          // 文字色层次
          'text-primary': '#e2e8f0',
          'text-secondary': '#94a3b8',
          'text-muted': '#64748b',
          // 边框
          border: 'rgba(212, 168, 67, 0.15)',
          'border-hover': 'rgba(212, 168, 67, 0.3)',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        mono: ['"Fira Code"', 'monospace'],
        fantasy: ['"Cinzel"', '"Noto Serif SC"', 'serif'],
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px rgba(0,0,0,0.5)',
        'pixel-sm': '2px 2px 0px 0px rgba(0,0,0,0.5)',
        'pixel-inset': 'inset 2px 2px 0px 0px rgba(0,0,0,0.3)',
        // 奇幻风格阴影
        'gold-glow': '0 0 20px rgba(212, 168, 67, 0.3), 0 0 60px rgba(212, 168, 67, 0.1)',
        'gold-glow-sm': '0 0 10px rgba(212, 168, 67, 0.2)',
        'emerald-glow': '0 0 20px rgba(52, 211, 153, 0.3), 0 0 60px rgba(52, 211, 153, 0.1)',
        'arcane-glow': '0 0 20px rgba(139, 92, 246, 0.3), 0 0 60px rgba(139, 92, 246, 0.1)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glass-gold': '0 8px 32px rgba(212, 168, 67, 0.1)',
      },
      backgroundImage: {
        // 渐变
        'gradient-gold': 'linear-gradient(135deg, #d4a843, #f0d078, #d4a843)',
        'gradient-gold-text': 'linear-gradient(135deg, #f0d078, #d4a843, #f0d078, #a07830)',
        'gradient-emerald': 'linear-gradient(135deg, #059669, #34d399, #059669)',
        'gradient-arcane': 'linear-gradient(135deg, #6d28d9, #8b5cf6, #a78bfa)',
        'gradient-hero': 'radial-gradient(ellipse at 50% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(212, 168, 67, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(52, 211, 153, 0.05) 0%, transparent 50%)',
        'gradient-section': 'linear-gradient(180deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%)',
      },
      animation: {
        'bounce-pixel': 'bounce-pixel 0.5s infinite',
        'pulse-pixel': 'pulse-pixel 2s infinite',
        'shine': 'shine 2s infinite',
        // 奇幻风格动画
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'scroll-down': 'scroll-down 2s ease-in-out infinite',
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'fade-in-up-delay': 'fade-in-up 0.8s ease-out 0.2s forwards',
        'fade-in-up-delay-2': 'fade-in-up 0.8s ease-out 0.4s forwards',
        'counter-up': 'counter-up 2s ease-out forwards',
      },
      keyframes: {
        'bounce-pixel': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'pulse-pixel': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'shine': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        // 奇幻风格关键帧
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        'scroll-down': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.5' },
          '50%': { transform: 'translateY(10px)', opacity: '1' },
        },
        'twinkle': {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'counter-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
