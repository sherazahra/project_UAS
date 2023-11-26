import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const token = localStorage.getItem("token");
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
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from "@nextui-org/react";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handlelogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:2000/api/auth/login",
        { username, password }
      );
      const token = response.data.token;

      if (token) {
        localStorage.setItem("token", token);
        navigate("/kasir");
        window.location.reload();
      } else {
        console.error("Gagal login: Token tidak diterima");
      }
    } catch (error) {
      if (error.response.status === 401) {
        console.error("Gagal login: Kata sandi atau username salah");
      } else {
        console.error("Gagal login:", error);
      }
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "http://localhost:2000/api/auth/register",
        {
          username: username,
          password: password,
        }
      );
      console.log("Pendaftaran berhasil:", response.data);
      navigate("/login");
      window.location.reload();
    } catch (error) {
      console.error("Gagal mendaftar:", error);
    }
  };

  return (
    <>
      <div className="w-full flex justify-center pt-40">
        <form class="w-full max-w-sm">
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/3">
              <label
                class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                for="inline-full-name"
              >
                Username
              </label>
            </div>
            <div class="md:w-2/3">
              <input
                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="inline-full-name"
                type="text"
                placeholder="Usename"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/3">
              <label
                class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 "
                for="inline-password"
              >
                Password
              </label>
            </div>
            <div class="md:w-2/3">
              <input
                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="inline-password"
                type="password"
                placeholder="******************"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div class="md:flex md:items-center">
            <div class="md:w-1/3"></div>
            <div class="md:w-2/3 flex">
              <button
                class="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="button"
                onClick={handlelogin}
              >
                Log In
              </button>
              <div className="pl-3">
                <Button
                  onPress={onOpen}
                  className="shadow bg-purple-500  hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                >
                  Register
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Register
                </ModalHeader>
                <ModalBody>
                  <Input
                    autoFocus
                    label="Email"
                    placeholder="Enter your email"
                    onChange={(e) => setUsername(e.target.value)}
                    variant="bordered"
                  />
                  <Input
                    label="Password"
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    variant="bordered"
                  />
                  <div className="flex py-2 px-1 justify-between"></div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onClick={handleRegister}>
                    Register
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </>
  );
}
