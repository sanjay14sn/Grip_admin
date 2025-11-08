import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";

import ThankyouOverallLayer from "../components/ThankyouOverallLayer";

const ThankyouOverallPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Thankyou Slip" name="Performance" />

        {/* RoleAccessLayer */}
        <ThankyouOverallLayer />

      </MasterLayout>

    </>
  );
};

export default ThankyouOverallPage;
