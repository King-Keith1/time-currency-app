import { Card, Text, Button, Group, Select, NumberInput } from "@mantine/core";
import { useState } from "react";

function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [result, setResult] = useState(null);

  const handleConvert = () => {
    // TODO: Call backend or API
    setResult((amount * 0.9).toFixed(2)); // placeholder conversion
  };

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder style={{ flex: 1 }}>
      <Text fw={600} mb="sm">💱 Currency Converter</Text>
      <NumberInput value={amount} onChange={setAmount} label="Amount" />
      <Group grow mt="sm">
        <Select data={["USD", "EUR", "GBP", "JPY"]} value={from} onChange={setFrom} label="From" />
        <Select data={["USD", "EUR", "GBP", "JPY"]} value={to} onChange={setTo} label="To" />
      </Group>
      <Button mt="md" onClick={handleConvert}>Convert</Button>
      {result && (
        <Text mt="sm">
          {amount} {from} = <strong>{result} {to}</strong>
        </Text>
      )}
    </Card>
  );
}

export default CurrencyConverter;
