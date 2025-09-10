import { Card, Text, List } from "@mantine/core";

function Pins() {
  // Later, fetch from DB or localStorage
  const pinned = ["USD/EUR", "America/New_York → Asia/Tokyo"];

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder style={{ flex: 1 }}>
      <Text fw={600} mb="sm">📌 Pinned Favorites</Text>
      <List spacing="xs" size="sm">
        {pinned.map((item, idx) => (
          <List.Item key={idx}>{item}</List.Item>
        ))}
      </List>
    </Card>
  );
}

export default Pins;
