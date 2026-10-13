import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const Trends = lazy(() => import("./pages/Trends"));
const Compare = lazy(() => import("./pages/Compare"));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="compare" element={<Compare />} />
        <Route path="trends" element={<Trends />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
