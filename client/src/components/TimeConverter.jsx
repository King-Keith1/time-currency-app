import { Card, Text, Button, Group, Select } from "@mantine/core";
import { useState } from "react";
import { getTimeZoneOptions, convertToTimeZone } from "../utils/timeUtils";

function TimeConverter() {
  const timezoneOptions = getTimeZoneOptions();

  const [sourceZone, setSourceZone] = useState(timezoneOptions[0]?.value || "America/New_York");
  const [targetZone, setTargetZone] = useState(timezoneOptions[1]?.value || "Europe/London");
  const [result, setResult] = useState(null);

  const handleConvert = () => {
    try {
      const now = new Date();

      const sourceTime = convertToTimeZone(now, sourceZone, { timeStyle: "long", dateStyle: "long" });
      const targetTime = convertToTimeZone(now, targetZone, { timeStyle: "long", dateStyle: "long" });

      setResult(`${sourceTime} in ${sourceZone} = ${targetTime} in ${targetZone}`);
    } catch (error) {
      setResult("Error: Invalid time zone");
    }
  };

  const handlePin = () => {
    const pinItem = `${sourceZone} → ${targetZone}`;
    const pins = JSON.parse(localStorage.getItem("pins") || "[]");
    if (!pins.includes(pinItem)) {
      pins.push(pinItem);
      localStorage.setItem("pins", JSON.stringify(pins));
    }
  };

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder style={{ flex: 1 }}>
      <Text fw={600} mb="sm">⏰ Time Converter</Text>
      <Group grow>
        <Select
          searchable
          data={timezoneOptions}
          value={sourceZone}
          onChange={setSourceZone}
          label="From"
        />
        <Select
          searchable
          data={timezoneOptions}
          value={targetZone}
          onChange={setTargetZone}
          label="To"
        />
      </Group>
      <Button mt="md" onClick={handleConvert}>Convert</Button>
      {result && <Text mt="sm">{result}</Text>}
      {result && <Button mt="xs" variant="light" onClick={handlePin}>Pin this conversion</Button>}
    </Card>
  );
}

export default TimeConverter;