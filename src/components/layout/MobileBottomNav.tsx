import { Home, Zap, Sparkles, User } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';

interface MobileBottomNavProps {
  onNavigateToMain: () => void;
  onNavigateToBoss: () => void;
  onNavigateToShowcase: () => void;
  onNavigateToProfile: () => void;
  activeView?: string;
}

export function MobileBottomNav({
  onNavigateToMain,
  onNavigateToBoss,
  onNavigateToShowcase,
  onNavigateToProfile,
  activeView,
}: MobileBottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-pixel-panel border-t-2 border-pixel-border z-50 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex justify-around py-2">
        <PixelButton
          variant={activeView === 'main' ? 'primary' : 'secondary'}
          size="sm"
          onClick={onNavigateToMain}
          className="flex flex-col items-center gap-1 py-2 px-2 flex-1"
        >
          <Home size={20} />
          <span className="text-[10px] font-mono">首页</span>
        </PixelButton>
        
        <PixelButton
          variant={activeView === 'boss' ? 'primary' : 'secondary'}
          size="sm"
          onClick={onNavigateToBoss}
          className="flex flex-col items-center gap-1 py-2 px-2 flex-1"
        >
          <Zap size={20} />
          <span className="text-[10px] font-mono">Boss</span>
        </PixelButton>
        
        <PixelButton
          variant={activeView === 'showcase' ? 'primary' : 'secondary'}
          size="sm"
          onClick={onNavigateToShowcase}
          className="flex flex-col items-center gap-1 py-2 px-2 flex-1"
        >
          <Sparkles size={20} />
          <span className="text-[10px] font-mono">广场</span>
        </PixelButton>
        
        <PixelButton
          variant={activeView === 'profile' ? 'primary' : 'secondary'}
          size="sm"
          onClick={onNavigateToProfile}
          className="flex flex-col items-center gap-1 py-2 px-2 flex-1"
        >
          <User size={20} />
          <span className="text-[10px] font-mono">我的</span>
        </PixelButton>
      </div>
    </div>
  );
}
