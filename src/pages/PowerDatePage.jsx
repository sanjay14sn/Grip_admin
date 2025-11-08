import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";

import PowerDateLayer from "../components/child/PowerDateLayer";

const PowerDatePage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Power Date" name="Performance" />

        {/* RoleAccessLayer */}
        <PowerDateLayer />

      </MasterLayout>

    </>
  );
};

export default PowerDatePage;
