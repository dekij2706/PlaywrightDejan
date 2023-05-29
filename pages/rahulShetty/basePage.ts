//basePage.ts serves as a base class for page objects, providing common methods and properties
//specific to page interactions.

import { Page } from "@playwright/test";

//Class Declaration:

export class BasePage {
  constructor(public page: Page) {}

  /*uses page.evaluate to select an input field specified by the provided selector 
  and sets its value to an empty string, effectively clearing its content*/
  clearField(selector: string) {
    return this.page.evaluate((selector) => {
      (document.querySelector(selector) as any).value = "";
    }, selector);
  }
}
