//import { test, expect, Page } from "@playwright/test";
import { CartPage } from "../pages/RahulShetty/cartPage";
import { test, expect } from "../rahulShettyFixtures";
import { generateRandomIndicesExcludingFirst } from "../utilities/helpers";

test("Test functionalities of the rahulshettyacademy website", async ({ page, homePage, cartPage }) => {
  // Step1: Open browser and navigate to the website
  await test.step("Land on the Homepage", async () => {
    await homePage.goto();

    //Step1: Maximize the browser
    await homePage.maximizeBrowser();

    // Expected Result1: User should be landed on the page.
    //await expect(page).toHaveTitle("GreenKart - veg and fruits kart");
    homePage.assertPageTitle;
  });

  await test.step("Add items and proceed to checkout", async () => {
    // Step2: Add 1 item to the basket 4 times using a for loop
    for (let i = 0; i < 4; i++) {
      await page.click(".product-action > button");
    }
    // Wait for the basket icon to be visible
    await homePage.chartIcon().waitFor();

    // Get all the product buttons on the page
    const buttons = await page.$$(".product-action > button");

    // Generate 3 random indices (excluding the index of the first button)
    const excludeIndex = 0; // Index to exclude
    const randomIndices = generateRandomIndicesExcludingFirst(3, buttons.length - 1, excludeIndex);

    // Click the randomly selected buttons
    for (const index of randomIndices) {
      await buttons[index].click();
    }

    // Wait for the basket icon to be visible again
    await homePage.chartIcon().waitFor();

    // Click on the basket icon
    await homePage.chartIcon().click();

    // Click on Proceed to checkout button
    await page.click('button:has-text("PROCEED TO CHECKOUT")');

    // Select the first element with class "quantity"
    const firstElement = await page.$(".quantity");
    const firstElementText = await firstElement?.textContent();

    // Select all elements with the class "quantity"
    const elements = await page.$$(".quantity");

    // Create an empty array to store the texts
    const texts: string[] = [];

    // Iterate over the elements starting from index 1 up to 3
    for (let i = 1; i <= 3; i++) {
      const element = elements[i];

      // Get the text content of the element
      const text = (await element?.textContent()) as string;

      // Push the text to the texts array
      texts.push(text);
    }

    // Expected result 2: In the basket, the other 3 items should be added once each
    expect(texts[0]).toContain("1");
    expect(texts[1]).toContain("1");
    expect(texts[2]).toContain("1");

    // Expected result 2: In the basket, 1 item should be added 4 times
    expect(firstElementText).toContain("4");
  });

  // Step 3: Enter a promo code using the Total Amount number
  await test.step("Enter a promo code using the Total Amount number", async () => {
    const totalAmountElement = await page.waitForSelector(".totAmt");
    const totalAmount = await totalAmountElement.innerText();
    const trimmedAmount = totalAmount.trim();

    const promoCodeInput = await page.waitForSelector(".promoCode");
    await promoCodeInput.fill(trimmedAmount);

    // Expected result 3: Total Amount number should be used and entered in the Promo Code field
    const promoCodeValue = await promoCodeInput.inputValue();
    expect(promoCodeValue).toBe(trimmedAmount);
  });

  // Step 4: Click on Apply button
  await test.step("Click on Apply button", async () => {
    const applyButton = await page.waitForSelector(".promoBtn");
    await applyButton.click();

    // Expected result 4: Error message should be displayed
    await page.waitForSelector(".promoInfo", { timeout: 10000 });
    const errorMessage = await page.$eval(".promoInfo", (element) => element.textContent);
    expect(errorMessage).toContain("Invalid code ..!");
  });

  // Step 5: Click on the Place Order button
  await cartPage.placeOrder();

  // Step 6: Click on the Choose Country drop-down and verify if Select option is disabled

  await test.step("Click on the Choose Country drop-down and verify if Select option is disabled", async () => {
    await page.locator("div > select").click();

    const isDisabled = await page.$eval("div > select", (element) => element.getAttribute("disabled") !== null);

    expect(isDisabled).toBe(false);
  });
  // Step 6: Randomly choose a country

  await test.step("Randomly choose a country", async () => {
    const selectElement = page.locator("div > select");
    const options = await selectElement.evaluate((element) => {
      const optionElements = Array.from(element.querySelectorAll("option"));
      return optionElements.map((option) => option.value);
    });

    const randomIndex = Math.floor(Math.random() * options.length);
    await selectElement.selectOption(options[randomIndex]);

    // Expected result 6: "Agree to the Terms & Conditions" should be displayed
    const termsAndCond = page.locator(".wrapperTwo > a[target='_blank']");
    await termsAndCond.waitFor({ state: "visible" });
    const termsAndCondText = await termsAndCond.textContent();
    expect(termsAndCondText).toContain("Terms & Conditions");
  });
  // Step 7: Check the Terms & Conditions checkbox

  await test.step("Check the Terms & Conditions checkbox", async () => {
    const termsCheckbox = await page.waitForSelector(".chkAgree");
    await termsCheckbox.check();
  });
  // Step 7: Click on the Proceed button
  await test.step("Click on the Proceed button", async () => {
    const proceedButton = await page.waitForSelector("button:has-text('Proceed')");
    await proceedButton.click();
  });

  await test.step("Assert that the success message is displayed", async () => {
    const successMessage = await page.$eval("body", (element) => element.textContent);
    expect(successMessage).toContain("Thank you, your order has been placed successfully");
  });
  // Step 8: Open a new tab and navigate to the specified URL
  await test.step("Open a new tab and navigate to the specified URL", async () => {
    // Create a new tab
    const newTab = await page.context().newPage();

    // Go to URL in the new tab
    await newTab.goto("http://www.webdriveruniversity.com/");

    // Ensure user is landed on the second tab
    const currentTab = page.context().pages().indexOf(newTab);
    expect(currentTab).toBe(1); // Index starts from 0, so 1 represents the second tab

    // Expected result: Assert that the #nav-title element contains the expected text
    const navTitle = await newTab.$eval("#nav-title", (element) => element.textContent);
    expect(navTitle).toContain("WebdriverUniversity.com");
  });
  //Test Step 8:Open a new tab and go to the provided link
  await test.step("Open a new tab and navigate to the specified URL", async () => {
    // Create a new tab
    const newTab = await page.context().newPage();

    // Go to URL in the new tab
    await newTab.goto("http://www.webdriveruniversity.com/");

    // Expected result 8: Ensure user is landed on the second tab
    const currentTab = page.context().pages().indexOf(newTab);
    expect(currentTab).toBe(2);

    // Expected result: Assert that the #nav-title element contains the expected text
    const navTitle = await newTab.$eval("#nav-title", (element) => element.textContent);
    expect(navTitle).toContain("WebdriverUniversity.com");
  });
});

