import { useEffect, useState } from 'react';
import { useCharacterStore } from './stores';
import { CharacterCreate } from './components/character';
import { Header } from './components/layout/Header';
import { MainView, ShowcaseView, ProfileView } from './router/AppRouter';

type AppMode = 'create' | 'main' | 'showcase' | 'profile';

function App() {
  const character = useCharacterStore((state) => state.character);
  const isCreating = useCharacterStore((state) => state.isCreating);
  const setIsCreating = useCharacterStore((state) => state.setIsCreating);

  const [appMode, setAppMode] = useState<AppMode>('main');

  useEffect(() => {
    if (!character && !isCreating) {
      setIsCreating(true);
    }
  }, [character, isCreating, setIsCreating]);

  const handleCreateComplete = () => {
    setIsCreating(false);
    setAppMode('main');
  };

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
    </div>
  );
}

export default App;
