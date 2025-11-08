import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AttedenseMemberListLayer from "../components/AttedenseMemberListLayer";


const AttedenseMemberListPage = () => {
    return (
        <>

            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Attendance List" name="Payments" />

                {/* UsersListLayer */}
                <AttedenseMemberListLayer />

            </MasterLayout>

        </>
    );
};

export default AttedenseMemberListPage;
