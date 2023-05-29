import { Locator, Page } from "@playwright/test";

export class CheckoutPage {
  constructor(private page: Page) {}

  newLocator(): Locator {
    return this.page.locator("");
  }
}
