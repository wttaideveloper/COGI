import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonBaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-gold text-teal-deep hover:bg-gold-light focus-visible:ring-gold',
  secondary: 'bg-teal-deep text-white hover:bg-teal-mid focus-visible:ring-teal-light',
  outline: 'border-2 border-teal-deep text-teal-deep hover:bg-teal-deep hover:text-white',
  ghost: 'text-teal-deep hover:bg-mist-dark',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

function buttonClasses(variant: ButtonVariant, size: ButtonSize, className?: string) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    variants[variant],
    sizes[size],
    className,
  )
}

interface ButtonProps extends ButtonBaseProps, React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </button>
  )
}

interface ButtonLinkProps extends ButtonBaseProps, Omit<LinkProps, 'className'> {}

export function ButtonLink({ variant = 'primary', size = 'md', className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </Link>
  )
}
