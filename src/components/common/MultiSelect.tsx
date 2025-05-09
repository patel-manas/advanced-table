import { useState, useRef, useEffect } from "react";

import {
    setFilter
} from '../../redux/slices/inventory-slice';
import { useDispatch, useSelector } from "react-redux";

import { selectAllCategories } from '../../redux/selectors/inventory-selectors';

import { InventoryItem } from '../../types';
import { RootState } from "../../redux/store";

interface MultiSelectDropdownProps {
    field: keyof InventoryItem,
    placeholder?: string;
    selectedOption?: keyof InventoryItem | ''
}



export default function MultiSelectDropdown({
    field,
    placeholder = "Select options",
    selectedOption = ''
}: MultiSelectDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const allCategories = useSelector(selectAllCategories);
    const dispatch = useDispatch();
    const {
        filters
      } = useSelector((state: RootState) => state.inventory);

    const selected = filters[field] || [];

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
        dispatch(setFilter({ field, value, checked: e.target.checked }))
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLabels = allCategories
        .filter((opt) => selected.includes(opt))
        .map((opt) => opt)
        .join(", ");

    return (
        <div className="relative w-64" ref={dropdownRef}>
            <button
                type="button"
                onClick={toggleDropdown}
                className="w-full text-left bg-white border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {selected.length > 0 ? selectedLabels : placeholder}
            </button>

            {isOpen && (
                <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                    {allCategories.map((option) => (
                        <label
                            key={option}
                            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={selected.includes(option) || option === selectedOption}
                                onChange={(e) => handleSelect(e, option)}
                                className="mr-2"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}
