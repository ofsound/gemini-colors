import {useState} from "react";
import {ColorDisplay} from "./components/ColorDisplay";
import {Controls, type ColorSpace} from "./components/Controls";

function App() {
  const [startColor, setStartColor] = useState("#0000ff");
  const [endColor, setEndColor] = useState("#ff0000");
  const [steps, setSteps] = useState(10);
  const [colorSpace, setColorSpace] = useState<ColorSpace>("srgb");

  return (
    <div className="app-container">
      <header>
        <h1>CSS Color Tweening</h1>
        <p>Interpolation in CSS color spaces</p>
      </header>

      <main>
        <ColorDisplay startColor={startColor} endColor={endColor} steps={steps} colorSpace={colorSpace} mode="static" />
        <Controls startColor={startColor} setStartColor={setStartColor} endColor={endColor} setEndColor={setEndColor} steps={steps} setSteps={setSteps} colorSpace={colorSpace} setColorSpace={setColorSpace} />
      </main>
    </div>
  );
}

export default App;
