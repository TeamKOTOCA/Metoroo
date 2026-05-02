const License = () => {
  return (
    <>
        <h1>ライセンス</h1>
        <h2>アイコン</h2>
        <thead>
            <tr>
            <th>アイコンシリーズ名</th>
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
            {/* 項目を増やす場合はここへ <tr>...</tr> を追加 */}
        </tbody>
    </>
  );
};

export default License;