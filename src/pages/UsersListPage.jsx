import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import UsersListLayer from "../components/UsersListLayer";


const UsersListPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
      <Breadcrumb title="Admin Users" name="User Management" />

        {/* UsersListLayer */}
        <UsersListLayer />

      </MasterLayout>

    </>
  );
};

export default UsersListPage;
