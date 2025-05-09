import { useEffect, useMemo, useRef } from 'react'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './redux/store';
import {
  initializeProducts,
  setSort,
  setPage,
  deleteSelectedProducts,
  toggleProductSelection,
  setInstockOnly
} from './redux/slices/inventory-slice';
import { generateInventoryData } from './utils/generate-data'
import { selectPaginatedProducts } from './redux/selectors/inventory-selectors';
import MultiSelectDropdown from './components/common/MultiSelect';
import ProductModal,{ ProductModalHandle } from './components/common/ProductModal';
import { InventoryItem } from './types';

function App() {
  const dispatch = useDispatch();
  const paginatedProducts = useSelector(selectPaginatedProducts);
  const modalRef = useRef<ProductModalHandle>(null);
  const {
    sortBy,
    sortDirection,
    currentPage,
    itemsPerPage,
    products,
    selectedIds,
    filters,
    lowInventoryLimit
  } = useSelector((state: RootState) => state.inventory);

  console.log("filters", filters)


  const generatedProducts = useMemo(() => {
    return generateInventoryData(500);
  }, []);

  useEffect(() => {
    dispatch(initializeProducts(generatedProducts));
  }, []);

  const handleSort = (field: keyof typeof products[0]) => {
    dispatch(setSort({ field }));
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handleDeleteSelected = () => {
    if (window.confirm('Delete selected products?')) {
      dispatch(deleteSelectedProducts());
    }
  };

  const handleCheckboxChange = (e:React.ChangeEvent<HTMLInputElement>, id: string) => {
    e.stopPropagation();
    dispatch(toggleProductSelection(id));
  };

  const handleStockOnlyChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setInstockOnly(evt.target.checked));
  };

  console.log("products", products)

  const handleRowClick = (product: InventoryItem) => {
    modalRef.current?.open(product);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Inventory Table</h1>
      <section className="flex flex-row justify-between py-4 items-center gap-4">
        <div className='py-4'>
          <MultiSelectDropdown
            field='category'
            placeholder="Choose category"
          />
        </div>
        <div className='flex flex-row justify-center items-center'>
          <input type='checkbox' id="stock" onChange={handleStockOnlyChange} />
          <label htmlFor="stock" className="ml-2">In Stock only</label>
        </div>
        <div className='ml-auto'>
          <button
            className="px-2 py-1 bg-blue-600 text-white rounded"
            onClick={() => modalRef.current?.open()}
          >
            Add Product
          </button>
          {selectedIds.size > 0 && (
            <button
              className="px-2 py-1 bg-red-600 text-white rounded"
              onClick={handleDeleteSelected}
            >
              Delete Selected ({selectedIds.size})
            </button>
          )}
        </div>
      </section>

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b cursor-pointer">Select</th>
            {['id', 'name', 'category', 'price', 'quantityInStock'].map((field) => (
              <th
                key={field}
                className="py-2 px-4 border-b cursor-pointer"
                onClick={() => handleSort(field as keyof typeof products[0])}
              >
                {field}{' '}
                <span>
                  {sortBy === field ? (
                    sortDirection === 'asc' ? '↑' : '↓'
                  ) : null}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.map((product) => (
            <tr
              key={product.id}
              className={`cursor-pointer ${product.quantityInStock <= lowInventoryLimit ? 'bg-red-100 hover:red-100' : 'hover:bg-gray-50' }`}
              onClick={() => handleRowClick(product)}
            >
              <td className="text-center py-2 px-4 border-b">
                <input
                  type="checkbox"
                  checked={selectedIds.has(product.id)}
                  onChange={(e) => handleCheckboxChange(e, product.id)}
                  onClick={(e) => e.stopPropagation()} 
                />
              </td>
              <td className="py-2 px-4 border-b">{product.id}</td>
              <td className="py-2 px-4 border-b">{product.name}</td>
              <td className="py-2 px-4 border-b">{product.category}</td>
              <td className="py-2 px-4 border-b">{product.price}</td>
              <td className="py-2 px-4 border-b">{product.quantityInStock}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {totalPages > 0 &&
          [...Array(totalPages)].map((_, idx) => {
            const pageNumber = idx + 1;
            const isNearCurrent = Math.abs(currentPage - pageNumber) <= 2;
            const isFirstOrLast = pageNumber === 1 || pageNumber === totalPages;

            if (totalPages <= 7 || isFirstOrLast || isNearCurrent) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-1 border rounded ${currentPage === pageNumber
                    ? 'bg-blue-500 text-white'
                    : ''
                    }`}
                >
                  {pageNumber}
                </button>
              );
            }

            if (pageNumber === currentPage - 3 || pageNumber === currentPage + 3) {
              return <span key={`ellipsis-${pageNumber}`}>...</span>
            }

            return null;
          })}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      <ProductModal ref={modalRef} />
    </div>
  );
}

export default App;

