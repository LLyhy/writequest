import { ShowcasePage } from '../pages/ShowcasePage';

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
