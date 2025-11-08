import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";


import TestimonialLayer from "../components/TestimonialLayer";

const TestimonialPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Testimonial" name="Performance" />

        {/* RoleAccessLayer */}
        <TestimonialLayer />

      </MasterLayout>

    </>
  );
};

export default TestimonialPage;
