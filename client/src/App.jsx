import { MantineProvider } from "@mantine/core";
import { useState } from "react";
import React from "react";
import TimeConverter from "./components/TimeConverter";
import TimeZoneSelector from "./components/TimeZoneSelector";

function App() {
  const [dark, setDark] = useState(false);

  return (
    <MantineProvider theme={{ colorScheme: dark ? "dark" : "light" }}>
      <div style={{ padding: "2rem" }}>
        <h1>Time & Currency Converter</h1>
        <button onClick={() => setDark(!dark)}>
          Toggle {dark ? "Light" : "Dark"} Mode
        </button>

        <TimeConverter />
      </div>

      {/* Moved inside MantineProvider */}
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <TimeZoneSelector />
      </div>
    </MantineProvider>
  );
}

export default App;
