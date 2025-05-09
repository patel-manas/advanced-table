// ProductModal.tsx
import React, { useRef, forwardRef, useImperativeHandle } from "react";
import ProductForm from "./ProductForm";
import { v4 as uuidv4 } from 'uuid';
import { InventoryItem } from "../../types";
import { useDispatch } from "react-redux";
import { addNewProduct, updateProduct } from "../../redux/slices/inventory-slice";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantityInStock: number;
}

export interface ProductModalHandle {
  open: (product?: Product) => void;
  close: () => void;
}

const ProductModal = forwardRef<ProductModalHandle, {}>((_, ref) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [product, setProduct] = React.useState<Product | null>(null);
  const dispatch = useDispatch();

  useImperativeHandle(ref, () => ({
    open: (product?: Product) => {
      setProduct(product ?? null);
      dialogRef.current?.showModal();
    },
    close: () => dialogRef.current?.close(),
  }));

  const addItem = (data: Omit<InventoryItem, "id">) => {
    console.log('data on add', data);
    const id = uuidv4();
    const item = {...data, id};
    dispatch(addNewProduct({item}));
  };

  const updateItem = (updatedItem: InventoryItem) => {
    console.log('data on updateItem', updatedItem);
    dispatch(updateProduct({item: updatedItem}))
  };

  return (
    <dialog
      ref={dialogRef}
      className="p-8 bg-white border border-gray-300 backdrop:backdrop-blur-sm fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <ProductForm
        initialData={product ?? undefined}
        onSubmit={(data) => {
          if (product) {
            updateItem({ ...product, ...data });
          } else {
            addItem(data);
          }
          dialogRef.current?.close();
        }}
        onCancel={() => dialogRef.current?.close()}
      />
      {/* {product && product?.id ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Product Details</h2>
          <p><strong>Name:</strong> {product.name}</p>
          <p><strong>Price:</strong> ${product.price}</p>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => dialogRef.current?.close()}
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          add case
        </div>
      )} */}
    </dialog>
  );
});

export default ProductModal;
