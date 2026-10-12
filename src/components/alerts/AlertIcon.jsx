import { BellRing } from "lucide-react";
import { ICONS } from "./alertMeta";

export default function AlertIcon({ alert, ...props }) {
  const Icon = ICONS[alert.icon] ?? BellRing;
  return <Icon {...props} />;
}
