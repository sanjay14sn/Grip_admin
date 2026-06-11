import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ZoneListLayer from "../components/ZoneListLayer";
import { getCurrentUser } from "../utils/auth";
import { Navigate } from "react-router-dom";

const ZoneListPage = () => {
  const user = getCurrentUser()?.data;
  const isAdmin = user?.role?.name?.toLowerCase() === "admin" || user?.role?.name?.toLowerCase() === "super admin" || user?.role?.name?.toLowerCase() === "super-admin";

  if (!isAdmin) {
    return <Navigate to="/access-denied" replace />;
  }

  return (
    <>
      <MasterLayout>
        <Breadcrumb title="Zone Details" name="Zone Management" />
        <ZoneListLayer />
      </MasterLayout>
    </>
  );
};

export default ZoneListPage;
