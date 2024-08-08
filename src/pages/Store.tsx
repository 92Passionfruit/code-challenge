import React, { useState } from "react";
import productsData from "../assets/products.json";
import ShoppingCart from "../context/ShoppingCart";

interface Product {
  uuid: number;
  name: string;
  price: number;
}

const Store: React.FC = () => {
  // Add to shopping Cart
  const [cart, setCart] = useState<Product[]>([]); // state variable = cart (empty array, setCart function updates state

  //Add to cart function (cart state = all current cart items + new product)
  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  // limit displayed products to 24
  const displayedProducts = productsData.slice(0, 24);

  // handling empty product list
  if (displayedProducts.length === 0) {
    return <div>No products available</div>;
  }

  // Product rendering
  return (
    <div>
      <ul>
        {displayedProducts.map((item) => (
          <li key={item.uuid} role="listitem">
            <div>{item.name ? item.name : "Unnamed Product"}</div>
            <div>{item.price ? `$${item.price}` : "Price not available"}</div>
            <button
              data-testid={`add-to-cart-${item.uuid}`}
              onClick={() => addToCart(item)}
            >
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
      <ShoppingCart cart={cart} /> {/* Pass cart state to ShoppingCart.tsx */}
    </div>
  );
};

export default Store;
