import { useCallback, useState } from 'react';
import { License, Metronome, Setting, Tuner } from './components';
import { NavigationProvider } from './navigation';
import Metronome_icon from './assets/nav/metronome.svg?react';
import Tuner_icon from './assets/nav/tuner.svg?react';
import Moremanu_icon from './assets/nav/moremanu.svg?react';
import Setting_icon from './assets/nav/setting.svg?react';
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
  const [isMoreMenuVisible, setIsMoreMenuVisible] = useState(false);

  const toggleMoreMenu = (show: boolean) => setIsMoreMenuVisible(show);

  const navigateByFileName = useCallback((fileName: string) => {
    if (fileName in screensByFileName) {
      setCurrentScreenFileName(fileName as ScreenFileName);
      toggleMoreMenu(false);
    }
  }, []);

  const CurrentScreen = screensByFileName[currentScreenFileName];
  const isMoreScreenActive = !['Tuner', 'Metronome'].includes(currentScreenFileName);

  return (
    <NavigationProvider value={navigateByFileName}>
      <main className="app_shell" aria-live="polite">
        <CurrentScreen />
      </main>
      <nav id="tab_nav" aria-label="主要ナビゲーション">
        <button
          type="button"
          className={currentScreenFileName === 'Metronome' ? 'active' : ''}
          aria-current={currentScreenFileName === 'Metronome' ? 'page' : undefined}
          onClick={() => navigateByFileName('Metronome')}
        >
          <Metronome_icon className="nav_icon" aria-hidden="true" />
          <span>メトロノーム</span>
        </button>
        <button
          type="button"
          className={currentScreenFileName === 'Tuner' ? 'active' : ''}
          aria-current={currentScreenFileName === 'Tuner' ? 'page' : undefined}
          onClick={() => navigateByFileName('Tuner')}
        >
          <Tuner_icon className="nav_icon" aria-hidden="true" />
          <span>チューナー</span>
        </button>
        <button
          type="button"
          className={isMoreMenuVisible || isMoreScreenActive ? 'active' : ''}
          aria-expanded={isMoreMenuVisible}
          aria-controls="more_menu"
          onClick={() => toggleMoreMenu(!isMoreMenuVisible)}
        >
          <Moremanu_icon className="nav_icon" aria-hidden="true" />
          <span>その他</span>
        </button>
      </nav>
      {isMoreMenuVisible && (
        <>
          <button
            type="button"
            id="overlay"
            aria-label="その他メニューを閉じる"
            onClick={() => toggleMoreMenu(false)}
          />
          <aside id="more_menu" aria-label="その他メニュー">
            <div className="sheet_handle" aria-hidden="true" />
            <div className="sheet_header">
              <div>
                <p className="eyebrow">軽量ミュージックツール</p>
                <h1>Metoroo</h1>
              </div>
              <small>v0.1.0</small>
            </div>

            <div className="sheet_grid">
              <button
                type="button"
                className={currentScreenFileName === 'Setting' ? 'active' : ''}
                onClick={() => navigateByFileName('Setting')}
              >
                <Setting_icon className="nav_icon" aria-hidden="true" />
                <span>設定</span>
              </button>
            </div>
          </aside>
        </>
      )}
    </NavigationProvider>
  );
}

export default App;
