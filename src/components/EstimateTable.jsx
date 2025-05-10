import { useState, useEffect, useRef } from "react";
import { FaEye } from "react-icons/fa";
import {
  fetchEstimateData,
  formatCurrency,
  formatRawNumber,
  calculateItemTotal,
  calculateSectionTotal,
  calculateGrandTotal,
  transformEstimateData,
} from "../services/estimateService";

export default function EstimateTable({ onGrandTotalUpdate }) {
  const qtyInputRefs = useRef({});
  const [estimateData, setEstimateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const unitCostInputRefs = useRef({});
  const thBaseClass = "p-3 text-xs font-medium tracking-wide text-gray-700";

  useEffect(() => {
    const loadEstimateData = async () => {
      try {
        setLoading(true);
        const raw = await fetchEstimateData();
        const transformed = transformEstimateData(raw);
        if (!transformed) throw new Error("Invalid estimate format");
        setEstimateData(transformed);
        onGrandTotalUpdate(calculateGrandTotal(transformed.sections));
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadEstimateData();
  }, []);

  const handleQuantityChange = (sectionIndex, itemIndex, value) => {
    const display = value;
    const qty = value === "" ? 0 : parseFloat(value) || 0;

    setEstimateData((prev) => {
      const updated = structuredClone(prev);
      const item = updated.sections?.[sectionIndex]?.items?.[itemIndex];

      if (!item) return prev;

      item.qtyDisplay = display;
      item.qty = qty;
      item.total = calculateItemTotal(qty, item.unit_cost);

      onGrandTotalUpdate(calculateGrandTotal(updated.sections));
      return updated;
    });
  };

  const handleUnitCostChange = (sectionIndex, itemIndex, value) => {
    const display = value;
    const unitCost = value === "" ? 0 : parseFloat(value) * 100 || 0;

    setEstimateData((prev) => {
      const updated = structuredClone(prev);
      const item = updated.sections?.[sectionIndex]?.items?.[itemIndex];

      if (!item) return prev;

      item.unitCostDisplay = display;
      item.unit_cost = unitCost;
      item.total = calculateItemTotal(item.qty, unitCost);

      onGrandTotalUpdate(calculateGrandTotal(updated.sections));
      return updated;
    });
  };

  const startEditing = (sectionIndex, itemIndex, type) => {
    setEditingCell({ sectionIndex, itemIndex, type });

    setTimeout(() => {
      if (
        type === "qty" &&
        qtyInputRefs.current[sectionIndex] &&
        qtyInputRefs.current[sectionIndex][itemIndex]
      ) {
        qtyInputRefs.current[sectionIndex][itemIndex].focus();
        qtyInputRefs.current[sectionIndex][itemIndex].select();
      } else if (
        type === "unitCost" &&
        unitCostInputRefs.current[sectionIndex] &&
        unitCostInputRefs.current[sectionIndex][itemIndex]
      ) {
        unitCostInputRefs.current[sectionIndex][itemIndex].focus();
        unitCostInputRefs.current[sectionIndex][itemIndex].select();
      }
    }, 10);
  };

  const stopEditing = () => {
    setEditingCell(null);
  };

  if (loading)
    return <div className="text-center p-8">Loading estimate data...</div>;
  if (error)
    return <div className="text-center p-8 text-red-600">Error: {error}</div>;
  if (!estimateData || !estimateData.sections)
    return <div className="text-center p-8">No estimate data available</div>;

  const { sections } = estimateData;

  return (
    <div className="container mx-auto px-4 py-6">
      {sections &&
        sections.map((section, sectionIndex) => (
          <div
            key={`section-${section.section_id}-${sectionIndex}`}
            className="mb-10"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center">
                <span className="mr-2">—</span> {section.section_name} Section
              </h2>
              <div className="flex items-center">
                <span className="font-bold mr-2 text-gray-800">
                  {formatCurrency(calculateSectionTotal(section.items))}
                </span>
                <span className="text-green-600 hover:text-green-800 cursor-pointer">
                  <FaEye className="w-4 h-4" />
                </span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className={`text-left ${thBaseClass}`}>Type</th>
                    <th className={`text-left ${thBaseClass}`}>Item Name</th>
                    <th className={`text-right ${thBaseClass}`}>QTY</th>
                    <th className={`text-right ${thBaseClass}`}>Unit Cost</th>
                    <th className={`text-center ${thBaseClass}`}>Unit</th>
                    <th className={`text-right ${thBaseClass}`}>Total</th>
                    <th className={`text-center ${thBaseClass}`}>Tax</th>
                    <th className={`text-left ${thBaseClass}`}>Cost Code</th>
                    <th className={`text-center ${thBaseClass}`}></th>
                  </tr>
                </thead>

                <tbody className="bg-white ">
                  {section.items && section.items.length > 0 ? (
                    section.items.map((item, itemIndex) => (
                      <tr
                        key={`item-${item.item_id}-${itemIndex}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="p-3 text-sm text-gray-700">
                          {item.type || "N/A"}
                        </td>
                        <td className="p-3 text-sm text-gray-700 font-medium">
                          {item.task_name || "Unnamed Item"}
                        </td>

                        <td
                          className="p-3 text-sm text-gray-700 text-right cursor-pointer"
                          onClick={() =>
                            startEditing(sectionIndex, itemIndex, "qty")
                          }
                        >
                          {editingCell &&
                          editingCell.sectionIndex === sectionIndex &&
                          editingCell.itemIndex === itemIndex &&
                          editingCell.type === "qty" ? (
                            <input
                              ref={(el) => {
                                if (!qtyInputRefs.current[sectionIndex]) {
                                  qtyInputRefs.current[sectionIndex] = {};
                                }
                                qtyInputRefs.current[sectionIndex][itemIndex] =
                                  el;
                              }}
                              type="text"
                              className="w-16 p-1 border rounded text-right"
                              value={
                                item.qtyDisplay !== undefined
                                  ? item.qtyDisplay
                                  : item.qty
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                if (
                                  value === "" ||
                                  /^[0-9]*\.?[0-9]*$/.test(value)
                                ) {
                                  handleQuantityChange(
                                    sectionIndex,
                                    itemIndex,
                                    value
                                  );
                                }
                              }}
                              onBlur={(e) => {
                                if (e.target.value === "") {
                                  handleQuantityChange(
                                    sectionIndex,
                                    itemIndex,
                                    "0"
                                  );
                                }
                                stopEditing();
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.target.blur();
                                }
                              }}
                            />
                          ) : (
                            item.qty
                          )}
                        </td>
                        <td
                          className="p-3 text-sm text-gray-700 text-right cursor-pointer"
                          onClick={() =>
                            startEditing(sectionIndex, itemIndex, "unitCost")
                          }
                        >
                          {editingCell &&
                          editingCell.sectionIndex === sectionIndex &&
                          editingCell.itemIndex === itemIndex &&
                          editingCell.type === "unitCost" ? (
                            <input
                              ref={(el) => {
                                if (!unitCostInputRefs.current[sectionIndex]) {
                                  unitCostInputRefs.current[sectionIndex] = {};
                                }
                                unitCostInputRefs.current[sectionIndex][
                                  itemIndex
                                ] = el;
                              }}
                              type="text"
                              className="w-24 p-1 border rounded text-right"
                              value={
                                item.unitCostDisplay !== undefined
                                  ? item.unitCostDisplay
                                  : formatRawNumber(item.unit_cost)
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                if (
                                  value === "" ||
                                  /^[0-9]*\.?[0-9]*$/.test(value)
                                ) {
                                  handleUnitCostChange(
                                    sectionIndex,
                                    itemIndex,
                                    value
                                  );
                                }
                              }}
                              onBlur={(e) => {
                                if (e.target.value === "") {
                                  handleUnitCostChange(
                                    sectionIndex,
                                    itemIndex,
                                    "0"
                                  );
                                }
                                stopEditing();
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.target.blur();
                                }
                              }}
                            />
                          ) : (
                            `$${formatRawNumber(item.unit_cost)}`
                          )}
                        </td>
                        <td className="p-3 text-sm text-gray-700 text-center">
                          {item.unit || "EA"}
                        </td>
                        <td className="p-3 text-sm font-medium text-right">
                          {formatCurrency(item.total)}
                        </td>
                        <td className="p-3 text-center">
                          {item.tax ? (
                            <span className="text-green-600 font-bold">✓</span>
                          ) : (
                            <span className="text-gray-300">✓</span>
                          )}
                        </td>
                        <td className="p-3 text-sm text-gray-700">
                          {item.cost_code || ""}
                        </td>
                        <td className="p-3 text-center">
                          <button className="text-green-600 hover:text-green-800 focus:outline-none">
                            <FaEye className="w-4 h-4 cursor-pointer" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center p-4 text-gray-500">
                        No items found in this section.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
    </div>
  );
}
