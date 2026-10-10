import { Component } from "react";
import { AlertTriangle } from "lucide-react";

export default class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error(error, info); }
  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div
        role="alert"
        className={`min-w-0 rounded-3xl bg-red-600 p-5 text-white ${this.props.className ?? ""}`}
      >
        <p className="flex items-center gap-2 font-medium">
          <AlertTriangle size={18} /> {this.props.name ?? "This section"} failed to load.
        </p>
        <button onClick={this.reset} className="mt-3 h-11 rounded-full bg-white/20 px-5 text-sm hover:bg-white/30">
          Try again
        </button>
      </div>
    );
  }
}