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
import { animals } from "./Data";

export default function Kasir() {
  const [kasir, setKasir] = useState([]);
  const [menu, setMenu] = useState([]);
  const [show, setShow] = useState(false);
  const [nama, setNama] = useState("");
  const [jeniskelamin, setJeniskelamin] = useState("");
  const [validation, setValidation] = useState({});
  const navigate = useNavigate();
  const [identity, setIdentity] = useState("");

  const url = "http://localhost:2000/static/";

  const [page, setPage] = useState(1);
  const rowsPerPage = 7;

  const pages = Math.ceil(kasir.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return kasir.slice(start, end);
  }, [page, kasir]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const fetchData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response1 = await axios.get("http://localhost:2000/api/kasir", {
        headers,
      });
      const data1 = await response1.data.data;
      console.log(data1);
      setKasir(data1);
      const response2 = await axios.get("http://localhost:2000/api/kasir", {
        headers,
      });
      const data2 = await response2.data.data;
      setMenu(data2);
    } catch (error) {
      console.error("Kesalahan: ", error);
    }
  };

  const handleNamaChange = (e) => {
    setNama(e.target.value);
  };

  const handlejeniskelaminChange = (e) => {
    setJeniskelamin(e.target.value);
  };

  const handleSubmit = async (e) => {
    const formData = {
      nama: nama,
      jenis_kelamin: jeniskelamin,
    };

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      await axios.post("http://localhost:2000/api/kasir/store", formData, {
        headers,
      });
      fetchData();
      navigate("/kasir");
      setNama("");
      setJeniskelamin("");
    } catch (error) {
      console.error("Kesalahan: ", error);
      setValidation(error.response.data);
    }
  };

  // Start Edit
  const [editData, setEditData] = useState({
    id: null,
    nama: "",
    jenis_kelamin: "",
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
      jenis_kelamin: "",
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
      jenis_kelamin: editData.jenis_kelamin,
    };

    try {
      await axios.patch(
        `http://localhost:2000/api/kasir/update/${editData.id_kasir}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/kasir");
      fetchData();
      setShowEditModal(false);
    } catch (error) {
      console.error("Kesalahan:", error);
      setValidation(error.response.data);
    }
  };

  const handleDelete = async (id_kasir) => {
    try {
      await axios.delete(`http://localhost:2000/api/kasir/delete/${id_kasir}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Data berhasil dihapus");
      // Hapus item dari array data kasir
      const updatedkasir = kasir.filter((item) => item.id_kasir !== id_kasir);
      setKasir(updatedkasir); // Perbarui state dengan data yang sudah diperbarui
      alert("Berhasil menghapus data! ");
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      alert(
        "Gagal menghapus data. Silakan coba lagi atau hubungi administrator. "
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
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
              <TableColumn key="jenis_kelamin">Jenis Kelamin</TableColumn>
              <TableColumn key="id_kasir">Action</TableColumn>
            </TableHeader>
            <TableBody items={items}>
              {(item) => (
                <TableRow key={item.id_kasir}>
                  {(columnKey) =>
                    columnKey == "id_kasir" ? (
                      <TableCell>
                        <div className="relative flex items-center gap-5">
                          <Tooltip content="Edit Kasir">
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
                          <Tooltip color="danger" content="Delete Kasir">
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
        <Button onPress={onOpen}>Tambah Data</Button>
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
                  Edit Data Kasir
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
                  <Select
                    isRequired
                    label="Jenis Kelamin"
                    placeholder="Select Jenis Kelamin"
                    onChange={(e) => {
                      handleEditDataChange("jenis_kelamin", e.target.value);
                    }}
                  >
                    {animals.map((animal) => (
                      <SelectItem key={animal.value} value={animal.value}>
                        {animal.label}
                      </SelectItem>
                    ))}
                  </Select>
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
                  Tambah Data Kasir
                </ModalHeader>
                <ModalBody>
                  <Input
                    isClearable
                    type="text"
                    label="Nama"
                    variant="bordered"
                    placeholder="Nama"
                    defaultValue={editData.nama}
                    onClear={() => console.log("input cleared")}
                    onChange={(e) => {
                      handleEditDataChange("nama", e.target.value);
                    }}
                  />
                  <Select
                    label="Jenis Kelamin"
                    placeholder="Select Jenis Kelamin"
                    className="max-w-xs"
                    defaultValue={editData.jenis_kelamin}
                    onChange={(e) => {
                      handleEditDataChange("jenis_kelamin", e.target.value);
                    }}
                  >
                    {animals.map((animal) => (
                      <SelectItem key={animal.value} value={animal.value}>
                        {animal.label}
                      </SelectItem>
                    ))}
                  </Select>
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
