import { AdventureModePanel } from '../components/adventure';
import { PixelButton } from '../components/ui/PixelButton';

interface AdventureViewProps {
  onBack: () => void;
}

export function AdventureView({ onBack }: AdventureViewProps) {
  return (
    <div className="min-h-screen bg-pixel-bg p-4">
      <div className="mb-4">
        <PixelButton variant="secondary" size="md" onClick={onBack}>
          ← 返回
        </PixelButton>
      </div>
      <AdventureModePanel onClose={onBack} />
    </div>
  );
}
