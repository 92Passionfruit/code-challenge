// src/_tests_/Products.spec.tsx
import { render, screen } from "@testing-library/react";
import Products from "../pages/Store";
import productsData from "../assets/products.json";

describe("Products Component", () => {
  test("loads a list of products from products.json", async () => {
    render(<Products />);

    // Correct number of products are loaded
    const productItems = await screen.findAllByRole("listitem");
    expect(productItems).toHaveLength(productsData.length);

    // Each product's details (uuid, name, price) are present in the document
    productsData.forEach(async (product) => {
      expect(
        await screen.findByText(product.uuid.toString())
      ).toBeInTheDocument();
      expect(await screen.findByText(product.name)).toBeInTheDocument();
      expect(await screen.findByText(product.price)).toBeInTheDocument();
    });
  });

  test("lists product details (name and price) to the user", async () => {
    render(<Products />);

    // Correct number of products are displayed
    const productItems = await screen.findAllByRole("listitem");
    expect(productItems).toHaveLength(productsData.length);

    // Each product's name and price are displayed
    productsData.forEach(async (product) => {
      expect(await screen.findByText(product.name)).toBeVisible();
      expect(await screen.findByText(product.price)).toBeVisible();
    });
  });
});

// Edge Case: Empty Product List
jest.mock("../assets/products.json", () => []);

describe("Products Component - Edge Cases", () => {
  test("displays a message when there are no products", async () => {
    render(<Products />);

    const productItems = screen.queryAllByRole("listitem");
    expect(productItems).toHaveLength(0);

    expect(screen.getByText("No products available")).toBeInTheDocument();
  });
});

// Restore the mock for the other tests
jest.unmock("../assets/products.json");

// Edge Case: Missing Product Details
jest.mock("../assets/products.json", () => [
  {
    uuid: 1411,
    name: "Jockey Wheels - Orange",
    price: "15.39",
  },
  {
    uuid: 23881,
    name: "", // Missing name
    price: "65.95",
  },
  {
    uuid: 13008,
    name: "Carbon Brake Pads",
    price: "", // Missing price
  },
]);

describe("Products Component - Edge Cases", () => {
  test("handles products with missing details", async () => {
    render(<Products />);

    // Handling missing name
    expect(await screen.findByText("Unnamed Product")).toBeInTheDocument();
    expect(await screen.findByText("65.95")).toBeInTheDocument();

    // Handling missing price
    expect(await screen.findByText("Carbon Brake Pads")).toBeInTheDocument();
    expect(await screen.findByText("Price not available")).toBeInTheDocument();
  });
});

// Edge Case: Product List is Overlarge
jest.mock("../assets/products.json", () => {
  const products = [];
  for (let i = 0; i < 1000; i++) {
    products.push({
      uuid: i,
      name: `Product ${i}`,
      price: `${i}.00`,
    });
  }
  return products;
});

describe("Products Component - Edge Cases", () => {
  test("displays only the first 24 products when the list is too long", async () => {
    render(<Products />);

    // Only 24 items are rendered
    const productItems = await screen.findAllByRole("listitem");
    expect(productItems).toHaveLength(24);

    // 25th item is not displayed
    expect(screen.queryByText("Product 24")).not.toBeInTheDocument();
  });
});
