import { useState } from 'react'
import Metronome from './components/Metronome'; // 別で作ったファイル
import Tuner from './components/Tuner';         // 別で作ったファイル
import metronome from './assets/nav/metronome.svg';
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
          <img src={metronome} alt="説明文"/>
          メトロノーム
        </button>
        <button onClick={() => setCurrentTab('tuner')}>チューナー</button>
      </div>
    </>
  )
}

export default App
