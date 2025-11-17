import { ButtonHTMLAttributes, forwardRef, CSSProperties } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'darkRed' | 'lightRed' | 'black' | 'white' | 'image'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  backgroundImage?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'darkRed', size = 'md', isLoading = false, backgroundImage, children, disabled, style, ...props }, ref) => {
    // Merge inline styles with backgroundImage if provided
    const combinedStyle: CSSProperties = {
      ...style,
      ...(backgroundImage && {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }),
    }

    return (
      <button
        className={clsx(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            // Variants
            'bg-[#ff2400] text-white hover:bg-[#cc1d00]': variant === 'darkRed',
            'bg-[#ff9999] text-black hover:bg-[#ff7777]': variant === 'lightRed',
            'bg-black text-white hover:bg-gray-800': variant === 'black',
            'bg-white text-black border-2 border-gray-300 hover:bg-gray-50': variant === 'white',
            'text-white border-2 border-gray-300 shadow-md hover:opacity-90': variant === 'image',
            // Sizes
            'h-9 px-3 text-sm': size === 'sm',
            'h-10 px-4 py-2': size === 'md',
            'h-11 px-8 text-lg': size === 'lg',
          },
          className
        )}
        style={combinedStyle}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
