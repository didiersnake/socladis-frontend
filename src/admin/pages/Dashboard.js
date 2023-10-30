import React from "react";
import Container from "../components/Container";
import { Card, Row, Statistic } from "antd";

import ColCard from "../components/dashboard/ColCard";
import ColCardIcon from "../components/dashboard/ColCardIcon";
import Income from "../assets/png/shopping-bag.svg";

import Trash from "../assets/png/trash-2.svg";
import Percentage from "../assets/png/percent.svg";
import Package from "../assets/png/package.svg";
import BoxList from "../assets/png/layers (1).svg";

import TrendingUp from "../assets/png/trending-up.svg";
import TrendingDown from "../assets/png/trending-down.svg";
import TotalUsers from "../assets/png/user.png";
import Users from "../assets/png/users-group.png";
import UsersPlus from "../assets/png/users-plus.png";
import UsersGroup from "../assets/png/users.png";
import Downlownd from "../assets/png/download.svg";
import Share from "../assets/png/share.svg";
import Archive from "../assets/png/archive (1).svg";

import { useSelector } from "react-redux";
import { selectAllInvoices } from "../../features/sales/invoiceSlice";
import { selectAllUser } from "../../features/users/userSlice";
import { selectAllTeams } from "../features/teams/teamSlice";
import { selectAllProducts } from "../features/product/productSlice";
import { selectAllAvarisProducts } from "../features/avaris/avarisSlice";
import { selectAllStockProducts } from "../features/stock/aStockSlice";
import { selectAllIncomes } from "../features/finances/income/incomeSlice";
import { selectAllExpenses } from "../features/finances/expenses/expenseSlice";
import { selectAllPurchase } from "../features/purchase/purchaseSlice";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

