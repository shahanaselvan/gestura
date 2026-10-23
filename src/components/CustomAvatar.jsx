const INK = '#2b2140'
const MOUTH = '#7a3b3b'

export default function CustomAvatar({ profile, variant = 'body', className = '' }) {
  const { skin, hair, hairStyle, shirt, pants, expression, pose } = profile
  const head = variant === 'head'
  const waving = pose === 'wave'

  return (
    <svg
      viewBox={head ? '16 0 128 128' : '0 0 160 316'}
      className={className}
      role="img"
      aria-label={`${profile.name || 'Your guide'}, a custom guide`}
    >
      {/* long hair sits behind everything */}
      {hairStyle === 'long' && (
        <path d="M32 64 C28 40 132 40 128 64 L132 128 Q80 140 28 128 Z" fill={hair} />
      )}

      {/* legs and shoes */}
      <rect x="52" y="206" width="24" height="86" rx="10" fill={pants} />
      <rect x="84" y="206" width="24" height="86" rx="10" fill={pants} />
      <ellipse cx="62" cy="298" rx="17" ry="9" fill={INK} />
      <ellipse cx="98" cy="298" rx="17" ry="9" fill={INK} />

      {/* neck and torso */}
      <rect x="70" y="102" width="20" height="22" fill={skin} />
      <rect x="44" y="118" width="72" height="98" rx="24" fill={shirt} />

      {/* left arm (always down) */}
      <line x1="50" y1="140" x2="32" y2="198" stroke={skin} strokeWidth="13" strokeLinecap="round" />
      <line x1="50" y1="138" x2="42" y2="160" stroke={shirt} strokeWidth="20" strokeLinecap="round" />
      <circle cx="31" cy="201" r="8.5" fill={skin} />

      {/* right arm (down, or raised to wave) */}
      {waving ? (
        <>
          <line x1="110" y1="140" x2="142" y2="92" stroke={skin} strokeWidth="13" strokeLinecap="round" />
          <line x1="110" y1="138" x2="121" y2="122" stroke={shirt} strokeWidth="20" strokeLinecap="round" />
          <circle cx="144" cy="87" r="8.5" fill={skin} />
        </>
      ) : (
        <>
          <line x1="110" y1="140" x2="128" y2="198" stroke={skin} strokeWidth="13" strokeLinecap="round" />
          <line x1="110" y1="138" x2="118" y2="160" stroke={shirt} strokeWidth="20" strokeLinecap="round" />
          <circle cx="129" cy="201" r="8.5" fill={skin} />
        </>
      )}

      {/* ears and head */}
      <circle cx="36" cy="70" r="8" fill={skin} />
      <circle cx="124" cy="70" r="8" fill={skin} />
      <circle cx="80" cy="66" r="44" fill={skin} />

      {/* cheeks */}
      <circle cx="56" cy="84" r="7" fill="#ff7a90" opacity="0.28" />
      <circle cx="104" cy="84" r="7" fill="#ff7a90" opacity="0.28" />

      {/* eyes */}
      <circle cx="64" cy="68" r="5.5" fill={INK} />
      <circle cx="96" cy="68" r="5.5" fill={INK} />
      <circle cx="66" cy="66" r="1.8" fill="#fff" />
      <circle cx="98" cy="66" r="1.8" fill="#fff" />

      {/* eyebrows for the focused look */}
      {expression === 'focused' && (
        <>
          <line x1="55" y1="57" x2="72" y2="61" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          <line x1="105" y1="57" x2="88" y2="61" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        </>
      )}

      {/* mouth */}
      {expression === 'neutral' && (
        <path d="M70 88 H90" stroke={MOUTH} strokeWidth="3" strokeLinecap="round" fill="none" />
      )}
      {expression === 'smile' && (
        <path d="M66 84 Q80 98 94 84" stroke={MOUTH} strokeWidth="3" strokeLinecap="round" fill="none" />
      )}
      {expression === 'happy' && <path d="M64 82 Q80 106 96 82 Z" fill="#7a2d3a" />}
      {expression === 'focused' && (
        <path d="M72 89 H88" stroke={MOUTH} strokeWidth="3" strokeLinecap="round" fill="none" />
      )}

      {/* hair on top */}
      {hairStyle === 'bun' && <circle cx="80" cy="12" r="14" fill={hair} />}
      {hairStyle === 'curly' ? (
        <g fill={hair}>
          <circle cx="40" cy="50" r="15" />
          <circle cx="58" cy="32" r="16" />
          <circle cx="80" cy="26" r="17" />
          <circle cx="102" cy="32" r="16" />
          <circle cx="120" cy="50" r="15" />
          <circle cx="34" cy="70" r="9" />
          <circle cx="126" cy="70" r="9" />
        </g>
      ) : (
        hairStyle !== 'none' && (
          <path d="M34 66 C28 2 132 2 126 66 C116 48 98 40 80 40 C62 40 44 48 34 66 Z" fill={hair} />
        )
      )}
    </svg>
  )
}