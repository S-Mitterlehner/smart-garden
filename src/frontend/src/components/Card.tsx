import { Paper } from "@mantine/core";

export default function Card({
  children,
  title,
  className,
}: {
  children: React.ReactNode;
  title: string;
  className?: string;
}) {
  return (
    <Paper
      withBorder
      radius="md"
      p="xs"
      className={
        "w-full phone:w-56 relative" + (className ? " " + className : "")
      }
    >
      <h3 className="text-lg text-gray-700 font-semibold pb-2">{title}</h3>
      <div>{children}</div>
    </Paper>
  );
}
