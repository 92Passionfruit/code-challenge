import productsData from "../assets/products.json";

const Products = () => {
  const displayedProducts = productsData.slice(0, 24);

  if (displayedProducts.length === 0) {
    return <div>No products available</div>;
  }

  return (
    <ul>
      {displayedProducts.map((item) => (
        <li key={item.uuid} role="listitem">
          <div>{item.name ? item.name : "Unnamed Product"}</div>
          <div>{item.price ? `$${item.price}` : "Price not available"}</div>
        </li>
      ))}
    </ul>
  );
};

export default Products;
