import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";

import ReferralOverallLayer from "../components/ReferralOverallLayer";

const ReferralOverallpage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
       <Breadcrumb title="Referral's" name="Performance" />

        {/* RoleAccessLayer */}
        <ReferralOverallLayer />

      </MasterLayout>

    </>
  );
};

export default ReferralOverallpage;
