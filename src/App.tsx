import { useEffect, useState } from 'react';
import { useCharacterStore } from './stores';
import { CharacterCreate } from './components/character';
import { Header } from './components/layout/Header';
import { MainView, ShowcaseView, ProfileView } from './router/AppRouter';
import { useAuthStore } from './stores/authStore';
import { AuthModal } from './components/auth/AuthModal';

type AppMode = 'create' | 'main' | 'showcase' | 'profile';

function App() {
  const character = useCharacterStore((state) => state.character);
  const isCreating = useCharacterStore((state) => state.isCreating);
  const setIsCreating = useCharacterStore((state) => state.setIsCreating);
  const { isLoading: authLoading, checkAuth } = useAuthStore();

  const [appMode, setAppMode] = useState<AppMode>('main');
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!character && !isCreating) {
      setIsCreating(true);
    }
  }, [character, isCreating, setIsCreating]);

  const handleCreateComplete = () => {
    setIsCreating(false);
    setAppMode('main');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-pixel-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pixel-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-pixel text-sm">加载中...</p>
        </div>
      </div>
    );
  }

  if (!character || isCreating) {
    return (
      <div className="min-h-screen bg-pixel-bg">
        <CharacterCreate onComplete={handleCreateComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pixel-bg">
      <Header
        onShowcaseClick={() => setAppMode('showcase')}
        onProfileClick={() => setAppMode('profile')}
        onBackToMain={() => setAppMode('main')}
        showBackButton={appMode !== 'main'}
        onLoginClick={() => setShowAuthModal(true)}
      />
      {appMode === 'main' && (
        <MainView
          onNavigateToShowcase={() => setAppMode('showcase')}
          onNavigateToProfile={() => setAppMode('profile')}
        />
      )}
      {appMode === 'showcase' && (
        <ShowcaseView onBack={() => setAppMode('main')} />
      )}
      {appMode === 'profile' && (
        <ProfileView onBack={() => setAppMode('main')} />
      )}
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

export default App;
