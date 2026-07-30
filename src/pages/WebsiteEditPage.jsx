import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import WebsiteEditLayer from "../components/WebsiteEditLayer";

const WebsiteEditPage = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="Edit Website" name="Website" />
      <WebsiteEditLayer />
    </MasterLayout>
  );
};

export default WebsiteEditPage;
