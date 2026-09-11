interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
}

export function Loader({ size = 'md' }: LoaderProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div
        role="status"
        aria-label="Загрузка"
        className={`
          animate-spin
          rounded-full
          border-4
          border-neutral-700
          border-t-white
          ${size === 'sm' ? 'h-4 w-4' : ''}
          ${size === 'md' ? 'h-8 w-8' : ''}
          ${size === 'lg' ? 'h-12 w-12' : ''}
        `}
      />
    </div>
  );
}
