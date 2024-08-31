import React, { useState, useEffect } from "react";
import Select from "react-select";
import Navbar from "../../../components/NavbarAdmin";
import Sidebar from "../../../components/SidebarUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExport,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import axios from "axios";
import { API_DUMMY } from "../../../utils/api";
import NavbarAdmin from "../../../components/NavbarAdmin";
import SidebarNavbar from "../../../components/SidebarNavbar";

function Perkaryawan() {
  const [listAbsensi, setListAbsensi] = useState([]);
  const [listUser, setListUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const idAdmin = localStorage.getItem("adminId");

  // Fetch user data
  const getAllUserByAdmin = async () => {
    try {
      const usList = await axios.get(`${API_DUMMY}/api/user/${idAdmin}/users`);
      const userOptions = usList.data.map((user) => ({
        value: user.id,
        label: user.username
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      }));
      setListUser(userOptions);
    } catch (error) {
      console.log(error);
    }
  };

  const getAbsensiByUserId = async (userId) => {
    try {
      const abs = await axios.get(
        `${API_DUMMY}/api/absensi/getByUserId/${userId}`
      );

      if (abs.status === 200) {
        if (abs.data.length === 0) {
          return []; // Return an empty array if no attendance records are found
        } else {
          return abs.data; // Return the attendance data
        }
      } else {
        Swal.fire("Gagal", "Gagal Mengambil data", "error");
        return [];
      }
    } catch (error) {
      console.log("Error:", error);
      Swal.fire("Gagal", "Gagal Mengambil data", "error");
      return [];
    }
  };

  // Handle user selection
  const handleUserChange = async (selectedOption) => {
    setSelectedUser(selectedOption);

    if (selectedOption) {
      const userId = selectedOption.value;
      const abs = await getAbsensiByUserId(userId);

      if (abs.length === 0) {
        Swal.fire("Informasi", "User belum pernah absensi", "info");
        setSelectedUser(null); // Clear the selected user
        setListAbsensi([]); // Clear the attendance list
      } else {
        setListAbsensi(abs);
      }
    } else {
      setListAbsensi([]);
    }
  };

  // Export data function
  const exportPerkaryawan = async () => {
    if (!selectedUser) {
      Swal.fire(
        "Peringatan",
        "Silakan pilih karyawan terlebih dahulu",
        "warning"
      );
      return;
    }
    try {
      const response = await axios.get(
        `${API_DUMMY}/api/absensi/export/absensi-rekapan-perkaryawan?userId=${selectedUser.value}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "RekapPerkawryawan.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      Swal.fire("Berhasil", "Berhasil mengunduh data", "success");
    } catch (error) {
      Swal.fire("Error", "Gagal mengunduh data", "error");
      console.log(error);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    getAllUserByAdmin();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const formatLamaKerja = (startKerja) => {
    const startDate = new Date(startKerja);
    const currentDate = new Date();

    const diffYears = currentDate.getFullYear() - startDate.getFullYear();

    let diffMonths = currentDate.getMonth() - startDate.getMonth();
    if (diffMonths < 0) {
      diffMonths += 12;
    }

    let diffDays = Math.floor(
      (currentDate - startDate) / (1000 * 60 * 60 * 24)
    );

    const lastDayOfLastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    ).getDate();
    if (currentDate.getDate() < startDate.getDate()) {
      diffMonths -= 1;
      diffDays -= lastDayOfLastMonth;
    }

    let durationString = "";
    if (diffYears > 0) {
      durationString += `${diffYears} tahun `;
    }
    if (diffMonths > 0) {
      durationString += `${diffMonths} bulan `;
    }
    if (diffDays > 0) {
      durationString += `${diffDays} hari`;
    }

    return durationString.trim();
  };
  return (
    <div className="flex flex-col h-screen">
      <div className="sticky top-0 z-50">
        <SidebarNavbar />
      </div>
      <div className="flex h-full">
        <div className="sticky top-16 z-40">
          <NavbarAdmin />
        </div>
        <div className="content-page flex-1 p-8 md:ml-64 mt-16 text-center overflow-auto">
          <div className="tabel-absen bg-white p-5 rounded-xl shadow-xl border border-gray-300">
            <div className="flex justify-between">
              <h6 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                Rekap Perkaryawan
              </h6>
            </div>
            <hr />
            <form className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-5">
              <div className="w-full">
                <Select
                  options={listUser}
                  value={selectedUser}
                  onChange={handleUserChange}
                  placeholder="Pilih Karyawan"
                  className="basic-single w-full"
                  classNamePrefix="select"
                  styles={{
                    container: (provided) => ({
                      ...provided,
                      width: "100%", // Ensure it takes full width of parent container
                    }),
                    placeholder: (provided) => ({
                      ...provided,
                      textAlign: "left", // Align placeholder text to the left
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      textAlign: "left", // Align selected value text to the left
                    }),
                    menu: (provided) => ({
                      ...provided,
                      textAlign: "left", // Align options text to the left
                    }),
                    option: (provided) => ({
                      ...provided,
                      textAlign: "left", // Align individual option text to the left
                    }),
                  }}
                />
              </div>

              <div className="flex sm:flex-row gap-4 mx-auto items-center">
                <button
                  type="button"
                  className="bg-indigo-500 hover:bg-indigo text-white font-bold py-2 px-4 rounded inline-block"
                  onClick={() => getAbsensiByUserId(selectedUser?.value)}
                >
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
                <button
                  type="button"
                  className="exp bg-green-500 hover:bg-green text-white font-bold py-2 px-4 rounded inline-block ml-auto"
                  onClick={exportPerkaryawan}
                >
                  <FontAwesomeIcon icon={faFileExport} />
                </button>

              </div>
            </form>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-left text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                      No
                    </th>
                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                      Nama
                    </th>
                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                      Tanggal
                    </th>
                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                      Jam Masuk
                    </th>
                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                      Foto Masuk
                    </th>
                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                      Jam Pulang
                    </th>
                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                      Foto Pulang
                    </th>
                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                      Jam Kerja
                    </th>
                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                      Keterangan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listAbsensi.slice().reverse().map((absensi, index) => (
                    <tr key={absensi.id}>
                      <td className="px-6 py-3 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap capitalize text-center">
                        {absensi.user.username}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap capitalize text-center">
                        {formatDate(absensi.tanggalAbsen)}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap capitalize text-center">
                        {absensi.jamMasuk}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap capitalize text-center">
                        <img
                          src={absensi.fotoMasuk}
                          className="block py-2.5 px-0 w-25 max-h-32 h-25 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          alt="Foto Masuk"
                        />
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap capitalize text-center">
                        {absensi.jamPulang}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap capitalize text-center">
                        <img
                          src={absensi.fotoPulang}
                          className="block py-2.5 px-0 w-25 max-h-32 h-25 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          alt="Foto Pulang"
                        />
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap capitalize text-center">
                        {formatLamaKerja(absensi.user.startKerja)}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap capitalize text-center">
                        {absensi.statusAbsen}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perkaryawan;
