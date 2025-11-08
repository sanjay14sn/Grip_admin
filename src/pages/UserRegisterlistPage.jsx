import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";

import MemberListLayer from "../components/UserRegisterListLayer";


const UserRigisterMemberListPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Associators" name="Associate" />

        {/* UsersListLayer */}
        <MemberListLayer /> 

      </MasterLayout>

    </>
  );
};

export default UserRigisterMemberListPage;
