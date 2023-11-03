import React, { useEffect, useState } from "react";
import InvoiceCard from "./components/InvoiceCard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Typography, List } from "antd";
import { selectAllInvoices } from "./invoiceSlice";

const Invoice = () => {
  const { Title } = Typography;
  const navigate = useNavigate();
  const data = useSelector(selectAllInvoices);

  const number_of_items = (item) =>
    item["products"]
      .map((product) => Number(product.quantity))
      .reduce((accumulator, current) => {
        return accumulator + current;
      }, 0);

  let orderedInvoices = data
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <div className=" scrollbar-hide duration-300 min-h-screen bg-[#f8f8fb] py-[34px] mx-12">
        {/* Center Header */}

        <div className="max-h-[64px] mx-6 flex items-center justify-between">
          <Title className="text-xl font-semibold tracking-wide lg:text-4xl ">
            Factures
          </Title>

          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => navigate("createInvoice")}
          >
            Nouvelle Facture
          </Button>
        </div>

        {/* Invoice Cards */}

        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 10,
          }}
          dataSource={orderedInvoices}
          renderItem={(item, index) => (
            <List.Item key={index + 1}>
              <InvoiceCard
                name={item.clientName}
                date={item.date}
                invoiceTotal={item.total_with_tax}
                totalQuantities={number_of_items(item)}
                id={item._id}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default Invoice;
