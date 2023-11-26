import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Select, SelectItem, Input, Button, Link } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { data } from "autoprefixer";
const token = localStorage.getItem("token");

export default function Bayar() {
  const [bayar, setBayar] = useState([]);
  const [pelanggan, setPelanggan] = useState([]);
  const [kasir, setKasir] = useState([]);
  const [menu, setMenu] = useState([]);
  const [harga, setHarga] = useState(null);
  const [total, setTotal] = useState(0);
  const [data1, setData1] = useState({});
  const [data2, setData2] = useState({});
  const [data3, setData3] = useState({});
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response1 = await axios.get("http://localhost:2000/api/bayar", {
        headers,
      });
      const data1 = await response1.data.data;
      console.log(data1);
      setBayar(data1);
      const response2 = await axios.get("http://localhost:2000/api/pelanggan", {
        headers,
      });
      const data2 = await response2.data.data;
      setPelanggan(data2);

      const response3 = await axios.get("http://localhost:2000/api/kasir", {
        headers,
      });
      const data3 = await response3.data.data;
      setKasir(data3);

      const response4 = await axios.get("http://localhost:2000/api/menu", {
        headers,
      });
      const data4 = await response4.data.data;
      setMenu(data4);
    } catch (error) {
      console.error("Kesalahan: ", error);
    }
  };

  const fetchData1 = async (id) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response1 = await axios.get(`http://localhost:2000/api/menu/${id}`, {
      headers,
    });
    const data1 = await response1.data.data;
    setHarga(data1.harga);
  };

  const handleid_pelangganChange = (e) => {
    setId_pelanggan(e.target.value);
  };

  const handleid_kasirChange = (e) => {
    setId_kasir(e.target.value);
  };
  const handlejumlahChange = (e) => {
    setJumlah(e.target.value);
  };
  const handletotal_bayarChange = (e) => {
    setTotal_bayar(e.target.value);
  };
  const handleid_menuChange = (e) => {
    set_Id_menu(e.target.value);
  };

  const fetchingData = async (pelanggan, kasir, menu) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response1 = await axios.get(
      `http://localhost:2000/api/menu/${menu}`,
      {
        headers,
      }
    );
    const data1 = await response1.data.data;
    setData1(data1);

    const response2 = await axios.get(
      `http://localhost:2000/api/pelanggan/${pelanggan}`,
      {
        headers,
      }
    );
    const data2 = await response2.data.data;
    setData2(data2);

    const response3 = await axios.get(
      `http://localhost:2000/api/kasir/${kasir}`,
      {
        headers,
      }
    );
    const data3 = await response3.data.data;
    setData3(data3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      id_pelanggan: submitData.id_pelanggan,
      id_kasir: submitData.id_kasir,
      jumlah: submitData.jumlah,
      total_bayar: submitData.total_bayar,
      id_menu: submitData.id_menu,
    };

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.post(
        "http://localhost:2000/api/bayar/store",
        formData,
        {
          headers,
        }
      );
      fetchingData(
        submitData.id_pelanggan,
        submitData.id_kasir,
        submitData.id_menu
      );
      navigate("/struk", {
        state: {
          data: {
            pelanggan: data2,
            kasir: data3,
            menu: data1,
            transaksi: formData,
          },
        },
      });
      console.log(response);
    } catch (error) {
      console.error("Kesalahan: ", error);
      setValidation(error.response.data);
    }
  };

  // Start Edit
  const [editData, setEditData] = useState({
    id: null,
    setId_pelanggan: "",
    setId_kasir: "",
    setJumlah: "",
    setTotal_bayar: "",
    setMenu: "",
  });

  const [submitData, setSubmitData] = useState({
    id_pelanggan: null,
    id_kasir: null,
    id_menu: null,
    jumlah: null,
    total_bayar: null,
  });

  const handleSubmitDataChange = (field, value) => {
    setSubmitData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

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
      setId_pelanggan: "",
      setId_kasir: "",
      setJumlah: "",
      setTotal_bayar: "",
      setMenu: "",
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
      id_pelanggan: editData.id_pelanggan,
      id_kasir: editData.id_kasir,
      jumlah: editData.jumlah,
      total_bayar: editData.total_bayar,
      id_menu: editData.id_menu,
    };

    try {
      await axios.patch(
        `http://localhost:2000/api/bayar/update/${editData.id_bayar}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/bayar");
      fetchData();
      setShowEditModal(false);
    } catch (error) {
      console.error("Kesalahan:", error);
      setValidation(error.response.data);
    }
  };

  const handleDelete = async (id_bayar) => {
    try {
      await axios.delete(`http://localhost:2000/api/bayar/delete/${id_bayar}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Data berhasil dihapus");
      // Hapus item dari array data bayar
      const updatedbayar = bayar.filter((item) => item.id_bayar !== id_bayar);
      setBayar(updatedbayar); // Perbarui state dengan data yang sudah diperbarui
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
      <form class="max-w-sm mx-auto pt-28">
        <Select
          variant={"underlined"}
          label="Select an pelanggan"
          className="w-full"
          onChange={(e) => {
            handleSubmitDataChange("id_pelanggan", e.target.value);
          }}
        >
          {pelanggan.map((value) => (
            <SelectItem key={value.id_pelanggan} value={value.id_pelanggan}>
              {value.nama}
            </SelectItem>
          ))}
        </Select>

        <Select
          variant={"underlined"}
          label="Select an kasir"
          className="w-full"
          onChange={(e) => {
            handleSubmitDataChange("id_kasir", e.target.value);
          }}
        >
          {kasir.map((value) => (
            <SelectItem key={value.id_kasir} value={value.id_kasir}>
              {value.nama}
            </SelectItem>
          ))}
        </Select>
        <Select
          variant={"underlined"}
          label="Select an menu"
          className="w-full"
          onChange={(e) => {
            fetchData1(e.target.value);
            handleSubmitDataChange("id_menu", e.target.value);
          }}
        >
          {menu.map((value) => (
            <SelectItem key={value.id_menu} value={value.id_menu}>
              {value.nama}
            </SelectItem>
          ))}
        </Select>
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4 pt-2">
          <Input
            type="text"
            label="Jumlah"
            onChange={(e) => {
              setTotal(harga * e.target.value);
              handleSubmitDataChange("jumlah", e.target.value);
              handleSubmitDataChange("total_bayar", harga * e.target.value);
            }}
          />
          <Input type="text" value={total} disabled />
        </div>
      </form>
      <div className="flex justify-center pt-10">
        <Button onClick={handleSubmit}>Cetak Struk</Button>
      </div>
    </>
  );
}
