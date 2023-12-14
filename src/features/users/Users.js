import React, { useState, useEffect, useRef } from "react";
import { Button, Table, Input, message, Modal, Select, Typography } from "antd";
import Container from "../../admin/components/Container";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import readUsersAction from "./actions/readUsersAction";
import { EditOutlined } from "@ant-design/icons";
import editUserActon from "./actions/editUserActon";
import { selectAllUser } from "./userSlice";
import exportPdf from "../../utils/exportPdf";

const { Title } = Typography;
const Users = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allUsers = useSelector(selectAllUser);
  const [isEditing, setIsEditing] = useState(false); //toggle edit button state
  const [editingUser, setEditingUser] = useState(null);
  const [messageApi, contextHolder] = message.useMessage(); // message state
  const [searchText, setSearchText] = useState("");
  const [show_customer, setShowCustomer] = useState(false);

  const [dataSource, setDataSource] = useState(allUsers);

  const employee = "EMPLOYEE";
  const customer = "CLIENT";
  const stock = "stock";
  const finance = "ventes";
  const commercial = "commercial";

  const readUsers = async () => {
    try {
      await dispatch(readUsersAction());
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    readUsers();
  }, []);

  const customer_list = allUsers.filter(
    (obj) => obj.roles.toString() === "CLIENT"
  );

  function columnItem(key, title, dataIndex) {
    return {
      key,
      title,
      dataIndex,
    };
  }
  const columns = [
    columnItem(0, "ID", "_id"),
    {
      ...columnItem(1, "Nom", "name"),
    },
    {
      title: "Rôle",
      dataIndex: "roles",
      filters: [
        {
          text: "EMPLOYEE",
          value: "EMPLOYEE",
        },
        {
          text: "CLIENT",
          value: "CLIENT",
        },
      ],
      onFilter: (value, record) => record.roles.indexOf(value) === 0,
    },
    columnItem(9, "NIU", "uniqueCode"),

    {
      title: "Category",
      dataIndex: "category",
      filters: [
        {
          text: "grossiste",
          value: "grossiste",
        },
        {
          text: "semi-grossiste",
          value: "semi-grossiste",
        },
        {
          text: "ventes",
          value: "ventes",
        },
        {
          text: "detaillant",
          value: "detaillant",
        },
        {
          text: "stock",
          value: "stock",
        },
      ],
      onFilter: (value, record) => record.category.indexOf(value) === 0,
    },
    {
      ...columnItem(4, "Regime fiscale", "tax_system"),
      filters: [
        {
          text: "réel",
          value: "réel",
        },
        {
          text: "simplifié",
          value: "simplifié",
        },
        {
          text: "liberatoir",
          value: "liberatoir",
        },
      ],
      onFilter: (value, record) => record.tax_system.indexOf(value) === 0,
    },
    columnItem(5, "Tel", "phone"),
    columnItem(6, "Localisation", "location"),
    columnItem(7, "Equipe", "group"),
    {
      ...columnItem(9, "Actions"),
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditUser(record);
              }}
            />
          </>
        );
      },
    },
  ];

  // message function
  const iMessage = (type, content) => {
    setTimeout(() => {
      messageApi.open({
        type: type,
        content: content,
      });
    }, 1000);
  };

  /*  const onDeleteUser = (record) => {
    //confirm  modal
    Modal.confirm({
      title: "Voulez vous supprimer cet utilisateur?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        //delete record
        setDataSource((pre) => {
          return pre.filter((User) => User.id !== record.id);
        });
        //show success message
        iMessage("success", "supprimé");
      },
    });
  }; */

  const editUser = (user) => {
    try {
      dispatch(editUserActon(user));
    } catch (error) {
      console.log(error.response);
    }
  };

  const onEditUser = (record) => {
    //open edit modal
    setIsEditing(true);
    setEditingUser({ ...record });
  };

  const resetEditing = () => {
    //reset edited data
    setIsEditing(false);
    setEditingUser(null);
  };

  const componentRef = useRef();

  const handleExport = async () => {
    setShowCustomer(true);
    await exportPdf(componentRef, "Socladis clients.pdf");
    setShowCustomer(false);
  };

  let content = (
    <>
      {contextHolder}
      <div className="flex justify-between mb-2 ">
        <Button type="primary" onClick={() => navigate("create")}>
          Ajouter un Utilisateur
        </Button>

        <Button onClick={handleExport}> Exporter liste des clients</Button>
        {/* search bar */}
        <Input.Search
          style={{ maxWidth: 300 }}
          placeholder="Recherche..."
          allowClear
          onChange={(e) => {
            setSearchText(e.target.value);
            setDataSource(
              allUsers.filter((record) =>
                record?.name
                  .toLowerCase()
                  .includes(e.target.value.toLowerCase())
              )
            );
          }}
        />
      </div>

      <Table
        className="capitalize "
        columns={columns.filter((col) => col.dataIndex !== "_id")}
        dataSource={!searchText ? allUsers : dataSource}
      ></Table>

      <div
        ref={componentRef}
        className={show_customer ? "actual-receipt" : "hidden"}
      >
        <Title level={2} className="text-center">
          Socladis sarl
        </Title>

        <Title className="text-center" level={5}>
          Liste des clients
        </Title>

        <table className="border-spacing-y-1 border-spacing-x-12">
          <tr>
            <th>#</th>
            <th>Nom</th>
            <th>NIU</th>
            <th>Regime Fiscal</th>
            <th>Category</th>
          </tr>

          {customer_list.map((item, index) => {
            return (
              <tr>
                <td>{index + 1}</td>
                <td>{item?.name}</td>
                <td>{item?.uniqueCode}</td>
                <td>{item?.tax_system}</td>
                <td>{item?.category}</td>
              </tr>
            );
          })}
        </table>
      </div>
      <Modal
        title="Modifier le produit"
        open={isEditing}
        okText="Sauvegarder"
        cancelText="Annuler"
        onCancel={() => {
          resetEditing();
        }}
        onOk={() => {
          editUser(editingUser);
          //take of modal after edit and display message
          resetEditing();
          iMessage("success", "modifié");
        }}
      >
        <div className="grid gap-2 ">
          <Input
            value={editingUser?.name}
            onChange={(e) => {
              setEditingUser((pre) => {
                return { ...pre, name: e.target.value };
              });
            }}
          />
          <Select
            value={editingUser?.roles}
            onChange={(e) =>
              setEditingUser((pre) => {
                return { ...pre, roles: e };
              })
            }
          >
            <Select.Option value={employee}>Employé</Select.Option>
            <Select.Option value={customer}>Client</Select.Option>
          </Select>
          <Input
            disabled={editingUser?.roles === employee}
            value={editingUser?.uniqueCode}
            onChange={(e) => {
              setEditingUser((pre) => {
                return { ...pre, uniqueCode: e.target.value };
              });
            }}
          />
          {editingUser?.roles === employee ? (
            <Select
              value={editingUser?.category}
              onChange={(e) =>
                setEditingUser((pre) => {
                  return {
                    ...pre,
                    category: e,
                  };
                })
              }
            >
              <Select.Option value={stock}>Magasin</Select.Option>
              <Select.Option value={finance}>Ventes</Select.Option>
              <Select.Option value={commercial}>Commercial</Select.Option>
            </Select>
          ) : editingUser?.roles === customer ? (
            <Select
              value={editingUser?.category}
              onChange={(e) => {
                setEditingUser((pre) => {
                  return {
                    ...pre,
                    category: e,
                  };
                });
              }}
            >
              <Select.Option value="grossiste">Grossiste</Select.Option>
              <Select.Option value="semi-grossiste">
                Semi Grossiste
              </Select.Option>
              <Select.Option value="detaillant">Detaillant</Select.Option>
              <Select.Option value="random">Random</Select.Option>
            </Select>
          ) : (
            ""
          )}

          <Select
            disabled={editingUser?.roles === employee}
            value={editingUser?.tax_system}
            onChange={(e) => {
              setEditingUser((pre) => {
                return { ...pre, tax_system: e };
              });
            }}
          >
            <Select.Option value=""></Select.Option>
            <Select.Option value="réel">Reel</Select.Option>
            <Select.Option value="simplifié">Simplifié</Select.Option>
            <Select.Option value="liberatoir">liberatoir</Select.Option>
            <Select.Option value="random">Random</Select.Option>
            <Select.Option value="réel CGA">Reel CGA</Select.Option>
            <Select.Option value="simplifié CGA">Simplifié CGA</Select.Option>
            <Select.Option value="liberatoir CGA">liberatoir CGA</Select.Option>
          </Select>
          <Input
            value={editingUser?.phone}
            onChange={(e) => {
              setEditingUser((pre) => {
                return { ...pre, phone: e.target.value };
              });
            }}
          />
          <Input
            value={editingUser?.location}
            onChange={(e) => {
              setEditingUser((pre) => {
                return { ...pre, location: e.target.value };
              });
            }}
          />
          <Input
            disabled={editingUser?.roles === employee}
            value={editingUser?.group}
            onChange={(e) =>
              setEditingUser((pre) => {
                return { ...pre, group: e.target.value };
              })
            }
          />

          <Input
            disabled={editingUser?.roles === customer}
            value={editingUser?.password}
            placeholder="mot de passe"
            onChange={(e) =>
              setEditingUser((pre) => {
                return { ...pre, password: e.target.value };
              })
            }
          />
        </div>
      </Modal>
    </>
  );
  return (
    <Container
      content={content}
      iconName={"grid_4-1"}
      contentName={"Utilisateurs"}
    />
  );
};

export default Users;
