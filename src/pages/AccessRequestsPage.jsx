import React from 'react';
import MasterLayout from '../masterLayout/MasterLayout';
import Breadcrumb from '../components/Breadcrumb';
import AccessRequestsLayer from '../components/AccessRequestsLayer';

const AccessRequestsPage = () => {
  return (
    <>
      <MasterLayout>
        <Breadcrumb title="Access Requests" name="User Management" />
        <AccessRequestsLayer />
      </MasterLayout>
    </>
  );
};

export default AccessRequestsPage;
