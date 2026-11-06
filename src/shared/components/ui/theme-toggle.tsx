import { useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn, getTheme, setTheme, type Theme } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';

const themes: Theme[] = ['light', 'dark', 'system'];

const themeIcons: Record<Theme, React.ReactNode> = {
  light: <Sun className="size-4" />,
  dark: <Moon className="size-4" />,
  system: <Monitor className="size-4" />,
};

const themeLabels: Record<Theme, string> = {
  light: 'Sáng',
  dark: 'Tối',
  system: 'Theo hệ thống',
};

interface ThemeToggleProps {
  /** Square icon button, for toolbars where a text label would be too wide. */
  iconOnly?: boolean;
  className?: string;
}

export function ThemeToggle({ iconOnly = false, className }: ThemeToggleProps = {}) {
  // Lazy initialiser: reads localStorage once, on the first render.
  const [current, setCurrent] = useState<Theme>(getTheme);

  const cycle = () => {
    const next = themes[(themes.indexOf(current) + 1) % themes.length];
    setTheme(next);
    setCurrent(next);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycle}
      title={`Giao diện: ${themeLabels[current]}`}
      aria-label={`Đổi giao diện (hiện tại: ${themeLabels[current]})`}
      className={cn('gap-1.5 text-muted-foreground hover:text-foreground', iconOnly && 'size-10 p-0', className)}
    >
      {themeIcons[current]}
      {!iconOnly && <span className="hidden sm:inline">{themeLabels[current]}</span>}
    </Button>
  );
}
