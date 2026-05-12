const beatLabels = ['1', '2', '3', '4'];

const Metronome = () => {
  return (
    <section className="screen_stack" aria-labelledby="metronome-title">
      <header className="hero_card">
        <p className="eyebrow">Practice ready</p>
        <h1 id="metronome-title">メトロノーム</h1>
        <p className="screen_lead">すぐ触れる大きなBPM表示と、練習中でも迷わない操作面に整えました。</p>
      </header>

      <section className="control_card bpm_card" aria-label="テンポ設定">
        <div>
          <span className="bpm_value">120</span>
          <span className="bpm_unit">BPM</span>
        </div>
        <div className="tempo_slider" aria-hidden="true">
          <span style={{ width: '54%' }} />
        </div>
        <div className="quick_actions">
          <button type="button">−5</button>
          <button type="button" className="primary_action">START</button>
          <button type="button">＋5</button>
        </div>
      </section>

      <section className="control_card" aria-labelledby="beat-title">
        <div className="section_title_row">
          <h2 id="beat-title">拍子</h2>
          <span className="status_pill">4/4</span>
        </div>
        <div className="beat_grid" aria-label="4拍のビジュアル表示">
          {beatLabels.map((label, index) => (
            <span className={index === 0 ? 'accent_beat' : ''} key={label}>{label}</span>
          ))}
        </div>
      </section>

      <section className="insight_grid" aria-label="練習ショートカット">
        <article>
          <span>Tap</span>
          <strong>テンポ入力</strong>
        </article>
        <article>
          <span>Timer</span>
          <strong>15分練習</strong>
        </article>
      </section>
    </section>
  );
};

export default Metronome;
