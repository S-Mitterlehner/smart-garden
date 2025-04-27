import { Badge } from "@mantine/core";

export default function PropertyEntry({
  property,
  value,
  unit,
}: {
  property: string;
  value?: string | number;
  unit?: string;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-400">{property}</span>
      <div className="flex flex-row gap-2 items-center min-h-[25px]">
        {value !== null && value !== undefined ? (
          <>
            <span className="text-gray-600">{value}</span>
            {unit && <span className="text-gray-400 line-clamp-1">{unit}</span>}
          </>
        ) : (
          <Badge color="gray" radius="sm" size="xs">
            N/A
          </Badge>
        )}
      </div>
    </div>
  );
}
