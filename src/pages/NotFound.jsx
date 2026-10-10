import { Link } from "react-router-dom";
import Card from "../components/ui/Card";

export default function NotFound() {
  return (
    <Card title="404">
      <p className="text-lg font-semibold">Page not found</p>
      <Link to="/" className="mt-3 inline-flex h-11 items-center rounded-full bg-sky-600 px-5 text-white">
        Back to dashboard
      </Link>
    </Card>
  );
}