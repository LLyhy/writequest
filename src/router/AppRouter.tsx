import { HashRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { AppPage } from '../pages/AppPage';
import { MainView } from '../views/MainView';
import { BossBattleView } from '../views/BossBattleView';
import { AdventureView } from '../views/AdventureView';
import { ShowcaseView } from '../views/ShowcaseView';
import { ProfileView } from '../views/ProfileView';

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<AppPage />} />
      </Routes>
    </HashRouter>
  );
}

export { MainView, BossBattleView, AdventureView, ShowcaseView, ProfileView };
