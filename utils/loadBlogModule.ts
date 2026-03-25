export type BlogModule = typeof import('./blog');

let blogModulePromise: Promise<BlogModule> | null = null;

export const loadBlogModule = (): Promise<BlogModule> => {
  if (!blogModulePromise) {
    blogModulePromise = import('./blog');
  }

  return blogModulePromise;
};
