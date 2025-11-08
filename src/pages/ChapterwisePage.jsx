import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ChapterWiseLayer from "../components/ChapterWiseLayer";

const ChapterwisePage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
         <Breadcrumb title="Chapter Report" name="Performance" />

        {/* RoleAccessLayer */}
        <ChapterWiseLayer />

      </MasterLayout>

    </>
  );
};

export default ChapterwisePage;
