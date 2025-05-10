import { useState, useEffect } from "react";
import EstimateTable from "./components/EstimateTable";
import { formatCurrency } from "./services/estimateService";

export default function App() {
  const [grandTotal, setGrandTotal] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGrandTotalUpdate = (total) => {
    setGrandTotal(total);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header
        className={`sticky top-0 z-10 bg-white ${
          isScrolled ? "shadow-md" : ""
        } transition-shadow duration-300`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Estimate Manager
              </h1>
              <p className="text-gray-600 text-sm">
                Manage and view detailed cost estimates by section
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-3 flex items-center shadow-sm">
              <div>
                <span className="text-gray-600 text-sm block mb-1">
                  Main Total
                </span>
                <span className="text-2xl font-bold text-green-800">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <EstimateTable onGrandTotalUpdate={handleGrandTotalUpdate} />
      </main>

      <footer className="container mx-auto mt-12 px-4 py-6 text-center text-gray-500 text-sm border-t border-gray-200">
        <p className="mt-1">Developed by Manish Gohil</p>
      </footer>
    </div>
  );
}
