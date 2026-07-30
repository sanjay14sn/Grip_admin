import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import WebsiteEventsLayer from "../components/WebsiteEventsLayer";

const WebsiteEventsPage = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="Website Events" name="Website" />
      <WebsiteEventsLayer />
    </MasterLayout>
  );
};

export default WebsiteEventsPage;
