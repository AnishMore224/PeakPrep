declare module 'latex.js' {
  interface LatexOptions {
    documentClass?: string;
    packages?: string[];
  }
  
  export function compile(source: string, options?: LatexOptions): {
    buffer: ArrayBuffer;
  };
}