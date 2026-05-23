import { ProfilePage } from '../pages/ProfilePage';

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
