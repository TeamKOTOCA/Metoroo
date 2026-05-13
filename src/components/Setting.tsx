import { useMainNavigation } from '../navigation';

const Setting_ui = () => {
  const navigateByFileName = useMainNavigation();

  return (
    <section className="screen_stack" aria-labelledby="setting-title">
      <header className="hero_card">
        <p className="eyebrow">Personalize</p>
        <h1 id="setting-title">設定</h1>
        <p className="screen_lead">音楽練習アプリで求められやすい、見やすさ・省電力・アクセシビリティ項目を前面に出しました。</p>
      </header>

      <section className="control_card settings_list" aria-label="表示設定">
        <button type="button">
          <span>
            <strong>高コントラスト表示</strong>
            <small>暗い場所でも読みやすい配色</small>
          </span>
          <i aria-hidden="true">ON</i>
        </button>
        <button type="button">
          <span>
            <strong>触覚フィードバック</strong>
            <small>開始・停止を手元で確認</small>
          </span>
          <i aria-hidden="true">OFF</i>
        </button>
        <button type="button">
          <span>
            <strong>低モーション</strong>
            <small>端末負荷と視覚疲労を抑制</small>
          </span>
          <i aria-hidden="true">AUTO</i>
        </button>
      </section>

      <button className="wide_link_button" type="button" onClick={() => navigateByFileName('License')}>
        ライセンス表示
      </button>
    </section>
  );
};

export default Setting_ui;
