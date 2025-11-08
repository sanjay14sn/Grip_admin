import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";


import VisitorOverallLayer from "../components/VisitorOverallLayer";

const VisitorOverallpage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Visitor / Guest" name="Performance" />

        {/* RoleAccessLayer */}
        <VisitorOverallLayer />

      </MasterLayout>

    </>
  );
};

export default VisitorOverallpage;
