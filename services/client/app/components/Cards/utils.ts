export const getCardWidth = (maxWidth: string | undefined) => {
  switch (maxWidth) {
    case "sm":
      return "640px";
    case "md":
      return "760px";
    case "lg":
      return "1024px";
    case "xl":
      return "1280px";
    case "2xl":
      return "1536px";
    case "3xl":
      return "1920px";
    default:
      return "1024px";
  }
};
