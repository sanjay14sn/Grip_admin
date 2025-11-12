import React from "react";
import { useParams } from "react-router-dom";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddPinLayer from "../components/AddPinLayer";

const AddPinPage = () => {
  const { id } = useParams();

  return (
    <>
    <MasterLayout>
      <Breadcrumb title={id ? "Edit User" : "Add Pin"} />
      <AddPinLayer />
    </MasterLayout>
    </>
  );
};

export default AddPinPage;
