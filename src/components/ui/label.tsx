import type { LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

const Label = ({ className, ...props }: LabelProps) => {
  return (
    <label
      className={cn('text-sm font-medium leading-none', className)}
      {...props}
    />
  );
};

export { Label };
