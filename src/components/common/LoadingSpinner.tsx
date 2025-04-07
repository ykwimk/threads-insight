interface Props {
  borderColor?: string;
  borderWidth?: string;
}

export default function LoadingSpinner({
  borderColor = 'border-black',
  borderWidth = 'border-4',
}: Props) {
  return (
    <div className="flex items-center justify-center p-6">
      <div
        className={`h-6 w-6 animate-spin rounded-full ${borderWidth} border-t-transparent ${borderColor}`}
      ></div>
    </div>
  );
}
