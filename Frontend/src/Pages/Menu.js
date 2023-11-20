import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Modal } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function Menu() {
  const token = localStorage.getItem("token");
  const [mhs, setMhs] = useState([]);
  const [menu, setMenu] = useState([]);
  const [show, setShow] = useState(false);
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [gambar, setGambar] = useState(null);
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
    const formData = {
      nama: nama,
      harga: harga,
      gambar: gambar
    }

    try {
      // const headers = {
      //   Authorization: `Bearer ${token}`,
      // };
      await axios.post("http://localhost:2000/api/menu/store", formData, {
        headers: {
          'Content-Type': ' multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      navigate("/menu");
      fetchData();
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
    setShow(false); // Make sure the add data modal is closed when opening the edit modal
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
      nama : editData.nama,
      harga: editData.harga,
      gambar: editData.gambar
    }
    try {
      await axios.patch(
        `http://localhost:2000/api/menu/update/${editData.id_menu}`,
        formData,
        {
          headers: {
            'Content-Type': ' multipart/form-data',
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
              <th scope="col">Harga</th>
              <th scope="col">gambar</th>
              <th scope="col" colspan={2}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {menu.map((mh, index) => (
              <tr key={mh.id}>
                <td>{index + 1}</td>
                <td>{mh.nama}</td>
                <td>{mh.harga}</td>
                <td>
                  <img
                    src={url + mh.gambar}
                    alt={mh.nama + " gambar"}
                    height="100"
                  />
                </td>
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
                    onClick={() => handleDelete(mh.id_menu)}
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
              <label className="form-label">harga:</label>
              <input
                type="text"
                className="form-control"
                value={harga}
                onChange={handlehargaChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Gambar:</label>
              <input
                type="file"
                className="form-control"
                accept="public/"
                onChange={handleGambarChange}
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
                value={editData ? editData.nama : ''}
                onChange={(e) => handleEditDataChange('nama', e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">harga:</label>
              <input
                type="text"
                className="form-control"
                value={editData.harga}
                onChange={(e) => handleEditDataChange("harga", e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Gambar:</label>
              <input
                type="file"
                className="form-control"
                accept="public/*"
                onChange={(e) =>
                  handleEditDataChange("gambar", e.target.files[0])
                }
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

export default Menu;
