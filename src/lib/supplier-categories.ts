export const SUPPLIER_CATEGORIES = [
  { value: "building_materials", label: "Building Materials" },
  { value: "hardware", label: "Hardware" },
  { value: "electrical", label: "Electrical" },
  { value: "plumbing", label: "Plumbing" },
  { value: "roofing", label: "Roofing" },
  { value: "concrete", label: "Concrete" },
  { value: "steel", label: "Steel" },
  { value: "timber", label: "Timber" },
  { value: "paint", label: "Paint" },
  { value: "aluminium", label: "Aluminium" },
  { value: "glass", label: "Glass" },
  { value: "solar_equipment", label: "Solar Equipment" },
  { value: "plant_hire", label: "Plant Hire" },
  { value: "tool_hire", label: "Tool Hire" },
  { value: "safety_equipment", label: "Safety Equipment" },
] as const;

export type SupplierCategoryValue = (typeof SUPPLIER_CATEGORIES)[number]["value"];

export function categoryLabel(value: string): string {
  return SUPPLIER_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}
