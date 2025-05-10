// Fetch estimate data from the JSON file
export const fetchEstimateData = async () => {
  try {
    const response = await fetch("/data/React JS- Estimate_detail.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching estimate data:", error);
    throw error;
  }
};

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "$0.00";
  const value = parseFloat(amount) / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatRawNumber = (amount) => {
  if (amount === undefined || amount === null) return 0;
  return parseFloat(amount) / 100;
};

export const calculateItemTotal = (qty, unitCost) => {
  return parseFloat(qty || 0) * parseFloat(unitCost || 0);
};

export const calculateSectionTotal = (items) => {
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce((total, item) => {
    // Ensure we're working with a number
    const itemTotal = parseFloat(item.total) || 0;
    return total + itemTotal;
  }, 0);
};

export const calculateGrandTotal = (sections) => {
  if (!sections || !Array.isArray(sections)) return 0;

  return sections.reduce((total, section) => {
    if (section && section.items && Array.isArray(section.items)) {
      const sectionTotal = calculateSectionTotal(section.items);
      return total + sectionTotal;
    }
    return total;
  }, 0);
};

export const transformEstimateData = (apiData) => {
  if (!apiData || !apiData.data || !apiData.data.sections) {
    console.error("Invalid API data structure:", apiData);
    return null;
  }

  const transformedSections = apiData.data.sections.map((section) => {
    const transformedSection = {
      section_id:
        section.custom_section_id ||
        section.section_id ||
        `section-${Math.random().toString(36).substr(2, 9)}`,
      section_name: section.section_name || "Unnamed Section",
      description: section.description || "",
      items: [],
    };

    if (section.items && Array.isArray(section.items)) {
      transformedSection.items = section.items.map((item) => {
        const qty = parseFloat(item.quantity) || 0;
        const unitCost = parseFloat(item.unit_cost) || 0;
        const total = calculateItemTotal(qty, unitCost);

        return {
          item_id:
            item.item_id || `item-${Math.random().toString(36).substr(2, 9)}`,
          type: item.item_type_display_name || "",
          task_name: item.item_type_name || "",
          description: item.description || "",
          qty: qty,
          unit_cost: unitCost,
          unit: item.unit || "EA",
          total: total,
          tax: item.apply_global_tax === "1",
          cost_code: item.cost_code_name || "",
        };
      });
    }

    return transformedSection;
  });

  return {
    estimate_number: apiData.data.estimate_number || "N/A",
    sections: transformedSections,
  };
};
