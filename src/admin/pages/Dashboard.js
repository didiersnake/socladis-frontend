import React from "react";
import { Card, Statistic } from "antd";
import CircumIcon from "@klarr-agency/circum-icons-react";

import ColCard from "../components/dashboard/ColCard";
import ColCardIcon from "../components/dashboard/ColCardIcon";
import Income from "../assets/png/shopping-bag.svg";

import Container from "../components/Container";
import Trash from "../assets/png/trash-2.svg";
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
import { Link } from "react-router-dom";
import { filterDateByMonth, filterMonthByYear } from "../../utils/dateFilters";

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

  //inventory

  const income = useSelector(selectAllIncomes);
  const month_total_income = filterDateByMonth(income)
    .map((income) => Number(income.amount))
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);

  const sales = useSelector(selectAllInvoices);
  const month_sales_quantity = filterDateByMonth(sales)
    //get array of products
    .map((invoice) => invoice.products)
    //get array of quantities for each products array in invoice
    .map((arr) => arr.map((item) => Number(item.quantity)))
    //sum quantity for each product array
    .map((quantities) =>
      quantities.reduce((acc, curr) => {
        return acc + curr;
      }, 0)
    )
    //sum total
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);

  const month_sales_income = filterDateByMonth(sales)
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

  const cost_expenses = filterDateByMonth(expense)
    .map((exp) => exp.modif === "versement a la banque" && Number(exp.amount))
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);

  // sales

  const month_TVA = filterDateByMonth(sales)
    .map((sale) => Number(sale.VAT_amount))
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);

  const month_withdrawal_amount = filterDateByMonth(sales)
    .map((sale) => Number(sale.withdrawal_amount))
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);

  const month_sale_without_tax = filterDateByMonth(sales)
    .map((sale) => Number(sale.total_without_tax))
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);

  // stock

  const avaris = useSelector(selectAllAvarisProducts);
  const month_avaris_store = filterDateByMonth(avaris)
    .map((item) => {
      return item.type.toLowerCase() === "magasin" && Number(item.quantity);
    })
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);

  const month_avaris_delivery = filterDateByMonth(avaris)
    .map((item) => {
      return item.type.toLowerCase() === "livraison" && Number(item.quantity);
    })
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);

  const stock = useSelector(selectAllStockProducts);
  const low_stock = stock.filter(
    (item) => Number(item.quantity) < Number(item.unitPrice)
  ).length;

  const high_stock = stock.filter(
    (item) => Number(item.quantity) > Number(item.unitPrice)
  ).length;

  // users

  const AllUsers = useSelector(selectAllUser);
  const allCustomers = AllUsers.filter(
    (user) => user.roles === "CLIENT" && user
  ).length;
  const allEmployees = AllUsers.filter(
    (user) => user.roles === "EMPLOYEE" && user
  ).length;

  const allTeams = useSelector(selectAllTeams).length;

  const allProducts = useSelector(selectAllProducts);

  //pack sales graph data

  const packs_sale_data = allProducts
    // get product names in an array
    .map((item) => item.name)
    // check packs sold for each product in invoices
    .map((name) =>
      filterDateByMonth(sales)
        .map((sale) => {
          ///get sale item name with product brand(name in array)
          return sale.products.find((pdt) => pdt.name === name);
        })
        .filter((i) => i !== undefined)
        //get qty
        .map((qty) => Number(qty.quantity))
        //sum
        .reduce((acc, curr) => {
          return acc + curr;
        }, 0)
    );

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
          label: "Depenses Activtés",
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
          label: "Revenus Activtés",
          data: labels.map((item, index) => {
            return filterMonthByYear(sales, index)
              .map((income) => Number(income.total_with_tax))
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
      <div className="p-4 bg-white rounded-md h-96 w-12/12">
        <Bar options={options} data={data} />
      </div>
    );
  };

  const PieChart = () => {
    const data = {
      labels: ["Stock Faible", "Avaris", "En Stock"],
      datasets: [
        {
          label: "# de packs / bouteilles",
          data: [low_stock, month_avaris_store, high_stock],
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
    const options = {
      responsive: true,
    };
    return (
      <div className="p-4 bg-white rounded-md h-96 ">
        <Pie data={data} options={options} />
      </div>
    );
  };

  const SaleAreaChart = () => {
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
          label: "Ventes (packs)",
          data: labels.map((item, index) => {
            return filterMonthByYear(sales, index)
              .map((invoice) => invoice.products)
              .map((arr) => arr.map((item) => Number(item.quantity)))
              .map((quantities) =>
                quantities.reduce((acc, curr) => {
                  return acc + curr;
                }, 0)
              )
              .reduce((acc, curr) => {
                return acc + curr;
              }, 0);
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
          text: "Packs Vendu",
        },
      },
    };

    return (
      <div className="p-4 bg-white rounded-md ">
        <Line options={options} data={data} />
      </div>
    );
  };

  const FuelAreaChart = () => {
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
          label: "Carburant",
          data: labels.map((item, index) => {
            return filterMonthByYear(expense, index)
              .map((exp) => exp.modif === "carburant" && Number(exp.amount))
              .reduce((acc, curr) => {
                return acc + curr;
              }, 0);
          }),
          borderColor: "rgb(252,78,42)",
          backgroundColor: "rgba(252,78,42, 0.5)",
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
          text: "Depenses Carburant",
        },
      },
    };

    return (
      <div className="p-4 bg-white rounded-md ">
        <Line options={options} data={data} />
      </div>
    );
  };

  const BrandSaleAreaChart = () => {
    const labels = allProducts.map((item) => item.name);

    const data = {
      labels,
      datasets: [
        {
          fill: true,
          label: " Packs",
          data: labels.map((item, index) => {
            return packs_sale_data[index];
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
          text: "Ventes Marques",
        },
      },
    };
    return (
      <div className="p-4 bg-white rounded-md w-12/12 ">
        <Line options={options} data={data} />
      </div>
    );
  };

  const dashboard_inventory_statistics = [
    {
      title: "Revenus Ventes",
      value: month_sales_income,
      color: "#fef0d9",
      icon: Downlownd,
    },
    {
      title: "Total en Caisse",
      value: month_total_income,
      color: "#d3fce0",
      icon: TrendingUp,
    },
    {
      title: "Total Depenses",
      value: total_expenses,
      color: "#fabcb6",
      icon: TrendingDown,
    },
    {
      title: "Depenses Achat",
      value: cost_expenses,
      color: "#fee0d2",
      icon: Share,
    },
  ];

  const SaleStat = ({ icon }) => {
    return <div className="p-2">{icon}</div>;
  };
  const dashboard_sales_statistics = [
    {
      title: "Ventes HT",
      value: month_sale_without_tax,
      icon: (
        <SaleStat
          icon={<CircumIcon name="wallet" size={28} color={"blue"} />}
        />
      ),
    },
    {
      title: "Total TVA",
      value: month_TVA,
      color: "#d3fce0",
      icon: (
        <SaleStat
          icon={<CircumIcon name="receipt" size={28} color={"#7a0177"} />}
        />
      ),
    },
    {
      title: "Précomte",
      value: month_withdrawal_amount,
      color: "#fabcb6",
      icon: (
        <SaleStat
          icon={<CircumIcon name="coins_1" color={"#fed976"} size={28} />}
        />
      ),
    },
    {
      title: "Ristournes",
      value: month_sales_quantity * 100,
      color: "#fee0d2",
      icon: (
        <SaleStat
          icon={<CircumIcon name="discount_1" color={"#e31a1c"} size={28} />}
        />
      ),
    },
  ];

  const dashboard_stock_statistics = [
    {
      title: "Total Ventes",
      value: month_sales_quantity,
      color: "#d3ecfc",
      link: "",
      icon: Income,
    },
    {
      title: "Avaris Livraison",
      value: month_avaris_delivery,
      color: "#d3fce0",
      link: "avaris livraison",
      icon: Archive,
    },
    {
      title: "Stock Faible",
      value: low_stock,
      color: "#fabcb6",
      link: "stock faible",
      icon: BoxList,
      text_color: "#e21818",
    },
    {
      title: "Avaris Magasin",
      value: month_avaris_store,
      color: "#fcf9d3",
      link: "avaris magasin",
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

  const InventoryStatistics = () => {
    return (
      <div className="grid grid-cols-2 col-span-2 gap-2 rounded-lg">
        {dashboard_inventory_statistics.map((item, index) => (
          <Link>
            <ColCard
              key={index + 1}
              icon={<ColCardIcon iconName={item.icon} color={item.color} />}
              title={item.title}
              value={item.value}
            />
          </Link>
        ))}
      </div>
    );
  };

  const StockStatistics = () => {
    return (
      <div className="grid grid-cols-2 col-span-2 gap-2 rounded-lg">
        {dashboard_stock_statistics.map((item, index) => (
          <Link to={item.link} key={index + 1}>
            <ColCard
              title={item.title}
              value={item.value}
              icon={<ColCardIcon iconName={item.icon} color={item.color} />}
              color={item?.text_color}
            />
          </Link>
        ))}
      </div>
    );
  };

  const SalesStatistics = () => {
    return (
      <div className="grid grid-cols-2 col-span-2 gap-2 rounded-lg">
        {dashboard_sales_statistics.map((item, index) => (
          <Link>
            <ColCard
              key={index + 1}
              title={item.title}
              value={item.value}
              icon={item.icon}
              color={item?.text_color}
            />
          </Link>
        ))}
      </div>
    );
  };

  const UsersStatistics = () => {
    return (
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
    );
  };

  const DashboardItems = () => {
    return (
      <div className="grid gap-4 mb-8">
        <div className="grid grid-cols-6 gap-12 ">
          <InventoryStatistics />
          <SalesStatistics />
          <StockStatistics />
        </div>

        <UsersStatistics />

        {/* Charts  */}
        <div className="grid items-center grid-cols-8 gap-8 ">
          <div className="col-span-4 ">
            <SaleAreaChart />
          </div>
          <div className="col-span-4 ">
            <FuelAreaChart />
          </div>
        </div>

        <div className="grid grid-cols-7 gap-8 ">
          <div className="col-span-5 ">
            <BarChart />
          </div>
          <div className="col-span-2 ">
            <PieChart />
          </div>
        </div>

        <BrandSaleAreaChart />
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
