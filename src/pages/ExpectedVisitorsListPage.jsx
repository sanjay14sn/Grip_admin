import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";

import ExpectedVisitorsListLayer from "../components/child/ExpectedVisitorsListLayer";

const ExpectedVisitorsListPage = () => {
  return (
    <>
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Expected Visitors" name="Performance" />

        {/* Expected Visitors Layer */}
        <ExpectedVisitorsListLayer />
      </MasterLayout>
    </>
  );
};

export default ExpectedVisitorsListPage;

