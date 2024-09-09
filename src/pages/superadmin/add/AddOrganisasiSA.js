import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../../../components/NavbarSuper";
import Sidebar from "../../../components/SidebarUser";
import { faArrowLeft, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Swal from "sweetalert2";
import { API_DUMMY } from "../../../utils/api";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
function AddOrganisasiSA() {
  const [emailOrganisasi, setEmailOrganisasi] = useState("");
  const [namaOrganisasi, setnamaorganisasi] = useState("");
  const [alamat, setAlamat] = useState("");
  const [nomerTelepon, setNomerTelepon] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [kabupaten, setKabupaten] = useState("");
  const [provinsi, setProvinsi] = useState("");
  const idSuperAdmin = localStorage.getItem("superadminId");
  const [, setOrganisasiList] = useState([]);
  const [adminList, setAdminList] = useState([]);
  const [idAdmin, setAdminId] = useState("");

  const GetALLAdmin = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_DUMMY}/api/admin/get-all-by-super/${idSuperAdmin}`
      );
      setAdminList(response.data);
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Gagal mendapatkan data admin", "error");
    }
  }, [idSuperAdmin]); // idSuperAdmin is a dependency

  const GetALLOrganisasi = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_DUMMY}/api/admin/get-all-by-super/${idSuperAdmin}`
      );

      setOrganisasiList(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [idSuperAdmin]); // idSuperAdmin is a dependency
  const tambahAdmin = async (e) => {
    e.preventDefault();
    try {
      const organisasi = {
        namaOrganisasi: namaOrganisasi,
        alamat: alamat,
        kecamatan: kecamatan,
        kabupaten: kabupaten,
        provinsi: provinsi,
        nomerTelepon: nomerTelepon,
        emailOrganisasi: emailOrganisasi,
      };

      await axios.post(
        `${API_DUMMY}/api/organisasi/tambahByIdSuperAdmin/${idSuperAdmin}?idAdmin=${idAdmin}`,
        organisasi
      );
      Swal.fire("Berhasil", "Berhasil menambahkan data", "success");
      window.location.href = "/superadmin/organisasi";
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Gagal menambahkan data", "error");
    }
  };

  useEffect(() => {
    GetALLOrganisasi();
    GetALLAdmin();
  }, [GetALLAdmin, GetALLOrganisasi]);
  return (
    <div className="flex flex-col h-screen">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="flex h-full">
        <div className="fixed">
          <Sidebar />
        </div>
      </div>
      <div className=" sm:ml-64 content-page p-8  ml-14 md:ml-64 mb-12">
        <div className="p-4">
          <div className="p-5">
            {/* // <!-- Card --> */}
            <div className="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
              {/* <!-- Header --> */}
              <div className="flex justify-between">
                <h6 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                  Tambah Organisasi
                </h6>
              </div>

              <hr />

              <div className="mt-5 text-left">
                {/* <!-- Form Input --> */}
                <form
                  onSubmit={tambahAdmin}
                  action="https://demo-absen.excellentsistem.com/superadmin/aksi_tambah_organisasi"
                  method="post"
                  encType="multipart/form-data"
                >
                  <div className="grid md:grid-cols-2 md:gap-6">
                    {/* <!-- Organisasi Input --> */}
                    <div className="relative z-0 w-full mb-6 group">
                      <input
                        type="text"
                        name="nama_organisasi"
                        id="nama_organisasi"
                        value={namaOrganisasi}
                        onChange={(e) => setnamaorganisasi(e.target.value)}
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        autoComplete="off"
                        required
                      />
                      <label
                        htmlFor="nama_organisasi"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Nama Organisasi
                      </label>
                    </div>

                    {/* <!-- Alamat Input --> */}
                    <div className="relative z-0 w-full mb-6 group">
                      <input
                        type="text"
                        name="alamat"
                        id="alamat"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        autoComplete="off"
                        required
                        value={alamat}
                        onChange={(e) => setAlamat(e.target.value)}
                      />
                      <label
                        htmlFor="alamat"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Alamat
                      </label>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 md:gap-6">
                    {/* <!-- No Telepon Input --> */}
                    <div className="relative z-0 w-full mb-6 group">
                      <input
                        type="text"
                        name="nomor_telepon"
                        id="nomor_telepon"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        autoComplete="off"
                        required
                        value={nomerTelepon}
                        onChange={(e) => setNomerTelepon(e.target.value)}
                      />
                      <label
                        htmlFor="nomor_telepon"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        No Telepon
                      </label>
                    </div>

                    {/* <!-- Email Input --> */}
                    <div className="relative z-0 w-full mb-6 group">
                      <input
                        type="email"
                        name="email_organisasi"
                        id="email_organisasi"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        autoComplete="off"
                        required
                        value={emailOrganisasi}
                        onChange={(e) => setEmailOrganisasi(e.target.value)}
                      />
                      <label
                        htmlFor="email_organisasi"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Email
                      </label>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 md:gap-6">
                    {/* <!-- Kecamatan Input --> */}
                    <div className="relative z-0 w-full mb-6 group">
                      <input
                        type="text"
                        name="kecamatan"
                        id="kecamatan"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        autoComplete="off"
                        required
                        value={kecamatan}
                        onChange={(e) => setKecamatan(e.target.value)}
                      />
                      <label
                        htmlFor="kecamatan"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Kecamatan
                      </label>
                    </div>

                    {/* <!-- Kabupaten Input --> */}
                    <div className="relative z-0 w-full mb-6 group">
                      <input
                        type="text"
                        name="kabupaten"
                        id="kabupaten"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        autoComplete="off"
                        required
                        value={kabupaten}
                        onChange={(e) => setKabupaten(e.target.value)}
                      />
                      <label
                        htmlFor="kabupaten"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Kabupaten
                      </label>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 md:gap-6">
                    {/* <!-- Provinsi Input --> */}
                    <div className="relative z-0 w-full mb-6 group">
                      <input
                        type="text"
                        name="provinsi"
                        id="provinsi"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        autoComplete="off"
                        required
                        value={provinsi}
                        onChange={(e) => setProvinsi(e.target.value)}
                      />
                      <label
                        htmlFor="provinsi"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Provinsi
                      </label>
                    </div>

                    {/* <!-- Admin Input --> */}
                    <div className="relative z-0 w-full mb-6 group">
                      <select
                        id="id_admin"
                        name="id_admin"
                        value={idAdmin} // Controlled by React state
                        className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                        onChange={(e) => setAdminId(e.target.value)}
                        required
                      >
                        <option value="" disabled>
                          Pilih Admin
                        </option>
                        {adminList &&
                          adminList
                            .slice()
                            .reverse()
                            .map((admin) => (
                              <option key={admin.id} value={admin.id}>
                                {admin.username}
                              </option>
                            ))}
                      </select>
                    </div>
                  </div>

                  {/* <!-- Button --> */}
                  <div className="flex justify-between">
                    <Link
                      to="superadmin/organisasi"
                      className="focus:outline-none text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                    >
                      <FontAwesomeIcon icon={faArrowLeft} />
                    </Link>
                    <button
                      type="submit"
                      className="text-white bg-indigo-500 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800"
                    >
                      <FontAwesomeIcon icon={faFloppyDisk} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddOrganisasiSA;
