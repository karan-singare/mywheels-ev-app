import { tva } from '@gluestack-ui/utils/nativewind-utils';

export const cardStyle = tva({
  base: 'flex-col rounded-xl',
  variants: {
    size: {
      sm: 'p-3 gap-3',
      md: 'p-4 gap-4',
      lg: 'p-6 gap-6',
    },
    variant: {
      elevated: 'bg-card shadow-sm',
      outline: 'bg-card border border-border',
      ghost: '',
      filled: 'bg-card',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'elevated',
  },
});
