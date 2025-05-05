import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryItem } from '../../types';

interface InventorySlice {
  products: InventoryItem[];
  selectedIds: Set<string>;
  filters: Partial<Record<keyof InventoryItem, string>>;
  sortBy: keyof InventoryItem | null;
  sortDirection: 'asc' | 'desc';
  currentPage: number;
  itemsPerPage: number;
}

const initialState: InventorySlice = {
  products: [],
  selectedIds: new Set(),
  filters: {},
  sortBy: null,
  sortDirection: 'asc',
  currentPage: 1,
  itemsPerPage: 10,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    initializeProducts: (state, action: PayloadAction<InventoryItem[]>) => {
      state.products = action.payload;
    },
    addProduct: (state, action: PayloadAction<InventoryItem>) => {
      state.products.push(action.payload);
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload);
      state.selectedIds.delete(action.payload);
    },
    deleteSelectedProducts: (state) => {
      state.products = state.products.filter(p => !state.selectedIds.has(p.id));
      state.selectedIds.clear();
    },
    toggleProductSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedIds.has(id)) {
        state.selectedIds.delete(id);
      } else {
        state.selectedIds.add(id);
      }
    },
    clearSelectedProducts: (state) => {
      state.selectedIds.clear();
    },
    setFilter: (
      state,
      action: PayloadAction<{ field: keyof InventoryItem; value: string }>
    ) => {
      const { field, value } = action.payload;
      if (value === '') {
        delete state.filters[field];
      } else {
        state.filters[field] = value;
      }
    },
    clearAllFilters: (state) => {
      state.filters = {};
    },
    setSort: (state, action: PayloadAction<{ field: keyof InventoryItem }>) => {
      const { field } = action.payload;
      if (state.sortBy === field) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortBy = field;
        state.sortDirection = 'asc';
        state.sortBy = field;
      }
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
    },
  },
});

export const {
  initializeProducts,
  addProduct,
  deleteProduct,
  deleteSelectedProducts,
  toggleProductSelection,
  clearSelectedProducts,
  setFilter,
  clearAllFilters,
  setSort,
  setPage,
  setItemsPerPage
} = inventorySlice.actions;

export default inventorySlice.reducer;
