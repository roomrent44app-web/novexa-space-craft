/// <reference types="vite/client" />

declare module "*?format=avif&width=*&quality=*" {
  const src: string;
  export default src;
}

declare module "*?format=webp&width=*&quality=*" {
  const src: string;
  export default src;
}

declare module "*?format=avif&width=*&height=*&fit=cover&quality=*" {
  const src: string;
  export default src;
}

declare module "*?format=webp&width=*&height=*&fit=cover&quality=*" {
  const src: string;
  export default src;
}
