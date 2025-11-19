import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";

import ExpectedVisitorsLayer from "../components/ExpectedVisitorsLayer";

const ExpectedVisitorsPage = () => {
  return (
    <>
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Expected Visitors" name="Performance" />

        {/* Expected Visitors Layer */}
        <ExpectedVisitorsLayer />
      </MasterLayout>
    </>
  );
};

export default ExpectedVisitorsPage;

