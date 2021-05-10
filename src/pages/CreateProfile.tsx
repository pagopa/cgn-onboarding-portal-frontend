import React, { useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../components/Layout/Layout";
import Stepper from "../components/Stepper/Stepper";
import Step from "../components/Stepper/Step";
import Documentation from "../components/Form/CreateProfileForm/Documentation/Documentation";
import ProfileData from "../components/Form/CreateProfileForm/ProfileData/ProfileData";
import DiscountData from "../components/Form/CreateProfileForm/DiscountData/DiscountData";
import Documents from "../components/Form/CreateProfileForm/Documents";
import { RootState } from "../store/store";

const EditProfile = () => {
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const [step, setStep] = useState(agreement.completedSteps?.length);
  const [completedSteps, setCompletedSteps] = useState<Array<number>>(
    Array.from(Array(agreement.completedSteps?.length).keys())
  );

  const handleSuccess = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  const selectedTab = () => {
    switch (step) {
      case 0:
        return (
          <Documentation
            isCompleted={completedSteps.includes(0)}
            handleSuccess={() => handleSuccess(0)}
            handleNext={() => setStep(1)}
          />
        );
      case 1:
        return (
          <ProfileData
            isCompleted={completedSteps.includes(1)}
            handleSuccess={() => handleSuccess(1)}
            handleBack={() => setStep(0)}
            handleNext={() => setStep(2)}
          />
        );
      case 2:
        return (
          <DiscountData
            isCompleted={completedSteps.includes(2)}
            handleSuccess={() => handleSuccess(2)}
            handleBack={() => setStep(1)}
            handleNext={() => setStep(3)}
          />
        );
      case 3:
        return (
          <Documents
            isCompleted={completedSteps.includes(3)}
            handleSuccess={() => handleSuccess(3)}
            handleBack={() => setStep(2)}
          />
        );
    }
  };

  return (
    <Layout hasHeaderBorder>
      <div className="bg-white">
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
