import { useState } from 'react'
import Metronome from './components/Metronome';
import Tuner from './components/Tuner';
import Metronome_icon from './assets/nav/metronome.svg?react';
import Tuner_icon from './assets/nav/tuner.svg?react';
import Moremanu_icon from './assets/nav/moremanu.svg?react';
import './App.css'

function App() {
  const [currentTab, setCurrentTab] = useState('metro');

  return (
    <>
      <main>
        {currentTab === 'metro' ? <Metronome /> : <Tuner />}
      </main>
      <div id='tab_nav'>
        <button onClick={() => setCurrentTab('metro')}>
          <Metronome_icon className="nav_icon"/>
          メトロノーム
        </button>
        <button onClick={() => setCurrentTab('tuner')}>
          <Tuner_icon className="nav_icon"/>
          チューナー
        </button>
        <button onClick={() => alert("aaa")}>
          <Moremanu_icon className="nav_icon"/>
          その他
        </button>
      </div>
    </>
  )
}

export default App
