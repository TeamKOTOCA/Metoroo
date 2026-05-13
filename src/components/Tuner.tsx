const ticks = [-50, -25, 0, 25, 50];

const Tuner = () => {
  return (
    <section className="screen_stack" aria-labelledby="tuner-title">
      <header className="hero_card">
        <p className="eyebrow">Fast tune</p>
        <h1 id="tuner-title">チューナー</h1>
        <p className="screen_lead">ステージ上でも見やすいコントラストと、スマホ片手操作を意識した余白にしました。</p>
      </header>

      <section className="control_card tuner_card" aria-label="チューニング状態">
        <div className="note_readout">
          <span className="note_name">A</span>
          <span className="note_octave">4</span>
        </div>
        <p className="frequency_text">440.0 Hz</p>
        <div className="tuner_meter" aria-label="チューニングメーター">
          {ticks.map((tick) => (
            <span className={tick === 0 ? 'center_tick' : ''} key={tick}>{tick}</span>
          ))}
          <i aria-hidden="true" />
        </div>
        <p className="tuner_hint">中央に針が合うように調整してください。</p>
      </section>

      <section className="insight_grid" aria-label="チューナー設定ショートカット">
        <article>
          <span>Mode</span>
          <strong>クロマチック</strong>
        </article>
        <article>
          <span>Input</span>
          <strong>マイク待機</strong>
        </article>
      </section>
    </section>
  );
};

export default Tuner;
