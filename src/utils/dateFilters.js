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

export const filterByDateRange = (data, start_date, end_date) => {
  return data.filter((item) => {
    let s_date = new Date(start_date).getTime();
    let e_date = new Date(end_date).getTime();
    let a_date = new Date(item.date).getTime();
    return a_date >= s_date && a_date <= e_date;
  });
};
