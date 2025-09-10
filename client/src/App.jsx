import { MantineProvider } from "@mantine/core";
import { useState } from "react";

function App() {
  const [dark, setDark] = useState(false);

  return (
    <MantineProvider theme={{ colorScheme: dark ? "dark" : "light" }}>
      <div style={{ padding: "2rem" }}>
        <h1>Time & Currency Converter</h1>
        <button onClick={() => setDark(!dark)}>
          Toggle {dark ? "Light" : "Dark"} Mode
        </button>
      </div>
    </MantineProvider>
  );
}

export default App;