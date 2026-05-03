import { useCallback, useState } from 'react';
import { License, Metronome, Setting, Tuner } from './components';
import { NavigationProvider } from './navigation';
import Metronome_icon from './assets/nav/metronome.svg?react';
import Tuner_icon from './assets/nav/tuner.svg?react';
import Moremanu_icon from './assets/nav/moremanu.svg?react';
import Setting_icon from './assets/nav/Setting.svg?react';
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
      toggle_moremanu(false);
    }
  }, []);

  const CurrentScreen = screensByFileName[currentScreenFileName];

  const [MoreManuisVisible, setMoreManuisVisible] = useState(false);

  const toggle_moremanu = (show:boolean) => setMoreManuisVisible(show);

  return (
    <NavigationProvider value={navigateByFileName}>
      <main>
        <CurrentScreen />
      </main>
      <div id="tab_nav">
        <button className={currentScreenFileName === 'Metronome' ? 'active' : ''} onClick={() => navigateByFileName('Metronome')}>
          <Metronome_icon className="nav_icon" />
          メトロノーム
        </button>
        <button className={currentScreenFileName === 'Tuner' ? 'active' : ''} onClick={() => navigateByFileName('Tuner')}>
          <Tuner_icon className="nav_icon" />
          チューナー
        </button>
        <button className={
            MoreManuisVisible ||
            ['Tuner', 'Metronome'].includes(currentScreenFileName)
              ? ''
              : 'active'
          } onClick={() => toggle_moremanu(!MoreManuisVisible)}>
          <Moremanu_icon className="nav_icon" />
          その他
        </button>
      </div>
      {MoreManuisVisible && (
        <>
        <div
          id="overlay"
          onClick={() => toggle_moremanu(false)}
        />
        <div id='more_manu'>
          <h1>Metoroo</h1><small>v0.1.0</small>

          <div>
            <button className={currentScreenFileName === 'Setting' ? 'active' : ''} onClick={() => navigateByFileName('Setting')}>
              <Setting_icon className="nav_icon" />
              設定
            </button>
          </div>
          
        </div>
        </>
      )}
    </NavigationProvider>
  );
}

export default App;
