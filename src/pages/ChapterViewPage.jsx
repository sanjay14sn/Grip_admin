import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";

import ChapterViewLayer from "../components/ChapterViewLayer";

const ChapterViewPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        {/* <Breadcrumb title="Chapter" /> */}

        {/* RoleAccessLayer */}
        <ChapterViewLayer />

      </MasterLayout>

    </>
  );
};

export default ChapterViewPage;
