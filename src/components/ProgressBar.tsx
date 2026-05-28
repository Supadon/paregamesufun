import { cn } from '@/lib/utils'

interface ProgressBarProps {
  label: string
  value: number
  size?: 'sm' | 'lg'
  labelWidth?: string
}

export default function ProgressBar({ label, value, size = 'sm', labelWidth }: ProgressBarProps) {
  const isDone = value >= 100
  const labelWidthClass = labelWidth || (size === 'lg' ? 'w-[150px] sm:w-[185px]' : 'w-[44px]')

  if (size === 'lg') {
    return (
      <div className="flex items-center gap-[9px] mb-2 last:mb-0">
        <span className={cn("text-xs text-text2 shrink-0 truncate pr-1.5", labelWidthClass)} title={label}>
          {label}
        </span>
        <div className="flex-1 h-[5px] rounded-full bg-[rgba(255,255,255,0.05)] overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-600 ease-out',
              isDone
                ? 'bg-gradient-to-r from-blue to-blue3'
                : 'bg-gradient-to-r from-[#2A3A6A] to-text3'
            )}
            style={{ width: `${value}%` }}
          />
        </div>
        <span className="text-xs text-text1 font-medium w-[34px] text-right shrink-0">
          {value}%
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-[7px] mb-[5px]">
      <span className={cn("text-[10px] text-text3 shrink-0 truncate pr-1", labelWidthClass)} title={label}>
        {label}
      </span>
      <div className="flex-1 h-[3px] rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isDone
              ? 'bg-gradient-to-r from-blue to-blue3'
              : 'bg-gradient-to-r from-text3 to-text2'
          )}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[10px] text-text2 w-[26px] text-right shrink-0">
        {value}%
      </span>
    </div>
  )
}
