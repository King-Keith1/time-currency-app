import { Card, Text, Button, Group, Select } from "@mantine/core";
import { useState } from "react";

function TimeConverter() {
  const [sourceZone, setSourceZone] = useState("America/New_York");
  const [targetZone, setTargetZone] = useState("Europe/London");
  const [result, setResult] = useState(null);

  const handleConvert = () => {
    // TODO: Replace with Luxon logic
    setResult("Converted time here (placeholder)");
  };

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder style={{ flex: 1 }}>
      <Text fw={600} mb="sm">⏰ Time Converter</Text>
      <Group grow>
        <Select
          data={["America/New_York", "Europe/London", "Asia/Tokyo"]}
          value={sourceZone}
          onChange={setSourceZone}
          label="From"
        />
        <Select
          data={["America/New_York", "Europe/London", "Asia/Tokyo"]}
          value={targetZone}
          onChange={setTargetZone}
          label="To"
        />
      </Group>
      <Button mt="md" onClick={handleConvert}>Convert</Button>
      {result && <Text mt="sm">{result}</Text>}
    </Card>
  );
}

export default TimeConverter;
