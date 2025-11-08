import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";

import PaymentListLayer from "../components/PaymentListLayer";


const PaymentListPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Meetings List" name="Meetings" />

        {/* UsersListLayer */}
        <PaymentListLayer />

      </MasterLayout>

    </>
  );
};

export default PaymentListPage;