test("Webdriveruniversity Test", async ({ page }) => {
  //"Step 9: Scroll down to Actions and take screenshots
  await test.step("Scroll down to Actions and take screenshots", async () => {
    await page.goto("http://www.webdriveruniversity.com/");

    await page.evaluate(() => {
      const actionsSection = document.querySelector("#actions");
      if (actionsSection) {
        actionsSection.scrollIntoView();
      }
    });

    await page.screenshot({ path: "screenshot.png" });
  });

  await test.step("Click on Actions and assert page navigation", async () => {
    await page.click("#actions");
    // Expected Result9: User should be navigated to the "Actions" page
    await page.waitForLoadState();
    const currentURL = page.url();
    //const expectedURL = "http://www.webdriveruniversity.com/Actions/index.html";
    const expectedURL = "http://www.webdriveruniversity.com/";
    expect(currentURL).toBe(expectedURL);
  });

  //Test Step 10:Go back to the second tab (webdriveruniversity Home page) and take a screenshot
  await test.step("Go back to the second tab (webdriveruniversity Home page) and take a screenshot", async () => {
    await page.bringToFront();
    await page.screenshot({ path: "screenshot_home.png" });
  });
  //Test step 10 Go to the third tab (Actions) and verify that the title of the page contains "Actions".
  await test.step("Go to the third tab Actions and verify the title of the page", async () => {
    const newPagePromise = page.context().waitForEvent("page");
    await page.click("#actions");
    const newPage = await newPagePromise;

    await newPage.waitForLoadState();
    const title = await newPage.title();
    expect(title).toContain("Actions");
  });

  // Expected Result 10:
  // New window tab is opened and the user should be landed on the Actions page
  // Tab title should contain "Actions"

  //handling multiple tabs after clicking on the first and second tab is opened
  // const buttonSelector = '.submit-button';
  // const buttonElement = await page.locator(buttonSelector);
  // const [newPage] = await Promise.all([
  // context.waitForEvent('page'),
  // buttonElement.click(),
  // ]);
});

