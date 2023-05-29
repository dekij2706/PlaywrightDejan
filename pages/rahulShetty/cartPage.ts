import { Locator, Page, expect } from "@playwright/test";

export class CartPage {
  constructor(private page: Page) {}

  newLocator(): Locator {
    return this.page.locator("");
  }
  async placeOrder(): Promise<void> {
    const placeOrderButton = await this.page.waitForSelector("button:has-text('Place Order')");
    await placeOrderButton.click();

    // Expected result: Assert that the user is redirected to the next page
    await this.page.waitForURL("https://rahulshettyacademy.com/seleniumPractise/#/country");

    // Expected result: Assert the presence of the Choose Country drop-down and Terms & Conditions checkbox
    const chooseCountryLabel = await this.page.waitForSelector("label:has-text('Choose Country')");
    expect(chooseCountryLabel).toBeTruthy();

    const termsCheckbox = await this.page.waitForSelector(".chkAgree");
    expect(termsCheckbox).toBeTruthy();
  }
}
