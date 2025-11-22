import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";

import ExpectedVisitorsOverallLayer from "../components/ExpectedVistorsOverallLayer"

const ExpectedVisitorsPage = () => {
  return (
    <>
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Expected Visitors" name="Performance" />

        {/* Expected Visitors Layer */}
        <ExpectedVisitorsOverallLayer />
      </MasterLayout>
    </>
  );
};

export default ExpectedVisitorsPage;

