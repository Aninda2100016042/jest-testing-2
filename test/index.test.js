// ! Dont change this code
const {
  fetchProductsData,
  setProductsCards,
  convertToRupiah,
  countDiscount,
} = require("../src/index.js");
const cartData = require("../src/data/cart.js");

// @ Write your code here

// Asyncronous Testing
// https://jestjs.io/docs/asynchronous
describe("Product API Testing", () => {
  // Test Case 1
  test("should return product data with id 1", async () => {
    const productData = await fetchProductsData(1);
    expect(productData).toBeDefined();
    expect(productData.id).toBe(1);
  });

  // Test Case 2
  test("should check products.length with limit", async () => {
    const limit = 10;
    const { products, total } = await fetchProductsData();
    expect(Array.isArray(products)).toBe(true);
    const slicedProducts = products.slice(0, limit);
    expect(slicedProducts.length).toBeLessThanOrEqual(limit);
    expect(slicedProducts.length).toBeLessThanOrEqual(total);
  });

  // Test Case 3
  test("should apply discount correctly", async () => {
    const originalPrice = 100;
    const discountPercentage = 20;
    const discountedPrice = await calculateDiscountAsync(originalPrice, discountPercentage);
    expect(discountedPrice).toBe(80);
  });
  async function calculateDiscountAsync(originalPrice, discountPercentage) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const discountedPrice = countDiscount(originalPrice, discountPercentage);
        resolve(discountedPrice);
      }, 1000);
    });
  }
});

// Mocking
// https://jestjs.io/docs/mock-functions
const { fetchCartsData } = require('../src/dataService');

jest.mock('../src/dataService', () => {
  const originalModule = jest.requireActual('../src/dataService');
  return {
    ...originalModule,
    __esModule: true,
    fetchCartsData: jest.fn(),
  };
});

describe('Cart API Testing', () => {
  test('should compare total cart items with length of fetched data', async () => {
    fetchCartsData.mockResolvedValue(cartData.carts);
    const cartsData = await fetchCartsData();
    const totalItems = cartsData.length;
    const expectedTotal = cartData.carts.length;
    expect(totalItems).toBe(expectedTotal);
  });
  test('should confirm that total items in the cart are greater than zero', async () => {
    const mockData = [{ id: 1, productId: 1, quantity: 1 }];
    fetchCartsData.mockResolvedValue(mockData);
    const cartsData = await fetchCartsData();
    const totalItems = cartsData.reduce((acc, cart) => acc + cart.quantity, 0);
    expect(totalItems).toBeGreaterThan(0);
  });
  test('should confirm that total products in the cart are equal to the length of fetched data', async () => {
    fetchCartsData.mockResolvedValue(cartData.carts);
    const cartsData = await fetchCartsData();
    const totalProducts = cartsData.length;
    const expectedTotal = cartData.carts.length;
    expect(totalProducts).toBe(expectedTotal);
  });
});

// Setup & Teardown
// https://jestjs.io/docs/setup-teardown
let productData; // Variabel untuk menyimpan data product dari API
// Setup
beforeAll(async () => {
  // Mock implementation of fetching data from API
  const mockAPIResponse = [{ id: 1, price: 1000 }]; // Replace with your mock data
  productData = mockAPIResponse;
});
afterAll(() => {
  productData = null;
});
describe('Product Utility Testing', () => {
  describe("convertToRupiah", () => {
    test('should convert price to Rupiah correctly', () => {
      const price = productData[0].price;
      const result = convertToRupiah(price);
      expect(result).toEqual(new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(price * 15436));
  });
    test('should handle zero price correctly', () => {
      const result = convertToRupiah(0);
      expect(result).toEqual(new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(0));
  });
    test('should handle negative price correctly', () => {
      const result = convertToRupiah(-1000);
      expect(result).toEqual(`-${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(1000 * 15436)}`);
  });
  describe("countDiscount", () => {
    test('should calculate discount correctly', () => {
      const price = productData[0].price;
      const discountPercentage = productData[0].discountPercentage;
      const result = countDiscount(price, discountPercentage);
      expect(result).toEqual(price - (price * (discountPercentage / 100)));
    });
    test('should handle zero discount correctly', () => {
      const price = productData[0].price;
      const result = countDiscount(price, 0);
      expect(result).toEqual(price);
    });
  describe("setProductsCards", () => {
    test("should handle an empty array", () => {
      const emptyProducts = [];
      const result = setProductsCards(emptyProducts);
      expect(result).toEqual([]);
      }); 
      test("should have expected keys in the first product", () => {
        const product = setProductsCards([{ id: 1, title: 'Product X', price: 200, discountPercentage: 10, thumbnail: 'url_image_x' }]);
        const expectedKeys = ['price', 'after_discount', 'image'];
        expect(product[0]).toEqual(expect.objectContaining({
          ...expectedKeys.reduce((acc, key) => ({ ...acc, [key]: expect.anything() }), {}),
        }));
      });
    });
      });
    });  
});