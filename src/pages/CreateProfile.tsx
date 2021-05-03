import React, { useState } from "react";
import { useHistory } from "react-router";
import { DASHBOARD } from "../navigation/routes";
import Layout from "../components/Layout/Layout";
import Stepper from "../components/Stepper/Stepper";
import Step from "../components/Stepper/Step";
import Documentation from "../components/Form/CreateProfileForm/Documentation";
import ProfileData from "../components/Form/CreateProfileForm/ProfileData/ProfileData";
import DiscountData from "../components/Form/CreateProfileForm/DiscountData/DiscountData";
import Documents from "../components/Form/CreateProfileForm/Documents";

const EditProfile = () => {
  const history = useHistory();
  const [step, setStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Array<number>>([]);

  const handleSuccess = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  const handleComplete = () => {
    history.push(DASHBOARD);
  };

  const selectedTab = () => {
    switch (step) {
      case 0:
        return (
          <Documentation
            handleSuccess={() => handleSuccess(0)}
            handleNext={() => setStep(1)}
          />
        );
      case 1:
        return (
          <ProfileData
            handleSuccess={() => handleSuccess(1)}
            handleBack={() => setStep(0)}
            handleNext={() => setStep(2)}
          />
        );
      case 2:
        return (
          <DiscountData
            handleSuccess={() => handleSuccess(2)}
            handleBack={() => setStep(1)}
            handleNext={() => setStep(3)}
          />
        );
      case 3:
        return (
          <Documents
            handleComplete={handleComplete}
            handleBack={() => setStep(2)}
          />
        );
    }
  };

  return (
    <Layout>
      <div className="container-fluid bg-white">
        <div className="container p-10">
          <h1 className="h5 text-gray">Carta Giovani Nazionale</h1>
          <h2 className="h2 text-dark-blue font-weight-bold">
            Portale Operatori
          </h2>
        </div>
        <Stepper
          activeStep={step}
          completedSteps={completedSteps}
          handleChangeStep={setStep}
        >
          <Step>Documentazione</Step>
          <Step>Dati operatore</Step>
          <Step>Dati agevolazione</Step>
          <Step>Documenti</Step>
        </Stepper>
      </div>
      {selectedTab()}
    </Layout>
  );
};

export default EditProfile;
