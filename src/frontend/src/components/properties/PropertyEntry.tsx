import { Badge } from "@mantine/core";
import { Maybe } from "graphql/jsutils/Maybe";

export default function PropertyEntry({
  property,
  value,
  unit,
}: {
  property: string;
  value?: Maybe<string> | Maybe<number> | string | number;
  unit?: Maybe<string> | string;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-400">{property}</span>
      <div className="flex min-h-[25px] flex-row items-center gap-2">
        {value !== null && value !== undefined ? (
          <>
            <span className="text-gray-600">{value}</span>
            {unit && <span className="line-clamp-1 text-gray-400">{unit}</span>}
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
