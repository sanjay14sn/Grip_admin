import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import PinEditLayer from "../components/PinEditLayer";

const PinListPage = () => {
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
