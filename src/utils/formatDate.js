export const formatDate = (antDate) => {
  const date = new Date(antDate);
  const month = date.getMonth() + 1;
  const day = date.getDay() + 1;
  const formattedDate = `${day < 10 ? "0" + day : day}-${month < 10 ? "0" + month : month}-${date.getFullYear()}`;
  return formattedDate;
};
