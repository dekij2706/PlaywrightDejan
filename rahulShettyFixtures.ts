//Importing various page classes from their respective files.
//These page classes represent different pages of the RahulShetty website.
import { test as base } from "@playwright/test";
import { HomePage } from "./pages/RahulShetty/homePage";
import { CartPage } from "./pages/RahulShetty/cartPage";
import { CheckoutPage } from "./pages/RahulShetty/checkoutPage";
import { CountryPage } from "./pages/RahulShetty/countryPage";

/* A type declaration named rahulShettyFixtures is defined to represent the fixtures available for the
 "RahulShetty" website.It specifies the properties of the fixtures object, with each property 
 representing a specific page class.*/
type rahulShettyFixtures = {
  homePage: HomePage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  countryPage: CountryPage;
};

//Fixture Declarations
//The test function is extended using the base.extend method.
//Inside the extend function, fixtures are defined for each page.
//Each fixture is an asynchronous function that takes two parameters: { page } and use.
//Within each fixture, a new instance of the corresponding page class is created, passing the page object as a parameter.
//The use function is called with the created page instance, making the fixture available for use in the tests.
export const test = base.extend<rahulShettyFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },
  countryPage: async ({ page }, use) => {
    const coutryPage = new CountryPage(page);
    await use(coutryPage);
  },
});
//Export Statements
//The expect function is also exported from the @playwright/test library to allow for assertions in the tests.
export { expect } from "@playwright/test";
