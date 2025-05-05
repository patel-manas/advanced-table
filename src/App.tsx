import { useEffect, useMemo } from 'react'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './redux/store';
import { 
  initializeProducts, 
  setSort, 
  setPage, 
  deleteProduct, 
  deleteSelectedProducts, 
  toggleProductSelection 
} from './redux/slices/inventory-slice';
import { generateInventoryData } from './utils/generate-data'
import { selectPaginatedProducts } from './redux/selectors/inventory-selectors';

function App() {
  const dispatch = useDispatch();
  const paginatedProducts = useSelector(selectPaginatedProducts);
  const { sortBy, sortDirection, currentPage, itemsPerPage, products, selectedIds } = useSelector((state: RootState) => state.inventory);


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

  const handleDeleteSingle = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };
  
  const handleDeleteSelected = () => {
    if (window.confirm('Delete selected products?')) {
      dispatch(deleteSelectedProducts());
    }
  };

  const handleCheckboxChange = (id: string) => {
    dispatch(toggleProductSelection(id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Inventory Table</h1>
      {selectedIds.size > 0 && (
        <button
          className="mb-3 px-4 py-2 bg-red-600 text-white rounded"
          onClick={handleDeleteSelected}
        >
          Delete Selected ({selectedIds.size})
        </button>
      )}
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
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="text-center py-2 px-4 border-b">
                <input
                  type="checkbox"
                  checked={selectedIds.has(product.id)}
                  onChange={() => handleCheckboxChange(product.id)}
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
    </div>
  );
}

export default App;

