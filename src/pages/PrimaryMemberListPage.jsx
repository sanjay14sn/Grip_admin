import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";

import PrimaryMemberListLayer from "../components/PrimaryMemberListLayer";


const PrimaryMemberListPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
         <Breadcrumb title="Panel Associate" name="User Management" />

        {/* UsersListLayer */}
        <PrimaryMemberListLayer/>

      </MasterLayout>

    </>
  );
};

export default PrimaryMemberListPage;
