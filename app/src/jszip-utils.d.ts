declare module "jszip-utils" {
  function getBinaryContent(
    path: string,
    callback: (error: any, data: ArrayBuffer | null) => void
  ): void;

  export = getBinaryContent;
}
  
