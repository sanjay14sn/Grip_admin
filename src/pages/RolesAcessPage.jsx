import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";

import RoleNewAccessLayer from "../components/RoleNewAccessLayer";


const RoleAcessPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        {/* <Breadcrumb title="Users Grid" /> */}

        {/* UsersListLayer */}
        <RoleNewAccessLayer />

      </MasterLayout>

    </>
  );
};

export default RoleAcessPage;
