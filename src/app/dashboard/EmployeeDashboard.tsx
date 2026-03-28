"use client";

import { useState, useEffect } from "react";
import api from "../../lib/axios"; 
import { useSelector } from "react-redux";
import { RootState } from "@/Hooks/Redux/store";

export default function EmployeeDashboard({ employeeId }: { employeeId: string }) {
  const [records, setRecords] = useState<any[]>([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);

  // FIRST LOGIN //
  useEffect(() => {
    if (user?.isFirstLogin) {
      setShowPasswordModal(true);
    }
  }, [user]);

  // Records //
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await api.get(`/records?employeeId=${employeeId}`);
        setRecords(res.data);
      } catch (err) {
        console.error("Failed to load records:", err);
      }
    };
    fetchRecords();
  }, [employeeId]);


  // PASSWORD //
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      return alert("Passwords do not match!");
    }

    if (!user?._id) {
      return alert("User ID not found. Please log in again.");
    }

    setLoading(true);
    try {

      const res = await api.post(`/reset-password/${user._id}`, {
        newPassword: passwords.newPassword,
      });
    alert(res.data.message || "Password updated successfully!");
setShowPasswordModal(false);
setPasswords({ newPassword: "", confirmPassword: "" });


    } catch (err: any) {
      console.error("Reset Error:", err.response?.data);
      alert(err.response?.data?.message || "Update failed - check console");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-blue-100">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🔒
              </div>
              <h3 className="text-2xl font-bold text-slate-800">
                {user?.isFirstLogin ? "Secure Your Account" : "Update Password"}
              </h3>
              <p className="text-slate-500 text-sm mt-2">
                {user?.isFirstLogin 
                  ? "This is your first login. Please set a new password to continue."
                  : "Enter your new password below."}
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input 
                type="password" required
                placeholder="New Password"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
              />
              <input 
                type="password" required
                placeholder="Confirm New Password"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
              />
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-black font-bold rounded-xl hover:bg-blue-700 transition-all disabled:bg-blue-400"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Your Records</h2>
          <p className="text-sm text-slate-500 mt-1">Track assigned tasks and progress.</p>
        </div>
      
        {!user?.isFirstLogin && (
            <button 
                onClick={() => setShowPasswordModal(true)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 underline"
            >
                Change Password
            </button>
        )}
      </div>

      {/* Records Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {records.length === 0 ? (
          <p className="text-slate-500">No records found.</p>
        ) : (
          records.map((record) => (
            <div key={record._id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
              <h3 className="text-lg font-semibold text-slate-800 mb-1">{record.title}</h3>
              <p className="text-sm text-slate-500 mb-3">{record.description}</p>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-100">{record.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}