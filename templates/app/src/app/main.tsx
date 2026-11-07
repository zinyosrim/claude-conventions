import { render } from 'preact';
import './styles.css';
import { Shell } from './components/Shell.js';
import { route } from './lib/router.js';
import { watchForUpdates } from './lib/update.js';
import { HomeScreen } from './screens/Home.js';
import { ImprintScreen, PrivacyScreen } from './screens/Legal.js';

function App() {
  switch (route.value) {
    case 'imprint':
      return <ImprintScreen />;
    case 'privacy':
      return <PrivacyScreen />;
    default:
      return <HomeScreen />;
  }
}

// Vor allem Nachgeladenen: der Build, mit dem die App startet (lib/update.ts).
watchForUpdates();

render(
  <Shell>
    <App />
  </Shell>,
  document.getElementById('app')!,
);
