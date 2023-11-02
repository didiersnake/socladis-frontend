export function filterDateByMonth(data) {
  return data.filter((item) => {
    let month = new Date(item.date).getMonth();
    let currentMonth = new Date().getMonth();
    return month === currentMonth;
  });
}
// return stats by month
export function filterMonthByYear(data, currentMonth) {
  return data.filter((item) => {
    let month = new Date(item.date).getMonth();
    let year = new Date(item.date).getFullYear();
    let currentYear = new Date().getFullYear();
    return year === currentYear && month === currentMonth;
  });
}
