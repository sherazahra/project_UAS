import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Modal } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
const token = localStorage.getItem("token");

function Pelanggan() {
  const [pelanggan, setPelanggan] = useState([]);
  const [menu, setMenu] = useState([]);
  const [show, setShow] = useState(false);
  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [no_hp, setNohp] = useState("");
  const [validation, setValidation] = useState({});
  const navigate = useNavigate();

  const url = "http://localhost:2000/static/";

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
      nama : nama,
      alamat: alamat,
      no_hp: no_hp
    }

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
    no_hp: ""
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
      no_hp: ""
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
      nama : editData.nama,
      alamat: editData.alamat,
      no_hp: editData.no_hp
    }

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
      await axios
        .delete(`http://localhost:2000/api/pelanggan/delete/${id_pelanggan}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          console.log("Data berhasil dihapus");
          // Hapus item dari array data pelanggan
          const updatedpelanggan = pelanggan.filter((item) => item.id_pelanggan !== id_pelanggan);
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
    <Container>
      <Row>
        <Col>
          <h2>Data Menu</h2>
          <Button variant="primary" onClick={handleShow}>
            Tambah
          </Button>
        </Col>
        <table className="table table-striped">
          <thead>
            <tr class="table-secondary">
              <th scope="col">No</th>
              <th scope="col">Nama</th>
              <th scope="col">alamat</th>
              <th scope="col">no_hp</th>
              <th scope="col" colspan={2}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {pelanggan.map((mh, index) => (
              <tr key={mh.id}>
                <td>{index + 1}</td>
                <td>{mh.nama}</td>
                <td>{mh.alamat}</td>
                <td>{mh.no_hp}</td>
                <td>
                  <button
                    onClick={() => handleShowEditModal(mh)}
                    className="btn btn-sm btn-info"
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(mh.id_pelanggan)}
                    className="btn btn-sm btn-danger"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Row>
      <Row>
        <Table striped bordered hover>
          {/* Mahasiswa Table */}
        </Table>
      </Row>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nama:</label>
              <input
                type="text"
                className="form-control"
                value={nama}
                onChange={handleNamaChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">alamat:</label>
              <input
                type="text"
                className="form-control"
                value={alamat}
                onChange={handlealamatChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">no_hp:</label>
              <input
                type="text"
                className="form-control"
                value={no_hp}
                onChange={handleno_hpChange}
              />
            </div>
            <button
              onClick={handleClose}
              type="submit"
              className="btn btn-primary"
            >
              Kirim
            </button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label className="form-label">Nama:</label>
              <input
                type="text"
                className="form-control"
                value={editData.nama}
                onChange={(e) => handleEditDataChange("nama", e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">alamat:</label>
              <input
                type="text"
                className="form-control"
                value={editData.alamat}
                onChange={(e) => handleEditDataChange("alamat", e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">no_hp:</label>
              <input
                type="text"
                className="form-control"
                value={editData.no_hp}
                onChange={(e) => handleEditDataChange("no_hp", e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Simpan Perubahan
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Pelanggan;
