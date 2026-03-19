export function GridBackground() {
  return (
    <div
      className='pointer-events-none fixed inset-0 z-0'
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
        `,
        backgroundSize: '52px 52px'
      }}
    />
  );
}
