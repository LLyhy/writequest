import { ShowcasePage } from '../pages/ShowcasePage';
import { PixelButton } from '../components/ui/PixelButton';

interface ShowcaseViewProps {
  onBack: () => void;
}

export function ShowcaseView({ onBack }: ShowcaseViewProps) {
  return (
    <div className="min-h-screen bg-pixel-bg">
      <ShowcasePage onBack={onBack} />
    </div>
  );
}
