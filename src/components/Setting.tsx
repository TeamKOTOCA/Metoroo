import { useMainNavigation } from '../navigation';

const Setting_ui = () => {
  const navigateByFileName = useMainNavigation();

  return (
    <div>
      <h1>設定</h1>
      <button onClick={() => navigateByFileName('License')}>ライセンス表示</button>
    </div>
  );
};

export default Setting_ui;
