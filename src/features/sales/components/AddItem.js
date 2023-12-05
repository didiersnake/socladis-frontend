import React from "react";
import { selectAllProducts } from "../../../admin/features/product/productSlice";
import { DeleteFilled } from "@ant-design/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { AutoComplete, Input, Button } from "antd";

const AddItem = ({
  itemDetails,
  handelOnChange,
  setItem,
  onDelete,
  customerCategory,
}) => {
  const allProducts = useSelector(selectAllProducts);
  const [productOptions, setProductOptions] = useState([]);
  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [format, setFormat] = useState();

  const onProductSearch = (val) => {
    let filtered = allProducts.filter(
      (obj) =>
        obj?._id !== 0 &&
        obj?.name.toString().toLowerCase().includes(val.toLowerCase())
    );
    setProductOptions(filtered);
  };

  const onProductSelect = (value, option) => {
    setName(option.value);
    setPrice(option.prices);
    setFormat(option.format);
  };

  function getPrice() {
    if (name) {
      return customerCategory === "grossiste"
        ? Number(price[0]?.grossiste)
        : customerCategory === "semi-grossiste"
        ? Number(price[0]?.Semi_grossiste)
        : customerCategory === "detaillant"
        ? Number(price[0]?.detaillant)
        : Number(price[0]?.detaillant);
    } else {
      return 0;
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between ">
        <div className="flex flex-wrap ">
          <div className="flex flex-col items-start px-2 py-2 ">
            <h4>Nom du produit</h4>
            <AutoComplete
              size="large"
              options={productOptions.map((product) => {
                return {
                  label: product.name,
                  value: product.name,
                  id: product._id,
                  prices: product.sale_price,
                  format: product.format,
                };
              })}
              onSearch={onProductSearch}
              onSelect={onProductSelect}
            >
              <Input
                name="name"
                onChange={(e) => {
                  handelOnChange(itemDetails.name, e);
                }}
                value={(itemDetails.name = name)}
                type="text"
              />
            </AutoComplete>
          </div>

          <div className="flex flex-col items-start px-2 py-2 ">
            <h4>Quantité</h4>
            <Input
              name="quantity"
              type="number"
              onChange={(e) => {
                handelOnChange(itemDetails.name, e);
              }}
              value={itemDetails.quantity}
              min={0}
            />
          </div>

          <div className="flex flex-col items-start px-2 py-2">
            <h4>Format </h4>
            <Input
              name="format"
              type="text"
              value={(itemDetails.format = format)}
              min={0}
            />
          </div>

          <div className="flex flex-col items-start px-2 py-2">
            <h4>Prix </h4>
            <Input
              name="price"
              type="number"
              value={(itemDetails.price = getPrice())}
              min={0}
            />
          </div>

          <div className="flex flex-col items-start px-2 py-2 ">
            <h4>Total</h4>
            <div className=" max-w-[100px] bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg focus:outline-none  focus:outline-purple-400 border-gray-800 text-white">
              {(itemDetails.total =
                Number(itemDetails.price) *
                Number(itemDetails.quantity)).toFixed(2)}
            </div>
          </div>
        </div>
        <Button
          onClick={() => {
            onDelete(itemDetails.name);
          }}
        >
          <DeleteFilled className="w-6 h-6 text-gray-500 cursor-pointer hover:text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export default AddItem;
