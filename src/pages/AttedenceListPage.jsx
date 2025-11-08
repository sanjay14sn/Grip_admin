import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EventListLayer from "../components/AttedenceListPageLayer";


const AttedenceListPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Event List" name="Events" />

        {/* UsersListLayer */}
        <EventListLayer/>

      </MasterLayout>

    </>
  );
};

export default AttedenceListPage;
