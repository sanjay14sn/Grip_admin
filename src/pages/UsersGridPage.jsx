import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import UsersGridLayer from "../components/UsersGridLayer";


const UsersGridPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Associate Profile" name="Members" />

        {/* UsersGridLayer */}
        <UsersGridLayer />

      </MasterLayout>

    </>
  );
};

export default UsersGridPage;
