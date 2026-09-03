type ServiceIconId =
  | "analysis"
  | "custom-software"
  | "system-design"
  | "uiux"
  | "architecture"
  | "mobile"
  | "deployment";

type ServiceIconProps = {
  id: ServiceIconId;
  className?: string;
};

const stroke = "currentColor";

export function ServiceIcon({ id, className = "h-4 w-4" }: ServiceIconProps) {
  const props = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (id) {
    case "analysis":
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="7" />
          <path d="M16.5 16.5L21 21" />
          <path d="M8 11h6M11 8v6" />
        </svg>
      );
    case "custom-software":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M8 9l-3 3 3 3M16 9l3 3-3 3" />
        </svg>
      );
    case "system-design":
      return (
        <svg {...props}>
          <path d="M4 18h16M7 14l3-8 3 5 4-9" />
          <circle cx="7" cy="14" r="1.5" fill={stroke} stroke="none" />
          <circle cx="10" cy="11" r="1.5" fill={stroke} stroke="none" />
          <circle cx="13" cy="16" r="1.5" fill={stroke} stroke="none" />
          <circle cx="17" cy="7" r="1.5" fill={stroke} stroke="none" />
        </svg>
      );
    case "uiux":
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M7 8h4M7 12h10M7 16h7" />
        </svg>
      );
    case "architecture":
      return (
        <svg {...props}>
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <rect x="14" y="10" width="6" height="10" rx="1" />
          <rect x="9" y="4" width="6" height="6" rx="1" />
          <path d="M10 10l2 2M14 13l2-1M10 14l4 2" />
        </svg>
      );
    case "mobile":
      return (
        <svg {...props}>
          <rect x="7" y="2.5" width="10" height="19" rx="2" />
          <path d="M11 18.5h2" />
        </svg>
      );
    case "deployment":
      return (
        <svg {...props}>
          <path d="M7 18a4 4 0 1 1 0-8 5.5 5.5 0 0 1 10.9 1.1A3.5 3.5 0 1 1 17 18H7z" />
          <path d="M12 12v6M9.5 14.5L12 12l2.5 2.5" />
        </svg>
      );
    default:
      return null;
  }
}
