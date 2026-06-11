import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import PinEditLayer from "../components/PinEditLayer";
import { getCurrentUser } from "../utils/auth";
import { Navigate } from "react-router-dom";

const PinListPage = () => {
  const user = getCurrentUser()?.data;
  const isAdmin = user?.role?.name?.toLowerCase() === "admin" || user?.role?.name?.toLowerCase() === "super admin" || user?.role?.name?.toLowerCase() === "super-admin";

  if (!isAdmin) {
    return <Navigate to="/access-denied" replace />;
  }

  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Pin Details" name="Pin Management" />

        {/* PinsListLayer */}
        <PinEditLayer />
      </MasterLayout>
    </>
  );
};

export default PinListPage;
