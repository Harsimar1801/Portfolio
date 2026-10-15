export default function Section({ id, number, eyebrow, title, children }) {
  return (
    <section className="content-section" id={id}>
      <div className="section-index">{number} / {eyebrow}</div>
      <div className="section-body">
        <h2>{title}</h2>
        {children}
      </div>
    </section>
  )
}
