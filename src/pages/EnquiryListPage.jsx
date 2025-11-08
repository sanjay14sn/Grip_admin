import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";

import EnquiryListLayer from "../components/EnquiryListLayer";


const EnquiryListPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
      <Breadcrumb title="Enquiries" name="Enquiry Management" />

        {/* UsersListLayer */}
        <EnquiryListLayer />

      </MasterLayout>

    </>
  );
};

export default EnquiryListPage;
