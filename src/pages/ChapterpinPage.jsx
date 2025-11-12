import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ChapterPinLayer from "../components/ChapterPinLayer";


const ChapterwisePage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
         <Breadcrumb title="Pins" name="Performance" />

        {/* PinAccessLayer */}
        <ChapterPinLayer />

      </MasterLayout>

    </>
  );
};

export default ChapterwisePage;
