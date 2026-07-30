import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import WebsiteLayer from "../components/WebsiteLayer";

const WebsitePage = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="Website" name="Website" />
      <WebsiteLayer />
    </MasterLayout>
  );
};

export default WebsitePage;
