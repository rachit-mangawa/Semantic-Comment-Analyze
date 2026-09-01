export const ArchitectureDiagram = () => {
  return (
    <section className="mb-24">
      <h2 className="text-3xl font-serif font-light text-ink mb-12 tracking-tight text-center">
        Data Flow Architecture
      </h2>
      <div className="relative w-full h-[600px] border border-hairline rounded-2xl bg-canvas-soft overflow-hidden p-8 flex items-center justify-center">
        <img 
          src="/arch.svg" 
          alt="Architecture Diagram" 
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </section>
  );
};
