export default function Card({ title, icon: Icon, className = "", children }) {
  return (
    <section
      className={`min-w-0 rounded-3xl border border-white/20 bg-white/80 p-4 shadow-lg backdrop-blur-xl sm:p-5 dark:border-white/10 dark:bg-slate-900/60 ${className}`}
    >
      {title && (
        <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          {Icon && <Icon size={14} aria-hidden />}
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
