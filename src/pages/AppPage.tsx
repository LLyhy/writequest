import App from '../App';
import { Link } from 'react-router-dom';

export default function AppPage() {
  return (
    <div className="min-h-screen bg-pixel-bg">
      {/* 顶部导航栏 - 返回Landing链接 */}
      <div className="app-nav sticky top-0 z-[60]">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <Link to="/" className="app-nav-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            返回首页
          </Link>
          <span className="text-fantasy-text-muted text-xs" style={{ fontFamily: "'Cinzel', serif" }}>
            WriteQuest
          </span>
        </div>
      </div>
      {/* 应用主体 */}
      <App />
    </div>
  );
}
