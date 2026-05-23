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
    <div className="fixed bottom-0 left-0 right-0 bg-pixel-panel border-t-2 border-pixel-border z-40 md:hidden">
      <div className="flex justify-around py-2">
        <PixelButton
          variant={activeView === 'main' ? 'primary' : 'secondary'}
          size="sm"
          onClick={onNavigateToMain}
          className="flex flex-col items-center gap-1 py-2 px-3"
        >
          <Home size={18} />
          <span className="text-xs">首页</span>
        </PixelButton>
        
        <PixelButton
          variant={activeView === 'boss' ? 'primary' : 'secondary'}
          size="sm"
          onClick={onNavigateToBoss}
          className="flex flex-col items-center gap-1 py-2 px-3"
        >
          <Zap size={18} />
          <span className="text-xs">Boss</span>
        </PixelButton>
        
        <PixelButton
          variant={activeView === 'showcase' ? 'primary' : 'secondary'}
          size="sm"
          onClick={onNavigateToShowcase}
          className="flex flex-col items-center gap-1 py-2 px-3"
        >
          <Sparkles size={18} />
          <span className="text-xs">广场</span>
        </PixelButton>
        
        <PixelButton
          variant={activeView === 'profile' ? 'primary' : 'secondary'}
          size="sm"
          onClick={onNavigateToProfile}
          className="flex flex-col items-center gap-1 py-2 px-3"
        >
          <User size={18} />
          <span className="text-xs">我的</span>
        </PixelButton>
      </div>
    </div>
  );
}
