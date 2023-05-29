import { Page, Locator, expect } from "@playwright/test";

// The constructor initializes the HomePage class with a private 'page' property of type 'Page'.
export class HomePage {
  constructor(private page: Page) {}

  goto() {
    return this.page.goto("https://rahulshettyacademy.com/seleniumPractise/#/");
  }

  async maximizeBrowser() {
    await this.page.setViewportSize({ width: 1600, height: 1200 });
  }

  chartIcon(): Locator {
    return this.page.locator(".cart-icon > img");
  }

  async assertPageTitle(expectedTitle: string): Promise<void> {
    const pageTitle = await this.page.title();
    expect(pageTitle).toBe(expectedTitle);
  }

  /**
   * Finds the cheapest item on the page and adds it to the cart.
   * @param {string} productPriceSelector - CSS selector for selecting all product prices on the page.
   * @param {string} addToCartButtonSelector - CSS selector for selecting all add-to-cart buttons.
   * @returns {Promise<void>} - A promise that resolves when item is added to the cart.
   */

  async findCheapestItemAndAddToCart(productPriceSelector: string, addToCartButtonSelector: string): Promise<void> {
    // Retrieve all product prices on the page
    const productPrices = await this.page.$$eval(productPriceSelector, (elements) =>
      elements.map((element) => parseFloat(element.textContent?.replace("$", "") || "0"))
    );

    // Find the index of the cheapest item
    let cheapestIndex = 0;
    let cheapestPrice = productPrices[0];
    for (let i = 1; i < productPrices.length; i++) {
      if (productPrices[i] < cheapestPrice) {
        cheapestIndex = i;
        cheapestPrice = productPrices[i];
      }
    }

    // Click the add-to-cart button of the cheapest item
    const addToCartButtons = await this.page.$$(addToCartButtonSelector);
    await addToCartButtons[cheapestIndex].click();
  }

  async findMostExpensiveItemAndAddToCart(productPriceSelector: string, addToCartButtonSelector: string): Promise<void> {
    // Retrieve all product prices on the page
    const productPrices = await this.page.$$eval(productPriceSelector, (elements) =>
      elements.map((element) => parseFloat(element.textContent?.replace("$", "") || "0"))
    );

    // Find the index of the most expensive item
    let expensiveIndex = 0;
    let expensivePrice = productPrices[0];
    for (let i = 1; i < productPrices.length; i++) {
      if (productPrices[i] > expensivePrice) {
        expensiveIndex = i;
        expensivePrice = productPrices[i];
      }
    }

    // Click the add-to-cart button of the most expensive item
    const addToCartButtons = await this.page.$$(addToCartButtonSelector);
    await addToCartButtons[expensiveIndex].click();
  }

  async findRandomItemExcludingMinMax(productPriceSelector: string, addToCartButtonSelector: string): Promise<void> {
    // Retrieve all product prices on the page
    const productPrices = await this.page.$$eval(productPriceSelector, (elements) =>
      elements.map((element) => parseFloat(element.textContent?.replace("$", "") || "0"))
    );

    // Find the index of the cheapest and most expensive items
    let minIndex = 0;
    let maxIndex = 0;
    let minPrice = productPrices[0];
    let maxPrice = productPrices[0];

    //iterates over the productPrices array to find the item with the minimum price.
    //It compares each price with the current minimum price and updates the minimum index and price if a lower price is found.
    for (let i = 1; i < productPrices.length; i++) {
      if (productPrices[i] < minPrice) {
        minIndex = i;
        minPrice = productPrices[i];
      }

      if (productPrices[i] > maxPrice) {
        maxIndex = i;
        maxPrice = productPrices[i];
      }
    }

    // Generate a list of indices excluding the cheapest and most expensive indices
    const availableIndices = productPrices.map((_, index) => index).filter((index) => index !== minIndex && index !== maxIndex);

    // Select a random index from the available indices
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];

    // Click the add-to-cart button of the randomly selected item
    const addToCartButtons = await this.page.$$(addToCartButtonSelector);
    await addToCartButtons[randomIndex].click();
  }
}
