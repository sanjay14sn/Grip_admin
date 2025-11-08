import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import AddPrimaryMemberLayer from "../components/AddPrimaryMemberLayer";
// import FormValidationLayer from "../components/FormValidationLayer";

const FormValidationPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        <AddPrimaryMemberLayer />
        {/* <FormValidationLayer /> */}
      </MasterLayout>
    </>
  );
};

export default FormValidationPage;
