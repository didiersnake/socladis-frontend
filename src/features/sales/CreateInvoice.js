import {
  AutoComplete,
  Input,
  Button,
  Typography,
  Modal,
  DatePicker,
  Table,
  message,
  Select,
} from "antd";
import React, { useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { selectAllUser } from "../users/userSlice";
import AddItem from "./components/AddItem";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import format from "../../utils/currency";
import { formatDate } from "../../utils/formatDate";
import addInvoice from "./actions/addInvoice";

const CreateInvoice = () => {
  const users = useSelector(selectAllUser);
  const [nameOptions, setNameOptions] = useState([]);
  const { Text, Title } = Typography;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [tax_system, setTaxSystem] = useState("");
  const [location, setLocation] = useState("");
  const [group, setGroup] = useState("");
  const [date, setDate] = useState("");
  const [paymentMode, setPaymentMode] = useState();
  const [item, setItem] = useState([
    {
      name: "",
      quantity: 1,
      price: 0,
      total: 0,
    },
  ]);

  const columns = [
    {
      title: "Produits",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantité",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Valeur",
      dataIndex: "total",
      key: "total",
    },
  ];

  //total quantities

  const [total_without_tax, setTotalWithoutTax] = useState(0);
  const VAT_amount = total_without_tax * 0.1925;
  const ristourne =
    100 *
    item
      .map((product) => Number(product.quantity))
      .reduce((accumulator, current) => {
        return accumulator + current;
      }, 0);

  const withdrawal_amount = () => {
    let result = 0;
    if (tax_system === "réel") {
      result = total_without_tax * 0.02;
    } else if (tax_system === "simplifié") {
      result = total_without_tax * 0.05;
    } else if (tax_system === "liberatoir") {
      result = total_without_tax * 0.1;
    } else if (tax_system === "liberatoir CGA") {
      result = total_without_tax * 0.05;
    } else if (tax_system === "simplifié CGA") {
      result = total_without_tax * 0.025;
    } else if (tax_system === "réel CGA") {
      result = total_without_tax * 0.001;
    } else {
      result = total_without_tax * 0.1;
    }
    return result;
  };
  const total_with_tax =
    VAT_amount + total_without_tax + ristourne + withdrawal_amount();

  const handleInvoiceConfirm = async () => {
    try {
      await dispatch(
        addInvoice(
          name,
          item.map((obj) =>
            Object.fromEntries(
              Object.entries(obj).map(([key, val]) => [key, String(val)])
            )
          ),
          total_without_tax.toString(),
          VAT_amount.toString(),
          withdrawal_amount().toString(),
          total_with_tax.toString(),
          ristourne.toString(),
          "",
          date
        )
      );
    } catch (error) {
      if (error.response.status === 500) {
        iMessage("error", "Veillez remplir tous les champs ");
      }
      console.log(error.response.data);
    }
    setName("");
    setDate("");
    setItem([...item]);
    setOpen(false);
    iMessage("success", "Facture Enregistrer");
  };

  const handleInvoiceCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  const onNameSearch = (val) => {
    let filtered = users.filter(
      (obj) =>
        obj.roles.toString() === "CLIENT" &&
        obj.name.toString().toLowerCase().includes(val.toLowerCase())
    );
    setNameOptions(filtered);
  };

  const onNameSelect = (value, option) => {
    setName(option.value);
    setCategory(option.category);
    setTaxSystem(option.tax_system);
    setLocation(option.location);
    setGroup(option.group);
    console.log(option);
  };

  const onDelete = (name) => {
    setItem((pervState) => pervState.filter((el) => el.name !== name));
  };

  const iMessage = (type, content) => {
    setTimeout(() => {
      messageApi.open({
        type: type,
        content: content,
      });
    }, 1000);
  };

  const handelOnChange = (name, e) => {
    let data = [...item];

    let foundData = data.find((el) => el.name === name);
    if (e.target.name === "quantity" || "price") {
      foundData[e.target.name] = e.target.value;
    } else {
      foundData[e.target.name] = e.target.value;
    }

    setItem(data);
  };

  const handleInvoice = () => {
    if (name && date) {
      setTotalWithoutTax(
        item
          .map((item) => item.total)
          .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0)
      );
      showModal();
    }
  };

  /* const onProductSearch = (val) => {
    let filtered = allProducts.filter(
      (obj) =>
        obj._id !== 0 &&
        obj.name.toString().toLowerCase().includes(val.toLowerCase())
    );
    setProductOptions(filtered);
  };

  const onProductSelect = (value, option) => {
    setProductName(option.value);
    setFormat(option.format);
    setPrice(option.price);
    console.log(option);
  }; */

  /* const itemTotal = parseInt(price) * quantity;
  const onFinish = (values) => {
    console.log("Received values of form:", values);
  };
 */

  const ConfirmInvoiceModal = ({ name, date }) => {
    return (
      <>
        <Modal
          title="Confirmer la Facture"
          open={open}
          onOk={handleInvoiceConfirm}
          onCancel={handleInvoiceCancel}
        >
          <div>
            <div className="flex items-start justify-between ">
              <p className="font-semibold ">{name}</p>
            </div>
            <div className="flex items-start justify-between ">
              <p className="font-semibold ">{formatDate(date)}</p>
            </div>

            <Table dataSource={item} columns={columns} />

            <p className="text-red-500 ">
              Assurez-vous de confirmer cette facture avant de continuer, car
              elle ne peut pas être annulée.
            </p>

            <div className="flex items-center justify-between ml-52">
              <p className="font-semibold ">Total HT</p>
              <p className="font-semibold ">{total_without_tax.toFixed(2)}</p>
            </div>
            {/* <div className="flex items-center justify-between ml-52">
              <p className="font-semibold ">Montant TVA</p>
              <p className="font-semibold ">{VAT_amount.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between ml-52">
              <p className="font-semibold ">Précompte </p>
              <p className="font-semibold ">{withdrawal_amount().toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between ml-52">
              <p className="font-semibold ">Ristourne </p>
              <p className="font-semibold ">{ristourne.toFixed(2)}</p>
            </div> */}
            <div className="flex items-center justify-between ml-52">
              <p className="font-semibold ">Total TTC </p>
              <p className="font-semibold ">
                {format(total_with_tax.toFixed(2))}
              </p>
            </div>
          </div>
        </Modal>
      </>
    );
  };

  return (
    <>
      {contextHolder}
      <div className="py-6">
        <Button
          className="mx-36 "
          onClick={() => navigate(-1)}
          icon={<ArrowLeftOutlined />}
        ></Button>
      </div>

      <div className="px-12 py-8 mb-24 border border-gray-700 border-solid rounded-md mx-36">
        <div>
          <Title level={4}>Formulaire de facture</Title>
        </div>

        <div className="">
          <h3 className="text-base ">Nom du client</h3>
          <AutoComplete
            size="large"
            className="w-full"
            options={nameOptions.map((name) => ({
              label: name.name,
              value: name.name,
              id: name._id,
              tax_system: name.tax_system,
              category: name.category,
              location: name.location,
              group: name.group,
              phone: name.phone,
            }))}
            onSearch={onNameSearch}
            onSelect={onNameSelect}
          >
            <Input
              name="name"
              size="large"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setCategory("");
                setGroup("");
                setLocation("");
                setTaxSystem("");
              }}
              placeholder="entrez le nom du client..."
            />
          </AutoComplete>
        </div>

        <div className="flex mb-6 justify-items-start gap-36">
          <div>
            <h3 className="text-base ">Mode de paiement </h3>
            <Select
              onChange={(e) => setPaymentMode(e)}
              value={paymentMode}
              placeholder="mode de paiement"
            >
              <Select.Option value="cash">Espèces</Select.Option>
              <Select.Option value="packaging">Emballages</Select.Option>
              <Select.Option value="ristourne">Ristourne</Select.Option>
            </Select>
          </div>
          <div>
            <h3 className="text-base ">Date </h3>
            <DatePicker
              onChange={(dateString) => setDate(dateString)}
              value={date}
              showTime={false}
              format={"DD/MM/YYYY"}
            />
          </div>
        </div>

        <div className="">
          <div className="flex items-center justify-between gap-32 p-2">
            <Text>
              <strong> Category </strong>: {category}
            </Text>
            <Text>
              <strong> Regime fiscal</strong> : {tax_system}
            </Text>
            <Text>
              <strong> Localisation </strong> : {location}
            </Text>
            <Text>
              <strong> Prise en charge</strong> : {group}
            </Text>
          </div>
        </div>

        {item.map((itemDetails, index) => (
          <AddItem
            key={index}
            handelOnChange={handelOnChange}
            setItem={setItem}
            onDelete={onDelete}
            itemDetails={itemDetails}
          />
        ))}

        <Button
          type="dashed"
          onClick={() => {
            setItem((state) => [
              ...state,
              {
                name: "",
                quantity: 1,
                price: 0,
                total: 0,
              },
            ]);
          }}
          className="w-full mx-auto my-5 "
        >
          + Ajouter un champ
        </Button>

        <div className="p-3 mx-auto">
          <Button type="primary" onClick={handleInvoice}>
            Enregistrer et generez une facture
          </Button>
        </div>

        <ConfirmInvoiceModal name={name} date={date} />
      </div>
    </>
  );
};
export default CreateInvoice;
