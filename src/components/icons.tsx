import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function CheckIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke} {...props}>
      <path d="M4.5 12.5l4.6 4.6L19.5 6.8" />
    </svg>
  );
}

export function PinIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke} {...props}>
      <path d="M9.5 3.5h5l-.8 5.6 3.3 2.9v1.5H7v-1.5l3.3-2.9-.8-5.6Z" />
      <path d="M12 13.5V20.5" />
    </svg>
  );
}

export function PinOffIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke} {...props}>
      <path d="M9.5 3.5h5l-.8 5.6 3.3 2.9v1.5H7v-1.5l3.3-2.9-.8-5.6Z" />
      <path d="M12 13.5V20.5" />
      <path d="M3.2 3.2l17.6 17.6" />
    </svg>
  );
}

export function DropletIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke} {...props}>
      <path d="M12 3.2c1.9 2.2 5.4 6.5 5.4 9.6a5.4 5.4 0 0 1-10.8 0c0-3.1 3.5-7.4 5.4-9.6Z" />
    </svg>
  );
}

export function ChevronDownIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke} {...props}>
      <path d="M6 9.5l6 6 6-6" />
    </svg>
  );
}

export function ChevronUpIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke} {...props}>
      <path d="M6 14.5l6-6 6 6" />
    </svg>
  );
}

export function MinusIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke} {...props}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function CloseIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function PlusIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke} strokeWidth={2.2} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function TrashIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke} {...props}>
      <path d="M4 7h16M9.5 7V4.8h5V7M6.5 7l.9 13h9.2l.9-13" />
      <path d="M10.5 11v5.5M13.5 11v5.5" />
    </svg>
  );
}

export function PencilIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke} {...props}>
      <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
      <path d="M13.8 5.8l3 3" />
    </svg>
  );
}

export function RotateIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke} {...props}>
      <path d="M20 12a8 8 0 1 1-2.4-5.7" />
      <path d="M20 4v4.5h-4.5" />
    </svg>
  );
}
