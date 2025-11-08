import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";


import TransactionListLayer from "../components/TransactionListLayer";


const TransactionListPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Transaction List" name="Payments" />

        {/* UsersListLayer */}
        <TransactionListLayer />

      </MasterLayout>

    </>
  );
};

export default TransactionListPage;
