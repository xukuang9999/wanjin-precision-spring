export type ProductModule = typeof import('../data/products');

let productModulePromise: Promise<ProductModule> | null = null;

export const loadProductModule = (): Promise<ProductModule> => {
  if (!productModulePromise) {
    productModulePromise = import('../data/products');
  }

  return productModulePromise;
};
