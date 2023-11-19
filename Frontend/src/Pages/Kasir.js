import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Modal } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
const token = localStorage.getItem("token");

function Kasir() {
  const [kasir, setKasir] = useState([]);
  const [menu, setMenu] = useState([]);
  const [show, setShow] = useState(false);
  const [nama, setNama] = useState("");
  const [jeniskelamin, setJeniskelamin] = useState("");
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
      const response1 = await axios.get("http://localhost:2000/api/kasir", {
        headers,
      });
      const data1 = await response1.data.data;
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

  const handleShow = () => setShow(true);

  const handleClose = () => {
    console.log("Modal is closing");
    setShow(false);
  };

  const handleNamaChange = (e) => {
    setNama(e.target.value);
  };

  const handlejeniskelaminChange = (e) => {
    setJeniskelamin(e.target.value);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      nama: nama,
      jenis_kelamin: jeniskelamin
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      await axios.post("http://localhost:2000/api/kasir/store", formData, {
        headers,
      });
      navigate("/kasir");
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
      nama : editData.nama,
      jenis_kelamin: editData.jenis_kelamin
    }

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
      await axios
        .delete(`http://localhost:2000/api/kasir/delete/${id_kasir}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
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
              <th scope="col">jeniskelamin</th>
              <th scope="col" colspan={2}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {kasir.map((mh, index) => (
              <tr key={mh.id}>
                <td>{index + 1}</td>
                <td>{mh.nama}</td>
                <td>{mh.jenis_kelamin}</td>
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
                    onClick={() => handleDelete(mh.id_kasir)}
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
              <label className="form-label">jeniskelamin:</label>
              <input
                type="text"
                className="form-control"
                value={jeniskelamin}
                onChange={handlejeniskelaminChange}
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
              <label className="form-label">jenis kelamin:</label>
              <input
                type="text"
                className="form-control"
                value={editData.jenis_kelamin}
                onChange={(e) => handleEditDataChange("jenis_kelamin", e.target.value)}
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

export default Kasir;
