const format = (price) => {
  const cfa = new Intl.NumberFormat("fr-FR", {
    minimumIntegerDigits: 2,
    style: "currency",
    currency: "cfa",
  });
  return cfa.format(price);
};
export default format;
