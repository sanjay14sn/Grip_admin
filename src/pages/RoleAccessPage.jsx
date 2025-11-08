import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ChapterAccessLayer from "../components/RoleAccessLayer";

const RoleAccessPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
     <Breadcrumb title="Chapters" name="Chapter" />

        {/* RoleAccessLayer */}
        <ChapterAccessLayer />

      </MasterLayout>

    </>
  );
};

export default RoleAccessPage;
