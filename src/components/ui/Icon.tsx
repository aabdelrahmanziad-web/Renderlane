type IconName = "cube" | "motion" | "code" | "launch" | "cart" | "spark" | "arrow" | "plus" | "check" | "mail" | "phone" | "pin";

const paths: Record<IconName, React.ReactNode> = {
  cube: (
    <>
      <path d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7Z" />
      <path d="M3.5 7 12 11.5 20.5 7M12 11.5v10" />
    </>
  ),
  motion: (
    <>
      <path d="M3 12c3-6 6-6 9 0s6 6 9 0" />
      <path d="M3 18c3-3 6-3 9 0" opacity=".5" />
    </>
  ),
  code: (
    <>
      <path d="m8 6-6 6 6 6M16 6l6 6-6 6" />
      <path d="m14 4-4 16" opacity=".6" />
    </>
  ),
  launch: (
    <>
      <path d="M5 19c1-4 3-7 7-11 3-3 6-4 8-4 0 2-1 5-4 8-4 4-7 6-11 7Z" />
      <circle cx="14.5" cy="9.5" r="1.5" />
      <path d="M8 13 4 12l3-4h4M11 16l1 4 4-3v-4" opacity=".6" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2.5l2.2 11h11l2-8H7" />
      <circle cx="9" cy="19.5" r="1.3" />
      <circle cx="17" cy="19.5" r="1.3" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="m6 6 2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" opacity=".6" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
};

export function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export type { IconName };