const Dashbord = () => {
  /*   //convert long numbers to strings
  function intToString(value) {
    var suffixes = ["", "k", "M", "B", "t"];
    var suffixNum = Math.floor(("" + value).length / 3);
    var shortValue = parseFloat(
      (suffixNum !== 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(
        3
      )
    );
    if (shortValue % 1 !== 0) {
      shortValue = shortValue.toFixed(1);
    }
    return shortValue + suffixes[suffixNum];
  } */

  function filterDateByMonth(data) {
    return data.filter((item) => {
      let month = new Date(item.date).getMonth();
      let currentMonth = new Date().getMonth();
      return month === currentMonth;
    });
  }

  function filterMonthByYear(data, currentMonth) {
    return data.filter((item) => {
      let month = new Date(item.date).getMonth();
      let year = new Date(item.date).getFullYear();
      let currentYear = new Date().getFullYear();
      return year === currentYear && month === currentMonth;
    });
  }

  const AllUsers = useSelector(selectAllUser);
  const allCustomers = AllUsers.filter(
    (user) => user.roles === "CLIENT" && user
  ).length;
  const allEmployees = AllUsers.filter(
    (user) => user.roles === "EMPLOYEE" && user
  ).length;

  const allTeams = useSelector(selectAllTeams).length;

  const allProducts = useSelector(selectAllProducts).length;
  const month_avaris = filterDateByMonth(
    useSelector(selectAllAvarisProducts)
  ).length;

  const stock = useSelector(selectAllStockProducts);
  const low_stock = stock.filter(
    (item) => Number(item.quantity) < Number(item.unitPrice)
  ).length;
  const high_stock = stock.filter(
    (item) => Number(item.quantity) > Number(item.unitPrice)
  ).length;

  const income = useSelector(selectAllIncomes);
  const month_total_income = filterDateByMonth(income)
    .map((income) => Number(income.amount))
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);

  const sales = useSelector(selectAllInvoices);
  const month_sales = filterDateByMonth(sales).length;
  const sales_income = filterDateByMonth(sales)
    .map((sale) => Number(sale.total_with_tax))
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);

  const expense = useSelector(selectAllExpenses);
  const total_expenses = filterDateByMonth(expense)
    .map((expense) => Number(expense.amount))
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);

  const cost_expenses = useSelector(selectAllPurchase);
  console.log(month_total_income);

  const BarChart = () => {
    const labels = [
      "Janvier",
      "Fevrier",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Decembre",
    ];

    const data = {
      labels,
      datasets: [
        {
          label: "Total Depenses",
          data: labels.map((item, index) => {
            return filterMonthByYear(expense, index)
              .map((expense) => Number(expense.amount))
              .reduce((acc, curr) => {
                return acc + curr;
              }, 0);
          }),
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "Total Revenus",
          data: labels.map((item, index) => {
            return filterMonthByYear(income, index)
              .map((income) => Number(income.amount))
              .reduce((acc, curr) => {
                return acc + curr;
              }, 0);
          }),
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Depenses contre Revenus ",
        },
      },
    };

    return (
      <div className="p-4 bg-white rounded-md h-[520px] ">
        <Bar options={options} data={data} />;
      </div>
    );
  };

  const PieChart = () => {
    const data = {
      labels: ["Stock Faible", "Avaris", "En Stock"],
      datasets: [
        {
          label: "# de packs / bouteilles",
          data: [low_stock, month_avaris, high_stock],
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "#ffeda0",
            "rgba(53, 162, 235, 0.5)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 0.5)",
            "#ffeda0",
            "rgba(53, 162, 235, 0.5)",
          ],
          borderWidth: 1,
        },
      ],
    };
    return (
      <div className="p-4 bg-white rounded-md h-96 ">
        <Pie data={data} />
      </div>
    );
  };

  const AreaChart = () => {
    const labels = [
      "Janvier",
      "Fevrier",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Decembre",
    ];

    const data = {
      labels,
      datasets: [
        {
          fill: true,
          label: " Ventes",
          data: labels.map((item, index) => {
            return filterMonthByYear(sales, index).length;
          }),
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Statistique Ventes",
        },
      },
    };

    return (
      <div className="p-4 bg-white rounded-md ">
        <Line options={options} data={data} />
      </div>
    );
  };

  const dashboard_inventory_statistics = [
    {
      title: "Nombre Ventes",
      value: month_sales,
      color: "#d3ecfc",
      icon: Income,
    },
    {
      title: "Revenus Ventes (CFA)",
      value: sales_income,
      color: "#fef0d9",
      icon: Downlownd,
    },
    {
      title: "Total Renvenus (CFA)",
      value: month_total_income,
      color: "#d3fce0",
      icon: TrendingUp,
    },
    {
      title: "Total Depenses (CFA)",
      value: total_expenses,
      color: "#fabcb6",
      icon: TrendingDown,
    },
    {
      title: "Depenses Achat (CFA)",
      value: "###",
      color: "#fee0d2",
      icon: Share,
    },

    {
      title: "Pourcentage Profit",
      value: "20%",
      color: "#fcf9d3",
      icon: Percentage,
    },
  ];

  const dashboard_stock_statistics = [
    {
      title: "Produits",
      value: allProducts,
      color: "#d3ecfc",
      icon: Package,
    },
    {
      title: "En Stock",
      value: high_stock,
      color: "#d3fce0",
      icon: Archive,
    },
    {
      title: "Stock Faible",
      value: low_stock,
      color: "#fabcb6",
      icon: BoxList,
      text_color: "#e21818",
    },
    {
      title: "Avaris",
      value: month_avaris,
      color: "#fcf9d3",
      icon: Trash,
      text_color: "red",
    },
  ];

  const dashboard_users_statistics = [
    {
      title: "Clients",
      value: allCustomers,
      icon: UsersPlus,
    },
    {
      title: "Employés",
      value: allEmployees,
      icon: UsersGroup,
    },
    {
      title: "Equipes",
      value: allTeams,
      icon: Users,
    },
    {
      title: "Total Utilisateurs",
      value: AllUsers.length,
      icon: TotalUsers,
    },
  ];

  const DashboardItems = () => {
    return (
      <div className="grid gap-4 mb-8">
        <div className="grid grid-cols-6 gap-12 ">
          <div className="grid grid-cols-3 col-span-4 gap-1 bg-white rounded-lg">
            {dashboard_inventory_statistics.map((item, index) => (
              <ColCard
                key={index + 1}
                icon={<ColCardIcon iconName={item.icon} color={item.color} />}
                title={item.title}
                value={item.value}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 col-span-2 gap-1 bg-white rounded-lg">
            {dashboard_stock_statistics.map((item, index) => (
              <ColCard
                key={index + 1}
                title={item.title}
                value={item.value}
                icon={<ColCardIcon iconName={item.icon} color={item.color} />}
                color={item?.text_color}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 mx-24 gap-0.5">
          <Card>
            <div className="grid grid-cols-4 ">
              {dashboard_users_statistics.map((item, index) => (
                <div className="flex items-center gap-4 " key={index + 1}>
                  <div>
                    <img className="w-8" src={item.icon} alt={item.title} />
                  </div>
                  <Statistic
                    title={item.title}
                    value={item.value}
                    valueStyle={{
                      color: "#000000",
                      fontSize: 18,
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                    }}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
        {/* Charts  */}
        <div className="grid items-center grid-cols-9 gap-8 ">
          <div className="col-span-6 ">
            <AreaChart />
          </div>
          <div className="col-span-3 ">
            <PieChart />
          </div>
        </div>

        <BarChart />
      </div>
    );
  };
  return (
    <Container
      content={<DashboardItems />}
      iconName={"grid_4-1"}
      contentName={"Dashboard"}
    />
  );
};

export default Dashbord;
