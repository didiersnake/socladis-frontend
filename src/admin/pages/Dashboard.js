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
import Boxes from "../assets/png/layers.svg";
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

  const filterDateByMonth = (data) => {
    return data.filter((item) => {
      let date = new Date(item.date).getMonth;
      let currentMonth = new Date().getMonth;
      return date === currentMonth;
    });
  };

  const AllSales = filterDateByMonth(useSelector(selectAllInvoices)).length;
  const AllUsers = useSelector(selectAllUser);
  const allCustomers = AllUsers.filter(
    (user) => user.roles === "CLIENT" && user
  ).length;
  const allEmployees = AllUsers.filter(
    (user) => user.roles === "EMPLOYEE" && user
  ).length;
  const allTeams = useSelector(selectAllTeams).length;
  const allProducts = useSelector(selectAllProducts).length;
  const allAvaris = filterDateByMonth(
    useSelector(selectAllAvarisProducts)
  ).length;
  const stock = useSelector(selectAllStockProducts);
  const low_stock = stock.filter(
    (item) => Number(item.quantity) < Number(item.unitPrice)
  );
  const high_stock = stock.filter(
    (item) => Number(item.quantity) > Number(item.unitPrice)
  );

  const total_income = filterDateByMonth(useSelector(selectAllIncomes))
    .map((income) => Number(income.amount))
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);

  const sales_income = filterDateByMonth(useSelector(selectAllInvoices))
    .map((sale) => Number(sale.total_with_tax))
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);

  const total_expenses = filterDateByMonth(useSelector(selectAllExpenses))
    .map((expense) => Number(expense.amount))
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);

  const cost_expenses = useSelector(selectAllPurchase);
  console.log(sales_income);

  const DashboardItems = () => {
    return (
      <div>
        <div className="grid grid-cols-6 gap-12 ">
          <div className="grid grid-cols-3 col-span-4 gap-1 bg-white rounded-lg">
            <ColCard
              icon={<ColCardIcon iconName={Income} color={"#d3ecfc"} />}
              title={"Total ventes"}
              value={650}
              color={"#000000"}
            />
            <ColCard
              title={"Revenues ventes (CFA)"}
              value={14523031}
              icon={<ColCardIcon iconName={Downlownd} color={"#fef0d9"} />}
              suffix={""}
              color={"#000000"}
            />
            <ColCard
              title={"Total Revenues (CFA)"}
              value={14523031}
              icon={<ColCardIcon iconName={TrendingUp} color={"#d3fce0"} />}
              suffix={""}
              color={"#000000"}
            />
            <ColCard
              title={"Total Depenses (CFA)"}
              value={850500}
              icon={<ColCardIcon iconName={TrendingDown} color={"#fabcb6"} />}
              suffix={""}
              color={"#000000"}
            />
            <ColCard
              title={"Depenses achats (CFA)"}
              value={850500}
              icon={<ColCardIcon iconName={Share} color={"#fee0d2"} />}
              suffix={""}
              color={"#000000"}
            />
            <ColCard
              title={"Pourcentage profit"}
              value={"48%"}
              icon={<ColCardIcon iconName={Percentage} color={"#fcf9d3"} />}
              suffix={""}
              color={""}
            />
          </div>

          <div className="grid grid-cols-2 col-span-2 gap-1 bg-white rounded-lg">
            <ColCard
              title={"Produits"}
              value={allProducts}
              icon={<ColCardIcon iconName={Package} color={"#d3ecfc"} />}
              suffix={""}
              color={"#000000"}
            />
            <ColCard
              title={"En stock "}
              value={120}
              icon={<ColCardIcon iconName={Archive} color={"#d3fce0"} />}
              suffix={""}
              color={"#00000"}
            />
            <ColCard
              title={"Stock faible"}
              value={11}
              icon={<ColCardIcon iconName={BoxList} color={"#fabcb6"} />}
              suffix={""}
              color={"#e21818"}
            />
            <ColCard
              title={"Avaris"}
              value={7}
              icon={<ColCardIcon iconName={Trash} color={"#fcf9d3"} />}
              suffix={""}
              color={"red"}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 mx-24 my-4 gap-0.5">
          <Card>
            <div className="grid grid-cols-4 ">
              <div className="flex items-center gap-4 ">
                <div>
                  <img className="w-8" src={UsersPlus} alt="user_group" />
                </div>
                <Statistic
                  title={"Clients"}
                  value={12980}
                  valueStyle={{
                    color: "#000000",
                    fontSize: 18,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                  }}
                />
              </div>
              <div className="flex items-center gap-4 ">
                <div>
                  <img className="w-8" src={UsersGroup} alt="user_group" />
                </div>
                <Statistic
                  title={"Employés"}
                  value={120}
                  valueStyle={{
                    color: "#000000",
                    fontSize: 18,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                  }}
                />
              </div>
              <div className="flex items-center gap-4 ">
                <div>
                  <img className="w-8" src={Users} alt="user_group" />
                </div>
                <Statistic
                  title={"Equipes"}
                  value={17}
                  valueStyle={{
                    color: "#000000",
                    fontSize: 18,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                  }}
                />
              </div>
              <div className="flex items-center gap-4 ">
                <div>
                  <img className="w-8" src={TotalUsers} alt="user_group" />
                </div>
                <Statistic
                  title={"Total Utilisateurs"}
                  value={13100}
                  valueStyle={{
                    color: "#000000",
                    fontSize: 18,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                  }}
                />
              </div>
            </div>
          </Card>
        </div>
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
