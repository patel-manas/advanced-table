import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { InventoryItem } from '../../types';

const selectInventoryState = (state: RootState) => state.inventory;

export const selectFilteredSortedProducts = createSelector(
  [selectInventoryState],
  (inventory) => {
    const { products, filters, sortBy, sortDirection, inStockOnly } = inventory;
    console.log("inStockOnly", inStockOnly)

    let result = [...products];

    // Filtering
    result = result.filter(product =>
      Object.entries(filters).every(([key, values]) => {
        const filterMatches = values.some(value =>
          product[key as keyof InventoryItem].toString().toLowerCase().includes(value.toLowerCase())
        );
        return filterMatches;
      })
    );

    // stock check filter
    result = result.filter(product => {
      if (inStockOnly) {
        return product.quantityInStock > 0;
      }
      return true;
    });

    // Sorting
    if (sortBy) {
      result.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }
        return sortDirection === 'asc'
          ? aVal.toString().localeCompare(bVal.toString())
          : bVal.toString().localeCompare(aVal.toString());
      });
    }

    return result;
  }
);

export const selectPaginatedProducts = createSelector(
  [selectFilteredSortedProducts, selectInventoryState],
  (products, inventory) => {
    const { currentPage, itemsPerPage } = inventory;
    const start = (currentPage - 1) * itemsPerPage;
    return products.slice(start, start + itemsPerPage);
  }
);

export const selectTotalPages = createSelector(
  [selectFilteredSortedProducts, selectInventoryState],
  (filtered, { itemsPerPage }) => Math.ceil(filtered.length / itemsPerPage)
);

export const selectCurrentPage = createSelector(
  [selectInventoryState],
  (inventory) => inventory.currentPage
)

export const selectAllCategories = createSelector(
  [selectInventoryState],
  (inventory) => {
    const categories = new Set<string>();
    inventory.products.forEach(product => categories.add(product.category));
    return Array.from(categories);
  }
)