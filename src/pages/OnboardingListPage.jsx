import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import OnboardingListLayer from "../components/OnboardingListLayer";

const OnboardingListPage = () => {
    return (
        <>
            <MasterLayout>
                <Breadcrumb title="Onboarding Form" name="Training" />
                <OnboardingListLayer />
            </MasterLayout>
        </>
    );
};

export default OnboardingListPage;
