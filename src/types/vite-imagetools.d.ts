declare module "*&as=picture" {
  type AsPicture = {
    img: { src: string; w: number; h: number };
    sources: {
      avif?: string;
      webp?: string;
    };
  };
  const value: AsPicture;
  export default value;
}
