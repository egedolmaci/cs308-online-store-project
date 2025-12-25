import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Filter from "./Filter";

const baseProps = {
  categories: ["All", "Shirts"],
  selectedCategory: "All",
  sortBy: "name",
  sortedProducts: [{ id: 1 }, { id: 2 }],
};

describe("Filter component", () => {
  it("updates search and clears with the clear button", async () => {
    const setSearchQuery = vi.fn();
    const props = {
      ...baseProps,
      searchQuery: "hat",
      setSearchQuery,
      setSelectedCategory: vi.fn(),
      setSortBy: vi.fn(),
    };

    const { container } = render(<Filter {...props} />);

    const input = screen.getByPlaceholderText(
      /search products, categories, or models/i,
    );

    await userEvent.type(input, "s");
    expect(setSearchQuery).toHaveBeenCalled();

    const clearBtn = input.parentElement?.querySelector("button");
    expect(clearBtn).toBeTruthy();
    await userEvent.click(clearBtn);
    expect(setSearchQuery).toHaveBeenCalledWith("");
  });

  it("changes category and sort selection", () => {
    const setSelectedCategory = vi.fn();
    const setSortBy = vi.fn();

    render(
      <Filter
        {...baseProps}
        searchQuery=""
        setSearchQuery={vi.fn()}
        setSelectedCategory={setSelectedCategory}
        setSortBy={setSortBy}
      />,
    );

    fireEvent.click(screen.getByText("Shirts"));
    expect(setSelectedCategory).toHaveBeenCalledWith("Shirts");

    fireEvent.change(screen.getByDisplayValue("Name A-Z"), {
      target: { value: "price-high" },
    });
    expect(setSortBy).toHaveBeenCalledWith("price-high");

    expect(screen.getAllByText("2").length).toBeGreaterThan(0);
  });
});
