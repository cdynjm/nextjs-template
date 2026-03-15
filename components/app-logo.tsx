interface AppLogoProps {
  className?: string;
}

export function AppLogo({ className = "" }: AppLogoProps) {
  return (
    <div
      className={`bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg ${className}`}
    >
      NJs
    </div>
  );
}