"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Hooks/Redux/store";
import { fetchEmployeesThunk } from "@/Hooks/Redux/Slices/employeeSlice";
import { useRouter } from "next/navigation";

export default function EmployeeCard() {
  const dispatch = useDispatch<any>();
  const router = useRouter();

  const { user } = useSelector((state: RootState) => state.auth);
  const { employees, loading } = useSelector(
    (state: RootState) => state.employee
  );

  useEffect(() => {
    dispatch(fetchEmployeesThunk());
  }, [dispatch]);

  // Use current user if no employees loaded
  const currentEmployee = employees.length > 0 ? employees[0] : user;

  if (loading || !currentEmployee) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-8 flex items-center justify-center">
      <div className="max-w-sm w-full bg-white rounded-3xl shadow-2xl border border-slate-100 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
        {/* Card Header with Avatar */}
        <div className="p-8 text-center border-b border-slate-100">
          {/* Avatar */}
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 p-1">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-black text-2xl text-indigo-600">
                {currentEmployee.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            
            {/* Online Status */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 border-4 border-white rounded-full"></div>
          </div>

          {/* Name & Role */}
          <h2 className="text-3xl font-black bg-gradient-to-r from-gray-900 to-slate-700 bg-clip-text text-transparent mb-2">
            {currentEmployee.name}
          </h2>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-800 text-sm font-bold rounded-full mb-4">
            <span>👤</span>
            <span>{user?.role || 'employee'}</span>
          </div>

          {/* Email */}
          <p className="text-slate-500 text-lg mb-1">{currentEmployee.email}</p>
          
          {/* Record Count */}
          <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">
            Active Employee
          </div>
        </div>

        {/* Action Button */}
        <div className="p-8 pt-0">
          <button
            onClick={() => router.push('/changepassword')}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-lg py-6 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">📋</span>
         Change Password
            <span className="ml-2 w-6 h-6 bg-white/20 rounded-full group-hover:bg-white/30 transition-all"></span>
          </button>
        </div>
      </div>
    </div>
  );
}
