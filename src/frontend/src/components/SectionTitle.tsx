import { ReactNode } from "react";

export type SectionTitleProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionComponent?: ReactNode;
};

export default function SectionTitle({
  title,
  description,
  icon,
  actionComponent,
}: SectionTitleProps) {
  // if description is set, pb should be 4, else it should be 0

  const pb = description ? "pb-4" : "pb-4 phone:pb-8";

  return (
    <div
      className={"pt-6 phone:border-t phone:border-gray-300 phone:mt-8 " + pb}
    >
      <h2 className="flex flex-row gap-4 justify-between text-2xl font-bold text-gray-800">
        <span className="flex flex-row gap-3 items-center">
          {icon} {title}
        </span>
        {actionComponent}
      </h2>
      {description && (
        <p className="pt-2 text-sm text-gray-500 pb-3">{description}</p>
      )}
    </div>
  );
}
