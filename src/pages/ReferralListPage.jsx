import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";

import ReferralListLayer from "../components/child/ReferralListLayer";

const ReferralListPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
          <Breadcrumb title="Referral List" name="Performance" />

        {/* RoleAccessLayer */}
        <ReferralListLayer />

      </MasterLayout>

    </>
  );
};

export default ReferralListPage;
