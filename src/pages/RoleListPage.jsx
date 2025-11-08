import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import RoleEditLayer from "../components/RoleEditLayer";


const RoleListPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
     <Breadcrumb title="Role" name="User Management" />

        {/* UsersListLayer */}
        <RoleEditLayer />

      </MasterLayout>

    </>
  );
};

export default RoleListPage;
