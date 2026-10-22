export default function ComingSoon({ title }) {
  return (
    <section className="mx-auto max-w-2xl py-20 text-center">
      <span className="pill">Coming soon</span>
      <h1 className="mt-4 text-4xl font-bold gradient-text">{title}</h1>
      <p className="mt-3 text-muted">This feature is still being built.</p>
    </section>
  )
}