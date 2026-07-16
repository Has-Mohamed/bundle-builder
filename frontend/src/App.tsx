import { Toaster } from "sonner";
import { Accordion } from "./components/accordion/Accordion";
import { TwoColumnLayout } from "./components/layout/TwoColumnLayout";
import { ReviewPanel } from "./components/review/ReviewPanel";
import useProducts from "./hooks/useProducts";

export default function App() {
  // Fetch products and hydrate the store
  useProducts();

  return (
    <div className="min-h-screen bg-white">
      <Toaster />
      <TwoColumnLayout builder={<Accordion />} review={<ReviewPanel />} />
    </div>
  );
}
