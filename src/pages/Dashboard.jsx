import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DashBoardLayer from "../components/DashBoardLayer";

const DashboardPage = () => {
  return (
    <>
      <MasterLayout>
        <DashBoardLayer />
      </MasterLayout>
    </>
  );
};

export default DashboardPage;
