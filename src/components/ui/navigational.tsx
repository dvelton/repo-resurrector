import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LinkProps {
  children: ReactNode;
  href: string;
  className?: string;
  disabled?: boolean;
  external?: boolean;
  onClick?: () => void;
}

export function Link({
  children,
  href,
  className,
  disabled,
  external,
  onClick,
}: LinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const linkClasses = cn(
    "transition-colors hover:text-primary",
    {
      "opacity-50 cursor-not-allowed pointer-events-none": disabled,
    },
    className
  );

  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <a
      href={href}
      className={linkClasses}
      onClick={handleClick}
      {...externalProps}
    >
      {children}
    </a>
  );
}