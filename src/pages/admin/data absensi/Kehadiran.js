import React, { useEffect, useState } from "react";
import Navbar from "../../../components/NavbarAdmin";
import Sidebar from "../../../components/SidebarUser";
import axios from "axios";
import { Pagination } from "flowbite-react";
import { API_DUMMY } from "../../../utils/api";
import SidebarNavbar from "../../../components/SidebarNavbar";
import NavbarAdmin from "../../../components/NavbarAdmin";

function Kehadiran() {
  const [kehadiran, setKehadiran] = useState([]);
  const [allAbsensi, setAllAbsensi] = useState([]);
  const idAdmin = localStorage.getItem("adminId");
  const adminId = localStorage.getItem("adminId");
  const [lateCount, setLateCount] = useState(0);
  const [earlyCount, setEarlyCount] = useState(0);
  const [permissionCount, setPermissionCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getAllKaryawanUser = async () => {
    try {
      const all = await axios.get(`${API_DUMMY}/api/user/${idAdmin}/users`);
      setKehadiran(all.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllAbsensiByAdmin = async () => {
    try {
      const abs = await axios.get(`${API_DUMMY}/api/absensi/admin/${adminId}`);

      setAllAbsensi(abs.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllKaryawanUser();
    getAllAbsensiByAdmin();
  }, []);

  const getAbsensiByUserId = (userId, status) => {
    return allAbsensi.filter(
      (abs) => abs.user.id === userId && abs.statusAbsen === status
    ).length;
  };

  const getTotalMasukPerBulan = (userId) => {
    const currentMonth = new Date().getMonth() + 1;
    return allAbsensi.filter(
      (abs) =>
        abs.user.id === userId &&
        (abs.statusAbsen === "Lebih Awal" || abs.statusAbsen === "Terlambat") &&
        new Date(abs.tanggalAbsen).getMonth() + 1 === currentMonth
    ).length;
  };

  useEffect(() => {
    const userAbsensiCounts = kehadiran.map((user) => ({
      userId: user.id,
      lateCount: getAbsensiByUserId(user.id, "Terlambat"),
      earlyCount: getAbsensiByUserId(user.id, "Lebih Awal"),
      permissionCount: getAbsensiByUserId(user.id, "Izin"),
      totalMasuk: getTotalMasukPerBulan(user.id),
    }));

    setKehadiran((prevUsers) =>
      prevUsers.map((user) => {
        const updatedCounts = userAbsensiCounts.find(
          (u) => u.userId === user.id
        );
        return updatedCounts ? { ...user, ...updatedCounts } : user;
      })
    );
  }, [allAbsensi]);

  useEffect(() => {
    const filteredData = kehadiran.filter(
      (kehadiran) =>
        (kehadiran.username.toLowerCase().includes(searchTerm.toLowerCase()) ??
          false) ||
        (kehadiran.jabatan?.namaJabatan
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ??
          false)
    );
    setTotalPages(Math.ceil(filteredData.length / limit));
  }, [searchTerm, limit, kehadiran]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
    setCurrentPage(1); // Reset to the first page when limit changes
  };

  function onPageChange(page) {
    setCurrentPage(page);
  }

  const filteredKehadiran = kehadiran.filter(
    (kehadiran) =>
      (kehadiran.username.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      (kehadiran.jabatan?.namaJabatan
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ??
        false)
  );

  const paginatedKehadiran = filteredKehadiran.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

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
            <div className="flex flex-col md:flex-row justify-between">
              <h2 className="text-xl font-bold mb-4 md:mb-0">Data Kehadiran</h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="relative w-64">
                  <input
                    type="search"
                    id="search-dropdown"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="block p-2.5 w-full z-20 text-sm rounded-l-md text-gray-900 bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                    placeholder="Search name..."
                    required
                  />
                </div>
                <select
                  value={limit}
                  onChange={handleLimitChange}
                  className="flex-shrink-0 z-10 inline-flex rounded-r-md items-center py-2.5 px-4 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
                >
                  <option value="5">05</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
            <hr className="mt-3" />
            <div className="relative overflow-x-auto mt-5">
              <table
                id="dataKehadiran"
                className="w-full text-sm text-left text-gray-500 dark:text-gray-400"
              >
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                      No
                    </th>
                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                      Username
                    </th>
                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                      Jabatan
                    </th>
                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                      Terlambat
                    </th>
                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                      Lebih Awal
                    </th>
                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                      Izin
                    </th>
                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                      Total Masuk
                      <span className="text-xs font-normal"> / Bulan</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-left">
                  {paginatedKehadiran.length > 0 ? (
                    paginatedKehadiran
                      .slice()
                      .reverse()
                      .map((kehadiran, index) => (
                        <tr
                          key={index}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {(currentPage - 1) * limit + index + 1}
                          </th>
                          <td className="px-6 py-4 text-gray-700 capitalize whitespace-nowrap">
                            {kehadiran.username}
                          </td>
                          <td className="px-6 py-4 text-gray-700 capitalize whitespace-nowrap">
                            {kehadiran.jabatan
                              ? kehadiran.jabatan.namaJabatan
                              : "Tidak ada jabatan"}
                          </td>
                          <td className="px-6 py-4 text-gray-700 capitalize whitespace-nowrap">
                            {kehadiran.lateCount}
                          </td>
                          <td className="px-6 py-4 text-gray-700 capitalize whitespace-nowrap">
                            {kehadiran.earlyCount}
                          </td>
                          <td className="px-6 py-4 text-gray-700 capitalize whitespace-nowrap">
                            {kehadiran.permissionCount}
                          </td>
                          <td className="px-6 py-4 text-gray-700 capitalize whitespace-nowrap">
                            {kehadiran.totalMasuk}
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        Tidak ada data yang ditampilkan
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>
            <Pagination
              className="mt-5"
              layout="table"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              showIcons
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Kehadiran;
