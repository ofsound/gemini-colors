import {useState} from "react";
import {ColorDisplay} from "./components/ColorDisplay";
import {Controls, type ColorSpace, type DisplayMode} from "./components/Controls";

function App() {
  const [startColor, setStartColor] = useState("#0000ff");
  const [endColor, setEndColor] = useState("#ff0000");
  const [steps, setSteps] = useState(10);
  const [colorSpace, setColorSpace] = useState<ColorSpace>("srgb");
  const [mode, setMode] = useState<DisplayMode>("static");

  return (
    <div className="app-container">
      <header>
        <h1>CSS Color Tweening</h1>
        <p>Interpolation in CSS color spaces</p>
      </header>

      <main>
        <ColorDisplay startColor={startColor} endColor={endColor} steps={steps} colorSpace={colorSpace} mode={mode} />
        <Controls startColor={startColor} setStartColor={setStartColor} endColor={endColor} setEndColor={setEndColor} steps={steps} setSteps={setSteps} colorSpace={colorSpace} setColorSpace={setColorSpace} mode={mode} setMode={setMode} />
      </main>
    </div>
  );
}

export default App;
