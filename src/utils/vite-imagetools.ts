type AsPicture = {
  img: { src: string; w: number; h: number };
  sources: {
    avif?: string;
    webp?: string;
  };
};

export function pictureToImgProps({ img, sources }: AsPicture) {
  return {
    src: img.src,
    srcSet: Object.values(sources).join(", ")
  };
}
