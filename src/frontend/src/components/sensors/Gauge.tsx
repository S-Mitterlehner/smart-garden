export type GaugeProps = {
  value: number;
  min: number;
  max: number;
  rangeFrom: number;
  rangeTo: number;
};

export default function Gauge({
  value,
  min,
  max,
  rangeFrom = -1,
  rangeTo = -1,
}: GaugeProps) {
  if (rangeFrom > -1 && rangeTo > -1) {
    return (
      <svg width="200" height="120" viewBox="0 0 200 120">
        <path
          d={describeArc({
            min,
            max,
            rangeFrom: min,
            rangeTo: rangeFrom,
          })}
          stroke="red"
          stroke-width="20"
          fill="none"
        />

        <path
          d={describeArc({
            min,
            max,
            rangeFrom: rangeFrom,
            rangeTo: rangeTo,
          })}
          stroke="green"
          stroke-width="20"
          fill="none"
        />

        <path
          d={describeArc({
            min,
            max,
            rangeFrom: rangeTo,
            rangeTo: max,
          })}
          stroke="red"
          stroke-width="20"
          fill="none"
        />
        <path
          d={describeNeedle({ min, max, value })}
          stroke="black"
          stroke-width="5"
          fill="none"
        />
      </svg>
    );
  }

  return (
    <div className="">
      <svg width="200" height="120" viewBox="0 0 200 120">
        <path
          d={describeArc({
            min,
            max,
            rangeFrom: min,
            rangeTo: max,
          })}
          stroke="#ddd"
          stroke-width="20"
          fill="none"
        />

        <path
          d={describeNeedle({ min, max, value })}
          stroke="black"
          stroke-width="5"
          fill="none"
        />
      </svg>
    </div>
  );
}

type ArcInput = {
  min: number;
  max: number;
  rangeFrom: number;
  rangeTo: number;
  radius?: number;
  centerX?: number;
  centerY?: number;
  totalAngle?: number; // degrees (default: 180)
};

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

export function describeArc({
  min,
  max,
  rangeFrom,
  rangeTo,
  radius = 80,
  centerX = 100,
  centerY = 100,
  totalAngle = 180,
}: ArcInput): string {
  const range = max - min;

  // Normalize values into angles
  const startAngle = ((rangeFrom - min) / range) * totalAngle - totalAngle / 2;
  const endAngle = ((rangeTo - min) / range) * totalAngle - totalAngle / 2;

  const start = polarToCartesian(centerX, centerY, radius, startAngle);
  const end = polarToCartesian(centerX, centerY, radius, endAngle);

  const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? "0" : "1";

  return [
    `M ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
  ].join(" ");
}

export function describeNeedle({
  min,
  max,
  value,
  radius = 80, // slightly shorter than arc radius
  centerX = 100,
  centerY = 100,
  totalAngle = 180,
}: {
  min: number;
  max: number;
  value: number;
  radius?: number;
  centerX?: number;
  centerY?: number;
  totalAngle?: number;
}): string {
  const range = max - min;
  const angle = ((value - min) / range) * totalAngle - totalAngle / 2;

  const tip = polarToCartesian(centerX, centerY, radius, angle);

  return `M ${centerX} ${centerY} L ${tip.x} ${tip.y}`;
}
