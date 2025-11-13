import { useSimStore } from "../store";
export default function WeatherPage(){
  const { env, setEnv } = useSimStore();
  return (
    <div className="page">
      <aside className="card">
        <h3>环境参数</h3>
        <div className="form-row"><label>天气</label>
          <select value={env.weather} onChange={e=>setEnv({weather:e.target.value as any})}>
            <option value="clear">晴</option><option value="raining">雨</option><option value="snowing">雪</option><option value="fog">雾</option>
          </select>
        </div>
        <div className="form-row"><label>路面</label>
          <select value={env.surface} onChange={e=>setEnv({surface:e.target.value as any})}>
            <option value="dry">干燥</option><option value="wet">湿</option><option value="snow">雪</option><option value="ice">冰</option>
          </select>
        </div>
        <div className="form-row"><label>空气密度 ρ</label><input type="number" step="0.01" value={env.rho} onChange={e=>setEnv({rho:+e.target.value})}/></div>
        <div className="form-row"><label>滚阻 Crr</label><input type="number" step="0.001" value={env.Crr} onChange={e=>setEnv({Crr:+e.target.value})}/></div>
      </aside>
      <main className="card"><h3>说明</h3><p className="help">天气/路面映射为 μ、Crr、ρ。</p></main>
    </div>
  );
}
