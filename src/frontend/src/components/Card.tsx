import { Paper, Tooltip } from "@mantine/core";
export default function Card({
  children,
  title,
  className,
  icon,
  right,
}: {
  children: React.ReactNode;
  title: string;
  className?: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <Paper
      withBorder
      radius="md"
      p="xs"
      className={
        "w-full phone:w-64 relative min-h-[270px]" +
        (className ? " " + className : "")
      }
    >
      <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-center">
        <div>{icon}</div>
        <Tooltip
          label={title}
          position="top"
          withArrow
          disabled={(title?.length ?? 0) < 15}
        >
          <h3 className="text-lg text-gray-700 font-semibold line-clamp-1">
            {title}
          </h3>
        </Tooltip>
        <div>{right}</div>
      </div>
      <div>{children}</div>
    </Paper>
  );
}
