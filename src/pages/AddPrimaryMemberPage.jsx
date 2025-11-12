import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
// import Breadcrumb from "../components/Breadcrumb";
import AddPrimaryMemberLayer from "../components/AddPrimaryMemberLayer";

const AddPrimaryMemberPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb title="Chapter" /> */}

        {/* RoleAccessLayer */}
        <AddPrimaryMemberLayer />
      </MasterLayout>
    </>
  );
};

export default AddPrimaryMemberPage;
