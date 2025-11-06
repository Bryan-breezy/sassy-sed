import React, { PropsWithChildren, ButtonHTMLAttributes } from 'react'

type DotButtonProps = PropsWithChildren<{
  selected: boolean
  onClick: () => void
  label?: string
}> & ButtonHTMLAttributes<HTMLButtonElement>

export const DotButton: React.FC<DotButtonProps> = (props) => {
  const { children, selected, onClick, label, ...restProps } = props
  const isSelected = !!selected // ensure boolean
  return (
    <button
      type="button"
      aria-pressed={isSelected ? "true" : "false"}
      onClick={onClick}
      aria-label={label || "Go to slide"}
      title={label || "Go to slide"}
      {...restProps}
    >
      {children || (label ?? "•")}
    </button>
  )
}

