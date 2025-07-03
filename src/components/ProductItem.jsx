// ProductItem.js
import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price, finalPrice, stock }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link
      to={`/product/${id}`}
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg rounded-lg"
    >
      <div className="aspect-square overflow-hidden bg-gray-50">
        <img
          src={Array.isArray(image) ? image[0] : image || "/placeholder.jpg"}
          alt={name}
          onError={(e) => (e.target.src = "/placeholder.jpg")}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Out of Stock Badge */}
        {stock === 0 && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
            Out of Stock
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
          {name}
        </h3>
        <p className="text-sm text-amber-700">
  {currency}{" "}
  {finalPrice < price ? (
    <>
      <span className="line-through text-gray-400 mr-2">{price.toLocaleString()}</span>
      <span>{finalPrice.toLocaleString()}</span>
    </>
  ) : (
    price.toLocaleString()
  )}
</p>
      </div>

      {/* Quick view overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <span className="text-white bg-amber-700 px-4 py-2 rounded-full text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          View Details
        </span>
      </div>
    </Link>
  );
};

export default ProductItem;
