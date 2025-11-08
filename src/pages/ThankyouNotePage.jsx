import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";

import ThankyouNoteLayer from "../components/child/ThankyouNoteLayer";

const ThankyouNotePage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Thank you Slip" name="Performance" />

        {/* RoleAccessLayer */}
        <ThankyouNoteLayer />

      </MasterLayout>

    </>
  );
};

export default ThankyouNotePage;
