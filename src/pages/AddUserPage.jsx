import React from "react";
import { useParams } from "react-router-dom";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddUserLayer from "../components/AddUserLayer";

const AddUserPage = () => {
  const { id } = useParams();

  return (
    <>
    <MasterLayout>
      <Breadcrumb title={id ? "Edit User" : "Add User"} />
      <AddUserLayer />
    </MasterLayout>
    </>
  );
};

export default AddUserPage;
