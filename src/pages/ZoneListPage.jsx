import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ZoneListLayer from "../components/ZoneListLayer";

const ZoneListPage = () => {
  return (
    <>
      <MasterLayout>
        <Breadcrumb title="Zone Details" name="Zone Management" />
        <ZoneListLayer />
      </MasterLayout>
    </>
  );
};

export default ZoneListPage;
