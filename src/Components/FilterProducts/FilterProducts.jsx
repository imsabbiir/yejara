"use client";

import React, { useEffect, useState } from "react";

const FilterProducts = ({ onFilter }) => {
  const [categories, setCategories] = useState();
  const [filters, setFilters] = useState({
    category: "",
    subcategory: "",
    priceMin: "",
    priceMax: "",
  });


  console.log("filters:",filters)
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onFilter(filters); // send filters to parent
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-6 w-full max-w-md mx-auto mt-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        Filter Products
      </h2>

      {/* Category Dropdown */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-1">
          Category
        </label>
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        >
          <option value="">All Categories</option>
          {categories?.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory Dropdown */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-1">
          Subcategory
        </label>
        <select
          name="subcategory"
          value={filters.subcategory}
          onChange={handleChange}
          className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        >
          <option value="">All Subcategories</option>
          {categories
            ?.find((c) => c.name === filters.category)
            ?.subcategories?.map((sub) => (
              <option key={sub.title} value={sub.title}>
                {sub.title}
              </option>
            ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="flex items-center space-x-2">
        <div className="w-1/2">
          <label className="block text-gray-700 dark:text-gray-300 mb-1">
            Min Price
          </label>
          <input
            type="number"
            name="priceMin"
            value={filters.priceMin}
            onChange={handleChange}
            className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="৳ Min"
          />
        </div>
        <div className="w-1/2">
          <label className="block text-gray-700 dark:text-gray-300 mb-1">
            Max Price
          </label>
          <input
            type="number"
            name="priceMax"
            value={filters.priceMax}
            onChange={handleChange}
            className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="৳ Max"
          />
        </div>
      </div>

      {/* Apply Button */}
      <div className="pt-4">
        <button
          onClick={handleApply}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-all"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterProducts;



