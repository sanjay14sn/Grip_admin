import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AssociatePerformanceLayer from "../components/AssociatePerformanceLayer";

const AssociatePerformancePage = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="Associate Performance" />
      <AssociatePerformanceLayer />
    </MasterLayout>
  );
};

export default AssociatePerformancePage;
