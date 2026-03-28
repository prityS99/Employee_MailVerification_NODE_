"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import api from "../../lib/axios";
import { useDispatch, useSelector } from "react-redux"; 
import { AppDispatch, RootState } from "@/Hooks/Redux/store";
import { logoutThunk } from "@/Hooks/Redux/Slices/authSlice";

export default function AdminDashboard() {
 const dispatch = useDispatch<AppDispatch>()
  const router = useRouter();     
  const [employees, setEmployees] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const validateToken = async () => {
      try {
        await api.get("/api/dashboard");
      } catch (error) {
        dispatch(logoutThunk()); 
        router.push("/login");
      }
    };
    if (!user) validateToken();
  }, [dispatch, router, user]); 

  // Fetch employees //
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/employee");
        setEmployees(res.data.data || []);
      } catch (error) {
        toast.error("Failed to load employees");
      }
    };
    fetchEmployees();
  }, []);

  // Add Employee //
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    const addToast = toast.loading("Creating employee...");
    setLoading(true);

    try {
      const res = await api.post("/create-employee", formData);
      toast.dismiss(addToast);
      toast.success("Employee created successfully!", {
        description: "Credentials sent to their email.",
      });

      setEmployees((prev) => [...prev, res.data.data]);
      setIsModalOpen(false);
      setFormData({ name: "", email: "" });
    } catch (error) {
      toast.dismiss(addToast);
      toast.error("Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  // Delete Employee //
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this employee permanently?")) return;

    const deleteToast = toast.loading("Deleting employee...");
    try {
      await api.delete(`/delete-employee/${id}`);
      toast.dismiss(deleteToast);
      toast.success("Employee deleted successfully!", {
        description: "Removed from organization.",
        duration: 3000,
      });
      setEmployees((prev) => prev.filter((e) => e._id !== id));
    } catch (error) {
      toast.dismiss(deleteToast);
      toast.error("Failed to delete employee");
      console.error("Delete error:", error);
    }
  };

  // Reset Password by ID //
  const handleChangePassword = async (id: string) => {
    if (!confirm("Reset this employee's password?")) return;

    const resetToast = toast.loading("Resetting password...");
    try {
    
      const employee = employees.find(emp => emp._id === id);
      const res = await api.post(`/change-password-by-email`, {
        email: employee?.email
      });

      toast.dismiss(resetToast);
      toast.success(res.data.message || "Password reset & sent!");
    } catch (error) {
      toast.dismiss(resetToast);
      toast.error("Failed to reset password");
    }
  };


  return (
    <div className="p-6 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Welcome, <span className="text-blue-600">{user?.name || "Admin"}</span>
          </h2>
          <p className="text-slate-500 text-sm">Manage your organization's team members.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-black font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
        >
          <span className="text-lg">+</span> Add Employee
        </button>
      </div>

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Create Employee</h3>
            <p className="text-slate-500 text-sm mb-6">Auto-generates password & sends to email.</p>
            <form onSubmit={handleAddEmployee} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text" required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email" required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={loading}
                  className="flex-1 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-blue-600 text-black font-semibold rounded-xl hover:bg-blue-700 shadow-md transition-all disabled:bg-blue-400"
                >
                  {loading ? "Creating..." : "Create Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employees Grid */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4 text-slate-700">
          All Employees ({employees.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {employees.length === 0 ? (
            <p className="text-slate-400 italic col-span-full">No employees found.</p>
          ) : (
            employees.map((emp) => (
              <div key={emp._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold text-lg">
                      {emp.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-base">{emp.name}</p>
                      <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
                        {emp.role}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-slate-600">
                    <p className="truncate">
                      <span className="font-medium text-slate-700">Email:</span> {emp.email}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      console.log("🆔 emp._id:", emp._id, typeof emp._id)
                      handleChangePassword(emp._id)
                    }}
                    className="flex-1 px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                  >
                    Reset Password
                  </button>
                  <button
                    onClick={() => handleDelete(emp._id)}
                    className="flex-1 px-3 py-2 text-xs bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

