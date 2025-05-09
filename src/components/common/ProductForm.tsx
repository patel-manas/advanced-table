import React, { useState, useEffect } from "react";
import { InventoryItem } from "../../types"; // or wherever your type is defined
import { useSelector } from "react-redux";
import { selectAllCategories } from "../../redux/selectors/inventory-selectors";

type ProductFormProps = {
  initialData?: InventoryItem;
  onSubmit: (data: Omit<InventoryItem, "id">) => void;
  onCancel: () => void;
};

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formState, setFormState] = useState<Omit<InventoryItem, "id">>({
    name: "",
    category: "",
    price: 0,
    quantityInStock: 0,
  });
  const allCategories = useSelector(selectAllCategories);

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData;
      setFormState(rest);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormState((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantityInStock" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formState);
  };

  const handleSlelctChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {value} = e.target;
    setFormState(prev => ({
      ...prev, category: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Name</label>
        <input
          name="name"
          type="text"
          value={formState.name}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Category</label>
        <select onChange={handleSlelctChange}>
          {
            allCategories.map(cat => (<option value={cat}>{cat}</option>))
          }
          </select>
      </div>

      <div>
        <label className="block font-medium">Price</label>
        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={formState.price}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Quantity in Stock</label>
        <input
          name="quantityInStock"
          type="number"
          min="0"
          value={formState.quantityInStock}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {initialData ? "Update Product" : "Add Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
