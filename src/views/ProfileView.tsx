import { ProfilePage } from '../pages/ProfilePage';
import { PixelButton } from '../components/ui/PixelButton';

interface ProfileViewProps {
  onBack: () => void;
}

export function ProfileView({ onBack }: ProfileViewProps) {
  return (
    <div className="min-h-screen bg-pixel-bg">
      <ProfilePage onBack={onBack} />
    </div>
  );
}
