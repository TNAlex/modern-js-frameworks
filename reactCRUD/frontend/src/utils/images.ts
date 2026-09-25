// export function resolveImageUrl(image: string | null | undefined): string {
//   if (!image) {
//     return "";
//   }

//   if (
//     image.startsWith("/") ||
//     image.startsWith("http://") ||
//     image.startsWith("https://") ||
//     image.startsWith("data:") ||
//     image.startsWith("blob:")
//   ) {
//     return image;
//   }

//   return `/${image}`;
// }
export function resolveImageUrl(image: string | null | undefined): string {
  if (!image) {
    return "";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:") ||
    image.startsWith("blob:")
  ) {
    return image;
  }

  const cleanPath = image.replace(/^\/+/, "");

  return `${import.meta.env.BASE_URL}${cleanPath}`;
}