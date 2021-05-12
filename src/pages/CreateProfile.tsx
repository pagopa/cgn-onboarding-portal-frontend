import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Layout from "../components/Layout/Layout";
import Stepper from "../components/Stepper/Stepper";
import Documentation from "../components/Form/CreateProfileForm/Documentation/Documentation";
import ProfileData from "../components/Form/CreateProfileForm/ProfileData/ProfileData";
import DiscountData from "../components/Form/CreateProfileForm/DiscountData/DiscountData";
import Documents from "../components/Form/CreateProfileForm/Documents";
import { RootState } from "../store/store";
import { CompletedStep } from "../api/generated";

const CreateProfile = () => {
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const [step, setStep] = useState<number>(agreement.completedSteps.length);
  const [completedSteps, setCompletedSteps] = useState<Array<string>>(
    agreement.completedSteps
  );

  const handleNext = (step: number, key?: string) => {
    if (key && !completedSteps.includes(key)) {
      setCompletedSteps([...completedSteps, key]);
    }
    setStep(step);
  };

  useEffect(() => {
    if (agreement.completedSteps.includes(CompletedStep.Profile)) {
      setCompletedSteps([...completedSteps, "Documentation"]);
      setStep(step + 1);
    }
  }, []);

  const selectedTab = () => {
    switch (step) {
      case 0:
        return (
          <Documentation
            isCompleted={completedSteps.includes("Documentation")}
            handleNext={() => handleNext(1, "Documentation")}
          />
        );
      case 1:
        return (
          <ProfileData
            isCompleted={completedSteps.includes("Profile")}
            handleNext={() => handleNext(2, "Profile")}
            handleBack={() => setStep(0)}
          />
        );
      case 2:
        return (
          <DiscountData
            isCompleted={completedSteps.includes("Discount")}
            handleNext={() => handleNext(3, "Discount")}
            handleBack={() => setStep(1)}
          />
        );
      case 3:
        return (
          <Documents
            isCompleted={completedSteps.includes("Document")}
            handleNext={() => handleNext(4, "Document")}
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
          steps={[
            {
              key: "Documentation",
              label: "Documentazione"
            },
            {
              key: "Profile",
              label: "Dati operatore"
            },
            {
              key: "Discount",
              label: "Dati agevolazione"
            },
            {
              key: "Document",
              label: "Documenti"
            }
          ]}
        ></Stepper>
      </div>
      {selectedTab()}
    </Layout>
  );
};

export default CreateProfile;
