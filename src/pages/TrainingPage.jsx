import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import TrainingLayer from "../components/TrainingListLayer";



const TrainingListPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Training List" name="Training" />

        {/* UsersListLayer */}
        <TrainingLayer/>

      </MasterLayout>

    </>
  );
};

export default TrainingListPage;
