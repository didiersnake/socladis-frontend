import { useSelector } from "react-redux";
import { selectAllTeams } from "../teams/teamSlice";
import { Button, Card, List } from "antd";
import Title from "antd/es/typography/Title";
import { selectAllIncomes } from "../finances/income/incomeSlice";
import { formatDate } from "../../../utils/formatDate";
import exportPdf from "../../../utils/exportPdf";
import { useState } from "react";

const Reconciliation1 = ({ date, charge, load_return }) => {
  const teams = useSelector(selectAllTeams);
  const income = useSelector(selectAllIncomes);
  const filterDate = (data) => {
    return data.filter(
      (item) => new Date(item.date).getDay() === new Date(date).getDay()
    );
  };

  const allTeamsData = teams.map((team) => {
    const load = filterDate(charge).find((item) => item.team === team.name);
    const back = filterDate(load_return).find(
      (item) => item.team === team.name
    );
    const versement = filterDate(income).find(
      (item) => item?.income_source === team.name
    )?.amount;
    const products = load?.products.map((item) => item.name);
    const load_qty = load?.products.map((item) => item.quantity);
    const back_qty = back?.products.map((item) => item.quantity);
    const sale = load_qty?.map(
      (i, index) => parseInt(i) - parseInt(back_qty[index])
    );
    return {
      team: team.name,
      products: products,
      load_qty: load_qty,
      back_qty: back_qty,
      versement: versement,
      sale: sale,
    };
  });

  const Reco = ({
    team,
    products,
    load,
    back,
    ventes,
    versement,
    ristourne,
  }) => {
    const [loader, setLoader] = useState(false);
    return (
      <div>
        <div className="rounded-md actual-receipt">
          <div className="py-6 text-center px-14 bg-slate-900">
            <Title level={4} style={{ color: "white" }}>
              Reconciliation
            </Title>
          </div>
          <div className="px-8 ">
            <div className="flex items-center justify-between w-1/3 ">
              <p className="font-semibold">Date : </p>
              <h3>{formatDate(date)}</h3>
            </div>
            <div className="flex items-center justify-between w-1/3 ">
              <p className="font-semibold">Equipe : </p>
              <h3>{team}</h3>
            </div>
            <div className="grid grid-cols-4 px-12 border border-black outline">
              <p className="font-semibold">Products </p>
              <p className="font-semibold">Chargement </p>
              <p className="font-semibold"> Retour</p>
              <p className="font-semibold"> Ventes </p>
            </div>
            <div className="grid grid-cols-4 px-12">
              <div className="grid gap-1 font-semibold">{products}</div>
              <div className="grid gap-1 font-semibold">{load}</div>
              <div className="grid gap-1 font-semibold">{back}</div>
              <div className="grid gap-1 font-semibold">{ventes}</div>
            </div>

            <table class="table-auto w-1/3 text-start border-spacing-2  ml-auto">
              <thead>
                <tr></tr>
              </thead>

              <tbody>
                <tr>
                  <td className="font-semibold ">Ristournes</td>
                  <td>{ristourne}</td>
                </tr>

                <tr>
                  <td className="font-semibold ">Versement</td>
                  <td> {versement}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex items-center justify-center w-full p-4 ">
          <Button
            type="primary"
            onClick={() => {
              setLoader(true);
              exportPdf(`Reconciliation ${team}`);
              setLoader(false);
            }}
          >
            {!loader ? "Exporter en PFD" : "Telechargement..."}
          </Button>
        </div>
      </div>
    );
  };

  //get only valid teams data
  const filteredData = allTeamsData.filter(
    (item) => item.products !== undefined && item.back_qty !== undefined
  );

  let content = filteredData.map((item, index) => {
    const team = item?.team;
    const product = item?.products?.map((i, index) => <p key={index}>{i}</p>);
    const load = item?.load_qty?.map((i, index) => <p key={index}>{i}</p>);
    const back = item?.back_qty?.map((i, index) => <p key={index}>{i}</p>);
    const ventes = item?.sale?.map((i, index) => <p key={index}>{i}</p>);
    const versement = item?.versement;
    const ristourne =
      item?.sale?.reduce((acc, curr) => {
        return acc + curr;
      }, 0) * 100;
    return {
      team: team,
      product: product,
      load: load,
      back: back,
      ventes: ventes,
      versement: versement,
      ristourne: ristourne,
    };
  });

  return (
    <div className="mx-2 mb-2">
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          pageSize: 1,
        }}
        dataSource={content}
        renderItem={(item, index) => (
          <List.Item key={index + 1}>
            <Card key={index}>
              <Reco
                team={item.team}
                products={item.product}
                load={item.load}
                back={item.back}
                ventes={item.ventes}
                versement={item.versement}
                ristourne={item.ristourne}
              />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Reconciliation1;
