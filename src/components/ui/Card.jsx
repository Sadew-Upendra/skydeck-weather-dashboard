export default function Card({ title, icon: Icon, className = "", children }) {
  return (
    <section
      className={`rounded-3xl border border-white/20 bg-white/80 p-5 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 ${className}`}
    >
      {title && (
        <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {Icon && <Icon size={14} />}
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}
