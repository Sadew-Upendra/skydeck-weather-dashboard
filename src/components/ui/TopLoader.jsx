import { useIsFetching } from "@tanstack/react-query";

export default function TopLoader() {
  const fetching = useIsFetching() > 0;
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 top-0 z-50 h-1 overflow-hidden transition-opacity duration-300 ${
        fetching ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="top-loader h-full w-1/3 rounded-full bg-white/90" />
    </div>
  );
}