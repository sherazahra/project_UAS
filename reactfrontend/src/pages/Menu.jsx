import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const token = localStorage.getItem("token");
import { FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  getKeyValue,
  Image,
  useDisclosure,
  Button,
  Pagination,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@nextui-org/react";

export default function Menu() {
  const token = localStorage.getItem("token");
  const [mhs, setMhs] = useState([]);
  const [menu, setMenu] = useState([]);
  const [show, setShow] = useState(false);
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [gambar, setGambar] = useState(null);
  const [validation, setValidation] = useState({});
  const navigate = useNavigate();
  const [identity, setIdentity] = useState("");
  const isLoggedIn = !!token;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [page, setPage] = useState(1);
  const rowsPerPage = 3;

  const pages = Math.ceil(menu.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return menu.slice(start, end);
  }, [page, menu]);

  const url = "http://localhost:2000/static/";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response2 = await axios.get("http://localhost:2000/api/menu", {
        headers,
      });
      const data2 = await response2.data.data;
      setMenu(data2);
    } catch (error) {
      console.error("Kesalahan: ", error);
    }
  };

  const handleShow = () => setShow(true);

  const handleClose = () => {
    console.log("Modal is closing");
    setShow(false);
  };

  const handleNamaChange = (e) => {
    setNama(e.target.value);
  };

  const handlehargaChange = (e) => {
    setHarga(e.target.value);
  };

  const handleGambarChange = (e) => {
    const file = e.target.files[0];
    setGambar(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("nama", nama);
    formData.append("harga", harga);
    formData.append("gambar", gambar);

    try {
      // const headers = {
      //   Authorization: `Bearer ${token}`,
      // };
      await axios.post("http://localhost:2000/api/menu/store", formData, {
        headers: {
          "Content-Type": " multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/menu");
      fetchData();
      setNama("");
      setHarga("");
      setGambar("");
    } catch (error) {
      console.error("Kesalahan: ", error);
      setValidation(error.response.data);
    }
  };

  // Start Edit
  const [editData, setEditData] = useState({
    id_menu: null,
    nama: "",
    harga: "",
    gambar: "",
  });

  const [showEditModal, setShowEditModal] = useState(false);

  const handleShowEditModal = (data) => {
    setEditData(data); // Set the data to be edited
    setShowEditModal(true); // Open the edit modal
    setShow(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false); // Close the Edit Modal
    setEditData({
      id_menu: null,
      nama: "",
      harga: "",
      gambar: null,
    }); // Reset the input values of the Edit Modal
  };

  const handleEditDataChange = (field, value) => {
    setEditData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = {
      nama: editData.nama,
      harga: editData.harga,
    };
    try {
      await axios.patch(
        `http://localhost:2000/api/menu/update/${editData.id_menu}`,
        formData,
        {
          headers: {
            "Content-Type": " multipart/form-data",
          },
        }
      );
      navigate("/menu");
      fetchData();
      setShowEditModal(false);
    } catch (error) {
      console.error("Kesalahan:", error);
      setValidation(error.response.data);
    }
  };

  const handleDelete = (id_m) => {
    axios
      .delete(`http://localhost:2000/api/menu/delete/${id_m}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Data berhasil dihapus");
        // Hapus item dari array data mhs
        const updatedMhs = mhs.filter((item) => item.id_m !== id_m);
        setMhs(updatedMhs); // Perbarui state dengan data yang sudah diperbarui
        alert("Berhasil menghapus data! ");
        fetchData();
      })
      .catch((error) => {
        console.error("Gagal menghapus data:", error);
        alert(
          "Gagal menghapus data. Silakan coba lagi atau hubungi administrator. "
        );
      });
  };

  return (
    <>
      <div className="w-full flex justify-center pt-10">
        <div className="w-2/4">
          <Table
            aria-label="Example table with client side pagination"
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="secondary"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            }
            classNames={{
              wrapper: "min-h-[222px]",
            }}
          >
            {isLoggedIn ? (
              <TableHeader>
                <TableColumn key="gambar">Gambar</TableColumn>
                <TableColumn key="nama">Nama </TableColumn>
                <TableColumn key="harga">Harga</TableColumn>
                <TableColumn key="id_menu">Action</TableColumn>
              </TableHeader>
            ) : (
              <TableHeader>
                <TableColumn key="gambar">Gambar</TableColumn>
                <TableColumn key="nama">Nama </TableColumn>
                <TableColumn key="harga">Harga</TableColumn>
              </TableHeader>
            )}

            <TableBody items={items}>
              {(item) => (
                <TableRow key={item.id_menu}>
                  {(columnKey) =>
                    columnKey == "id_menu" ? (
                      <TableCell>
                        {isLoggedIn && (
                          <div className="relative flex items-center gap-5">
                            <Tooltip content="Edit Menu">
                              <span
                                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                onClick={() => {
                                  handleShowEditModal(item);
                                  onOpen();
                                  setIdentity("update");
                                }}
                              >
                                <FaPencilAlt />
                              </span>
                            </Tooltip>
                            <Tooltip color="danger" content="Delete Menu">
                              <span
                                className="text-lg text-danger cursor-pointer active:opacity-50"
                                onClick={() =>
                                  handleDelete(getKeyValue(item, columnKey))
                                }
                              >
                                <FaRegTrashAlt />
                              </span>
                            </Tooltip>
                          </div>
                        )}
                      </TableCell>
                    ) : columnKey == "gambar" ? (
                      <TableCell>
                        <Image
                          width={100}
                          alt="NextUI hero Image"
                          src={`http://127.0.0.1:2000/static/${getKeyValue(
                            item,
                            columnKey
                          )}`}
                        />
                      </TableCell>
                    ) : (
                      <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                    )
                  }
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="w-full flex justify-center pt-10">
        {isLoggedIn && (
          <Button
            onPress={() => {
              onOpen();
              setIdentity("create");
            }}
          >
            Tambah Data
          </Button>
        )}
      </div>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          {(onClose) => {
            return identity == "update" ? (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Edit Data Menu
                </ModalHeader>
                <ModalBody>
                  <Input
                    type="text"
                    label="Nama"
                    variant="bordered"
                    placeholder="Nama"
                    defaultValue={editData.nama}
                    onChange={(e) => {
                      handleEditDataChange("nama", e.target.value);
                    }}
                  />
                  <Input
                    type="text"
                    label="Harga"
                    variant="bordered"
                    placeholder="Harga"
                    defaultValue={editData.harga}
                    onChange={(e) => {
                      handleEditDataChange("harga", e.target.value);
                    }}
                  />
                </ModalBody>

                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onClick={handleUpdate}
                    onPress={onClose}
                  >
                    Ubah
                  </Button>
                </ModalFooter>
              </>
            ) : (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Tambah Data Menu
                </ModalHeader>
                <ModalBody>
                  <Input
                    type="text"
                    label="nama"
                    placeholder="masukkan nama "
                    onChange={(e) => {
                      setNama(e.target.value);
                    }}
                  />
                  <Input
                    type="text"
                    label="harga"
                    placeholder="masukkan harga"
                    onChange={(e) => {
                      setHarga(e.target.value);
                    }}
                  />
                  <label
                    class="block pl-2 text-sm font-medium text-gray"
                    for="file_input"
                  >
                    Gambar
                  </label>
                  <input
                    class="w-full text-sm text-gray border border-gray-300 rounded-md cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:placeholder-gray-400"
                    id="file_input"
                    type="file"
                    onChange={(e) => {
                      setGambar(e.target.files[0]);
                    }}
                  ></input>
                </ModalBody>

                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onClick={handleSubmit}
                    onPress={onClose}
                  >
                    Tambah
                  </Button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </>
  );
}