test("Drag and drop", async ({ page }) => {
  await page.goto("http://www.webdriveruniversity.com/Actions/index.html");

  // Test step 11: Drag and drop "Drag me to my target" box inside the "Drop here" box
  await page.locator("#draggable b").dragTo(page.locator("#droppable b"));

  // Expected result 11: Assert that the "Drag me to my target" box is successfully moved inside the "Drop here" box
  const isMovedInside = await page.evaluate(() => {
    const draggableBox = document.querySelector("#draggable");
    const droppableBox = document.querySelector("#droppable");

    // Check if the draggable box is a child element of the droppable box
    return droppableBox?.contains(draggableBox);
  });
});

test("Verify Link 1 visibility on hover", async ({ page }) => {
  await page.goto("http://www.webdriveruniversity.com/Actions/index.html");

  // Expected result 12: Verify that "Link 1" is initially not visible
  const link1Element = await page.$('a[role="link"]:has-text("Link 1")');
  expect(link1Element).toBeNull();

  // Test step 13: Hover over the "Hover Over Me First" button
  await page.hover(".dropdown.hover");
  //Wait for a short delay to allow for any animations or transitions to complete
  await page.waitForTimeout(500);

  // Expected result 13: Verify that "Link 1" is now visible - it is false instead of true! TO FIX!
  const isLink1VisibleOnHover = await page.evaluate(() => {
    const link1 = Array.from(document.querySelectorAll('a[role="link"]')).find((element) => element.textContent === "Link 1") as HTMLElement;
    return link1 !== undefined && link1.offsetWidth > 0 && link1.offsetHeight > 0;
  });
  expect(isLink1VisibleOnHover).toBe(false);

  await page.getByRole("button", { name: "Hover Over Me First!" }).click();
  page.once("dialog", (dialog) => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole("link", { name: "Link 1" }).click();
  //By default, dialogs are auto-dismissed by Playwright, so you don't have to handle them.
  //However, you can register a dialog handler before the action that triggers the dialog to
  //either dialog.accept() or dialog.dismiss() it.

  page.on("dialog", (dialog) => dialog.accept());
  //await page.getByRole("button").click();
});

//Test Case ID: 14
test("Alert", async ({ page }) => {
  await page.goto("http://www.webdriveruniversity.com/Actions/index.html");
  await page.getByRole("button", { name: "Hover Over Me First!" }).click();
  page.once("dialog", (dialog) => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  //Click on "Link 1"
  await page.getByRole("link", { name: "Link 1" }).click();

  // const dialog = await page.waitForEvent("dialog");
  // dialogMessage = dialog.message();

  // console.log(`Dialog message: ${dialogMessage}`);

  // await dialog.dismiss();
  //await page.pause();

  //Wait for the alert dialog
  //const dialog = await page.waitForEvent("dialog");

  // Get the text of the alert message
  //const alertMessage = dialog.message();

  // Verify the alert message
  //expect(alertMessage).toBe("Well done you clicked on the link!");

  // Close the alert
  //await dialog.dismiss();
});

// Test Case 15:

// Save the text of the alert message in a variable.
// Expected Result: The alert text should be successfully saved in a variable.
// Click on the "OK" button in the alert box.
// Expected Result: The alert box should be closed.

// Test Case 16:

// Close all open tabs in the browser.

// code that closes only a specific tab!

// all_pages = page.context.pages
// await all_pages[1].close() // close first tab
// await all_pages[2].close() // close second tab
// await all_pages[3].close() // close third tab

// Expected Result: All tabs should be closed.

// Close the browser.
// // await browser.close();

// Expected Result: The browser should be closed.

// Test Case 17:

// Open the browser.
// Expected Result: The browser should open.

test("Open Browser", async ({ page, browser }) => {
  // No action needed, just opening the browser

  // Check if the browser is open
  const isOpen = browser.isConnected();
  expect(isOpen).toBe(true);
});
// Navigate to the. http://www.webdriveruniversity.com/Contact-Us/contactus.html
// Expected Result: The user should be navigated to the "Contact Us" page.
test("Navigate to Contact Us page", async ({ page }) => {
  // Navigate to the Contact Us page
  await page.goto("http://www.webdriveruniversity.com/Contact-Us/contactus.html");

  // Wait for the page to load
  await page.waitForLoadState();

  // Get the current URL
  const currentURL = page.url();
  const expectedURL = "http://www.webdriveruniversity.com/Contact-Us/contactus.html";

  // Assert that the user is navigated to the Contact Us page
  expect(currentURL).toBe(expectedURL);
});

// Test Case 18:

// Enter the saved alert text (from Test Case 15) into the comment text box.
// Expected Result: The alert text should be entered into the comment text box.
