import { render, screen } from "@testing-library/react";
import Products from "../pages/Store";

describe("Products Component - Empty Product List", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.mock("../assets/products.json", () => []);
  });

  test("displays a message when there are no products", async () => {
    const Products = require("../pages/Store").default;
    render(<Products />);

    const productItems = screen.queryAllByRole("listitem");
    expect(productItems).toHaveLength(0);
    expect(screen.getByText("No products available")).toBeInTheDocument();
  });
});

// Edge Case: Missing Product Details

describe("Products Component - Missing Product Details", () => {
  beforeEach(() => {
    jest.resetModules();
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
  });

  test("handles products with missing details", async () => {
    const Products = require("../pages/Store").default;
    render(<Products />);

    // Handling missing name
    expect(await screen.findByText("Unnamed Product")).toBeInTheDocument();
    expect(await screen.findByText("$65.95")).toBeInTheDocument();

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

describe("Products Component - Overlarge Product List", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.mock("../assets/products.json", () => []);
  });

  test("displays only the first 24 products when the list is too long", async () => {
    const Products = require("../pages/Store").default;
    render(<Products />);

    // Only 24 items are rendered
    const productItems = await screen.findAllByRole("listitem");
    expect(productItems).toHaveLength(24);

    // 25th item is not displayed
    expect(screen.queryByText("Product 24")).not.toBeInTheDocument();
  });
});
