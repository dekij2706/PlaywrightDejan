import { Locator, Page, expect } from "@playwright/test";

export class CountryPage {
  constructor(private page: Page) {}

  newLocator(): Locator {
    return this.page.locator("");
  }

  async selectCountryAndVerifyTerms(): Promise<void> {
    await this.page.locator("div > select").click();

    const isDisabled = await this.page.$eval("div > select", (element) => element.getAttribute("disabled") !== null);
    expect(isDisabled).toBe(false);

    const selectElement = this.page.locator("div > select");
    const options = await selectElement.evaluate((element) => {
      const optionElements = Array.from(element.querySelectorAll("option"));
      return optionElements.map((option) => option.value);
    });

    const randomIndex = Math.floor(Math.random() * options.length);
    await selectElement.selectOption(options[randomIndex]);

    // Expected result: "Agree to the Terms & Conditions" should be displayed
    const termsAndCond = this.page.locator(".wrapperTwo > a[target='_blank']");
    await termsAndCond.waitFor({ state: "visible" });
    const termsAndCondText = await termsAndCond.textContent();
    expect(termsAndCondText).toContain("Terms & Conditions");
  }

  async checkTermsCheckboxAndProceed(): Promise<void> {
    const termsCheckbox = await this.page.waitForSelector(".chkAgree");
    await termsCheckbox.check();

    const proceedButton = await this.page.waitForSelector("button:has-text('Proceed')");
    await proceedButton.click();

    // Expected result: Assert that the success message is displayed
    const successMessage = await this.page.$eval("body", (element) => element.textContent);
    expect(successMessage).toContain("Thank you, your order has been placed successfully");
  }
}
