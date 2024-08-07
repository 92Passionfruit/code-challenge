import { render, screen } from "@testing-library/react";
import Products from "../pages/Store";
import productsData from "../assets/products.json";

describe("Products Component", () => {
  test("loads a list of products from products.json", async () => {
    render(<Products />);

    // Correct number of products are loaded
    const productItems = await screen.findAllByRole("listitem");
    expect(productItems).toHaveLength(productsData.length);

    // Each product's details (uuid, name, price) are present in document
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
