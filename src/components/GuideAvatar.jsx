import CustomAvatar from './CustomAvatar'

// variant "head": round head-and-shoulders. variant "body": full standing figure.
export default function GuideAvatar({ guide, variant = 'head', className = '' }) {
  const head = variant === 'head'
  const circle = 'aspect-square rounded-full border-2 border-white bg-white shadow-soft'

  if (guide.custom) {
    return (
      <CustomAvatar
        profile={{ ...guide.profile, name: guide.name }}
        variant={variant}
        className={head ? `${circle} ${className}` : className}
      />
    )
  }

  return (
    <img
      src={head ? guide.head : guide.body}
      alt={`${guide.name}, a friendly guide`}
      draggable="false"
      className={head ? `${circle} object-contain ${className}` : `object-contain ${className}`}
    />
  )
}