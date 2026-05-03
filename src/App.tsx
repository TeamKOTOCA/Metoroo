import { useCallback, useState } from 'react';
import { License, Metronome, Setting, Tuner } from './components';
import { NavigationProvider } from './navigation';
import Metronome_icon from './assets/nav/metronome.svg?react';
import Tuner_icon from './assets/nav/tuner.svg?react';
import Moremanu_icon from './assets/nav/moremanu.svg?react';
import './App.css';

const screensByFileName = {
  Metronome,
  Tuner,
  Setting,
  License,
} as const;

type ScreenFileName = keyof typeof screensByFileName;

function App() {
  const [currentScreenFileName, setCurrentScreenFileName] = useState<ScreenFileName>('Metronome');

  const navigateByFileName = useCallback((fileName: string) => {
    if (fileName in screensByFileName) {
      setCurrentScreenFileName(fileName as ScreenFileName);
    }
  }, []);

  const CurrentScreen = screensByFileName[currentScreenFileName];

  return (
    <NavigationProvider value={navigateByFileName}>
      <main>
        <CurrentScreen />
      </main>
      <div id="tab_nav">
        <button onClick={() => navigateByFileName('Metronome')}>
          <Metronome_icon className="nav_icon" />
          メトロノーム
        </button>
        <button onClick={() => navigateByFileName('Tuner')}>
          <Tuner_icon className="nav_icon" />
          チューナー
        </button>
        <button onClick={() => navigateByFileName('Setting')}>
          <Moremanu_icon className="nav_icon" />
          その他
        </button>
      </div>
    </NavigationProvider>
  );
}

export default App;
