// "use client";

// import { useSelector } from "react-redux";
// import { RootState } from "@/Hooks/Redux/store";
// import EmployeeDashboard from "./EmployeeDashboard";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import AdminDashboard from "./AdminDashboard";
// import { LogIn } from "lucide-react";

// export default function Dashboard() {
//   const router = useRouter();

//   const { user, isAuthenticated } = useSelector(
//     (state: RootState) => state.auth
//   );


//   useEffect(() => {
//     if (user?.isFirstLogin) {
//       router.push("/change-password");
//     }
//   }, [user, router]);
//   if (!isAuthenticated) return <div></div>;
//   if (!user) return <div>Loading user...</div>;

//   return (
//     <div className="p-6">
//       <header className="mb-6"></header>

//       {user.role === "admin" ? (
//         <AdminDashboard />
//       ) : (
//         <EmployeeDashboard employeeId={user.id} />
//       )}
//     </div>
//   );
// }


"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/Hooks/Redux/store";
import EmployeeDashboard from "./EmployeeDashboard";
import { useRouter } from "next/navigation";
import AdminDashboard from "./AdminDashboard";
import { useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // First‑login redirect
  useEffect(() => {
    if (!isAuthenticated) return;
    if (user?.isFirstLogin) {
      router.push("/change-password");
    }
  }, [isAuthenticated, user, router]);

  // If not logged in, show nothing (or a loader)
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-slate-500">Redirecting to login...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-slate-500">Loading user...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          {user.role === "admin" ? "Admin Dashboard" : "Employee Dashboard"}
        </h1>
        <p className="text-sm text-slate-500">
          Role: <span className="font-semibold capitalize">{user.role}</span>
        </p>
      </header>

      {/* Show AdminDashboard for admin, EmployeeDashboard for employee */}
      {user.role === "admin" ? (
        <AdminDashboard />
      ) : (
        <EmployeeDashboard employeeId={user._id} />
      )}
    </div>
  );
}
