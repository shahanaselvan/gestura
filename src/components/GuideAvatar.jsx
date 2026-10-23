export default function GuideAvatar({ guide, variant = 'head', className = '' }) {
  const head = variant === 'head'
  return (
    <img
      src={head ? guide.head : guide.body}
      alt={`${guide.name}, a friendly guide`}
      draggable="false"
      className={
        head
          ? `aspect-square rounded-full border-2 border-white bg-white object-contain shadow-soft ${className}`
          : `h-auto object-contain ${className}`
      }
    />
  )
}