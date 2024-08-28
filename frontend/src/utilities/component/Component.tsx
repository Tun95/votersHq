import { Circle } from "rc-progress";

export const GradientDefs = () => (
  <svg width="0" height="0" >
    <defs>
      <linearGradient
        id="progressGradient1"
        x1="100%"
        y1="100%"
        x2="0%"
        y2="0%"
      >
        <stop offset="0%" style={{ stopColor: "#E4FFFA", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#0D9A7D", stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient
        id="progressGradient2"
        x1="100%"
        y1="100%"
        x2="0%"
        y2="0%"
      >
        <stop offset="0%" style={{ stopColor: "#FFF9E3", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#D6AB14", stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient
        id="progressGradient3"
        x1="100%"
        y1="100%"
        x2="0%"
        y2="0%"
      >
        <stop offset="0%" style={{ stopColor: "#FFE8E8", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#FF0C0C", stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient
        id="progressGradient4"
        x1="100%"
        y1="100%"
        x2="0%"
        y2="0%"
      >
        <stop offset="0%" style={{ stopColor: "#FFE8E8", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#976F6F", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
  </svg>
);
interface SemiCircleProgressProps {
  percent: number;
  gradientId: string;
}

export const SemiCircleProgress: React.FC<SemiCircleProgressProps> = ({
  percent,
  gradientId,
}) => {
  return (
    <div
      style={{
        position: "relative",
        width: "100px",
        height: "50px",
        overflow: "hidden",
      }}
    >
      <GradientDefs />

      <Circle
        percent={percent * 0.5}
        strokeWidth={10}
        trailWidth={10}
        strokeColor={`url(#${gradientId})`}
        trailColor="#d9d9d9"
        strokeLinecap="round"
        style={{
          transform: "rotate(-90deg)",
          transformOrigin: "center",
        }}
      />
    </div>
  );
};
