import { Paper } from "@mantine/core";

export default function Card({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <Paper withBorder radius="md" p="xs" className="w-full phone:w-56 relative">
      <h3 className="text-lg text-gray-700 font-semibold pb-2">{title}</h3>
      <div>{children}</div>
    </Paper>
  );
}
