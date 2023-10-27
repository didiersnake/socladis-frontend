import React, { useEffect, useState } from "react";
import InvoiceCard from "./components/InvoiceCard";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Typography, List } from "antd";
import { selectAllInvoices } from "./invoiceSlice";

const Invoice = () => {
  const { Text, Title } = Typography;
  const dispatch = useDispatch();
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
      <div className=" scrollbar-hide duration-300 min-h-screen bg-[#f8f8fb] py-[34px] px-2 md:px-8 lg:px-36 lg:py-[50px]  ">
        {/* Center Header */}

        <div className=" min-w-full max-h-[64px] flex items-center justify-between">
          <div>
            <Title className="text-xl font-semibold tracking-wide lg:text-4xl md:text-2xl ">
              Factures
            </Title>
          </div>
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

        {/* {invoices.map((invoice, index) => (
              
            ))} */}
      </div>
    </div>
  );
};

export default Invoice;
