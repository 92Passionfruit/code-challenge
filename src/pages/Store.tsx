import productsData from "../assets/products.json";

const Products = () => {
  return (
    <ul>
      {productsData.map((item) => (
        <li key={item.uuid} role="listitem">
          <div>{item.name}</div>
          <div>${item.price}</div>
        </li>
      ))}
    </ul>
  );
};

export default Products;
