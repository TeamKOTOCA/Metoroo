const License = () => {
  return (
    <section className="screen_stack" aria-labelledby="license-title">
      <header className="hero_card">
        <p className="eyebrow">Open source</p>
        <h1 id="license-title">ライセンス</h1>
        <p className="screen_lead">Metorooで利用している素材のクレジットです。</p>
      </header>

      <section className="control_card license_card" aria-label="ライセンス一覧">
        <h2>アイコン</h2>
        <table>
          <thead>
            <tr>
              <th>名前</th>
              <th>作者</th>
              <th>リンク</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Coolicons</td>
              <td>Kryston Schwarze</td>
              <td>
                <a href="https://coolicons.cool/" target="_blank" rel="noopener noreferrer">
                  公式サイト
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </section>
  );
};

export default License;
