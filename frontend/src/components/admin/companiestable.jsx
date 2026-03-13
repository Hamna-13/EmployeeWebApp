import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CompaniesTable() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/companies", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompanies(res.data.companies);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/companies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies(companies.filter(c => c._id !== id));
    } catch (error) {
      console.error("Failed to delete company:", error);
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(companies.length / itemsPerPage);
  const paginatedCompanies = companies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white px-4 pt-4 pb-4 rounded-sm border border-gray-200">
        <h1 className="text-gray-800 text-xl font-bold mb-4">Companies</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">Company Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Registered On</th>
                    <th className="px-4 py-2 text-right"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCompanies.length === 0 ? (
                    <tr>
                      <td className="px-4 py-2" colSpan={4}>
                        No companies found.
                      </td>
                    </tr>
                  ) : (
                    paginatedCompanies.map((company) => (
                      <tr key={company._id} className="border hover:bg-gray-50">
                        <td className="px-4 py-2">{company.companyName}</td>
                        <td className="px-4 py-2">{company.email}</td>
                        <td className="px-4 py-2">
                          {new Date(company.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 space-x-2 text-right">
                          <button
                            onClick={() => navigate(`/admin/company/${company._id}`)}
                            className="w-28 px-4 py-2 rounded bg-sky-600 text-white hover:bg-sky-700"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleDelete(company._id)}
                            className="w-28 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-end items-center mt-4 gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1 ? "bg-sky-600 text-white" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
