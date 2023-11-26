import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import { GoArchive } from "react-icons/go";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
  Tooltip,
} from "@nextui-org/react";

export default function Struk() {
  const [bayar, setBayar] = useState([]);
  const [data, setData] = useState({});
  const token = localStorage.getItem("token");
  const location = useLocation();
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
    } catch (error) {
      console.error("Kesalahan: ", error);
    }
  };

  const [page, setPage] = useState(1);
  const rowsPerPage = 7;

  const pages = Math.ceil(bayar.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return bayar.slice(start, end);
  }, [page, bayar]);

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
    <div className="w-full flex justify-center pt-10">
      <div className="w-2/3">
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
            <TableColumn key="nama_pelanggan">Nama Pelanggan</TableColumn>
            <TableColumn key="nama_kasir">Nama Kasir</TableColumn>
            <TableColumn key="nama_menu">Nama Menu</TableColumn>
            <TableColumn key="jumlah">Jumlah Pesanan</TableColumn>
            <TableColumn key="total_bayar">Total Pembayaran</TableColumn>
            <TableColumn key="id_bayar">Action</TableColumn>
          </TableHeader>
          <TableBody items={items}>
            {(item) => (
              <TableRow key={item.id_bayar}>
                {(columnKey) =>
                  columnKey == "id_bayar" ? (
                    <TableCell>
                      {" "}
                      <div className="relative flex items-center gap-5">
                        <Link to={`/strukview/${getKeyValue(item, columnKey)}`}>
                          <Tooltip content="Cetak Struk">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                              <GoArchive />
                            </span>
                          </Tooltip>
                        </Link>
                        <Tooltip color="danger" content="Delete Struk">
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
  );
}
