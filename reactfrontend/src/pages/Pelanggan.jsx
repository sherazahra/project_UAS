import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
const token = localStorage.getItem("token");
import { FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Select,
  SelectItem,
  Pagination,
  getKeyValue,
} from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

export default function Pelanggan() {
  const [pelanggan, setPelanggan] = useState([]);
  const [menu, setMenu] = useState([]);
  const [show, setShow] = useState(false);
  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [no_hp, setNohp] = useState("");
  const [validation, setValidation] = useState({});
  const [identity, setIdentity] = useState("");
  const navigate = useNavigate();

  const url = "http://localhost:2000/static/";

  const [page, setPage] = useState(1);
  const rowsPerPage = 7;

  const pages = Math.ceil(pelanggan.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return pelanggan.slice(start, end);
  }, [page, pelanggan]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response1 = await axios.get("http://localhost:2000/api/pelanggan", {
        headers,
      });
      const data1 = await response1.data.data;
      setPelanggan(data1);
      const response2 = await axios.get("http://localhost:2000/api/pelanggan", {
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

  const handlealamatChange = (e) => {
    setAlamat(e.target.value);
  };

  const handleno_hpChange = (e) => {
    setNohp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      nama: nama,
      alamat: alamat,
      no_hp: no_hp,
    };

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      await axios.post("http://localhost:2000/api/pelanggan/store", formData, {
        headers,
      });
      navigate("/pelanggan");
      fetchData();
    } catch (error) {
      console.error("Kesalahan: ", error);
      setValidation(error.response.data);
    }
  };

  // Start Edit
  const [editData, setEditData] = useState({
    id: null,
    nama: "",
    alamat: "",
    no_hp: "",
  });

  const [showEditModal, setShowEditModal] = useState(false);

  const handleShowEditModal = (data) => {
    setEditData(data); // Set the data to be edited
    setShowEditModal(true); // Open the edit modal
    setShow(false); // Make sure the add data modal is closed when opening the edit modal
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false); // Close the Edit Modal
    setEditData({
      id: null,
      nama: "",
      alamat: "",
      no_hp: "",
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
      alamat: editData.alamat,
      no_hp: editData.no_hp,
    };

    try {
      await axios.patch(
        `http://localhost:2000/api/pelanggan/update/${editData.id_pelanggan}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/pelanggan");
      fetchData();
      setShowEditModal(false);
    } catch (error) {
      console.error("Kesalahan:", error);
      setValidation(error.response.data);
    }
  };

  const handleDelete = async (id_pelanggan) => {
    try {
      await axios.delete(
        `http://localhost:2000/api/pelanggan/delete/${id_pelanggan}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Data berhasil dihapus");
      // Hapus item dari array data pelanggan
      const updatedpelanggan = pelanggan.filter(
        (item) => item.id_pelanggan !== id_pelanggan
      );
      setPelanggan(updatedpelanggan); // Perbarui state dengan data yang sudah diperbarui
      alert("Berhasil menghapus data! ");
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      alert(
        "Gagal menghapus data. Silakan coba lagi atau hubungi administrator. "
      );
    }
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
            <TableHeader>
              <TableColumn key="nama">Nama</TableColumn>
              <TableColumn key="alamat">Alamat</TableColumn>
              <TableColumn key="no_hp">No Hp</TableColumn>
              <TableColumn key="id_pelanggan">Action</TableColumn>
            </TableHeader>
            <TableBody items={items}>
              {(item) => (
                <TableRow key={item.id_pelanggan}>
                  {(columnKey) =>
                    columnKey == "id_pelanggan" ? (
                      <TableCell>
                        <div className="relative flex items-center gap-5">
                          <Tooltip content="Edit Pelanggan">
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
                          <Tooltip color="danger" content="Delete Pelanggan">
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
        <Button
          onPress={() => {
            onOpen();
            setIdentity("create");
          }}
        >
          Tambah Data
        </Button>
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
                  Edit Data Pelanggan
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
                    label="alamat"
                    variant="bordered"
                    placeholder="Alamat"
                    defaultValue={editData.alamat}
                    onChange={(e) => {
                      handleEditDataChange("alamat", e.target.value);
                    }}
                  />
                  <Input
                    type="text"
                    label="No HP"
                    variant="bordered"
                    placeholder="No HP"
                    value={editData.no_hp}
                    onChange={(e) => {
                      handleEditDataChange("no_hp", e.target.value);
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
                  Tambah Data Pelanggan
                </ModalHeader>
                <ModalBody>
                  <Input
                    isClearable
                    type="text"
                    label="Nama"
                    variant="bordered"
                    placeholder="Nama"
                    defaultValue=""
                    onClear={() => console.log("input cleared")}
                    onChange={(e) => {
                      setNama(e.target.value);
                    }}
                  />
                  <Input
                    isClearable
                    type="text"
                    label="alamat"
                    variant="bordered"
                    placeholder="Alamat"
                    defaultValue=""
                    onClear={() => console.log("input cleared")}
                    onChange={(e) => {
                      setAlamat(e.target.value);
                    }}
                  />
                  <Input
                    isClearable
                    type="text"
                    label="No HP"
                    variant="bordered"
                    placeholder="No HP"
                    defaultValue=""
                    onClear={() => console.log("input cleared")}
                    onChange={(e) => {
                      setNohp(e.target.value);
                    }}
                  />
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

      <div className="w-full flex justify-center pt-3">
        <Link to="/bayar">
          <Button>Tambah Pesanan</Button>
        </Link>
      </div>
    </>
  );
}
