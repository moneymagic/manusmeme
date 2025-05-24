
import React from "react";
import Layout from "@/components/Layout";
import DashboardBalance from "./DashboardBalance";
import DashboardContent from "./DashboardContent";

interface DashboardLayoutProps {
  balance: number;
  isActive: boolean;
  isLoading: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  balance, 
  isActive,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-4">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-center items-center h-64">
              <p className="text-white text-xl">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-4">
        <div className="container mx-auto px-6 py-8">
          {/* Saldo e métricas */}
          <DashboardBalance balance={balance} />

          {/* Dashboard Content */}
          <DashboardContent isActive={isActive} />
        </div>
      </div>
    </Layout>
  );
};

export default DashboardLayout;
