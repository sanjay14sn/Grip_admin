import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";


import TestimonialOverallLayer from "../components/TestimonialOverallLayer";

const TestimonialOverallPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Testimonial" name="Performance" />

        {/* RoleAccessLayer */}
        <TestimonialOverallLayer />

      </MasterLayout>

    </>
  );
};

export default TestimonialOverallPage;
