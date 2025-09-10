import { useState } from "react";
import {
  MantineProvider,
  ColorSchemeProvider,
  AppShell,
  Header,
  Footer,
  Group,
  Button,
  Text,
} from "@mantine/core";
import CurrencyConverter from "./components/CurrencyConverter";
import TimeConverter from "./components/TimeConverter";
import Pins from "./components/Pins";

function App() {
  const [colorScheme, setColorScheme] = useState("light");
  const toggleColorScheme = () =>
    setColorScheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <AppShell
          header={
            <Header height={60} p="sm">
              <Group position="apart">
                <Text fw={700}>🌍 Time & Currency Converter</Text>
                <Button size="xs" onClick={toggleColorScheme}>
                  {colorScheme === "dark" ? "Light Mode" : "Dark Mode"}
                </Button>
              </Group>
            </Header>
          }
          footer={
            <Footer height={40} p="sm">
              <Text size="xs" align="center" style={{ width: "100%" }}>
                © {new Date().getFullYear()} My Converter App
              </Text>
            </Footer>
          }
        >
          <Group align="flex-start" spacing="xl" grow>
            <CurrencyConverter />
            <TimeConverter />
            <Pins />
          </Group>
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
