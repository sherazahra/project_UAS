import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Image, Button } from "@nextui-org/react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

export default function App() {
  let { id } = useParams();
  let token = localStorage.getItem("token");
  const [data, setData] = useState();
  const fetchData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response1 = await axios.get(
        `http://localhost:2000/api/bayar/${id}`,
        {
          headers,
        }
      );
      const data1 = await response1.data.data;
      console.log(data1);
      setData(data1);
    } catch (error) {
      console.error("Kesalahan: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full flex justify-center pt-16">
      <Card className="py-4">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">Struk Pembayaran</p>
          <h4 className=" text-medium pt-5">
            Nama Pelanggan : {data ? data.nama_pelanggan : ""}
          </h4>
          <h4 className=" text-medium pt-3">
            Nama Kasir : {data ? data.nama_kasir : ""}
          </h4>
          <h4 className=" text-medium pt-3">
            Nama Menu : {data ? data.nama_menu : ""}
          </h4>
          <h4 className=" text-medium pt-3">
            Jumlah : {data ? data.jumlah : ""}
          </h4>
          <h4 className=" text-medium pt-3">
            Total Pembayaran : {data ? data.total_bayar : ""}
          </h4>
        </CardHeader>
        <CardBody className="overflow-visible py-2 pt-10 ">
          <div className="flex justify-end">
            <Link className="text-red-600" variant="bordered" to="/pelanggan">
              Back
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
