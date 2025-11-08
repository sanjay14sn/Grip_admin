import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";

import VisitorsListLayer from "../components/child/VisitorsListLayer";

const VisitorsListPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Visitors List" name="Performance" />

        {/* RoleAccessLayer */}
        <VisitorsListLayer />

      </MasterLayout>

    </>
  );
};

export default VisitorsListPage;
