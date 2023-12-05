import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../components/Layout/Layout";
import Stepper from "../components/Stepper/Stepper";
import Documentation from "../components/Form/CreateProfileForm/Documentation/Documentation";
import ProfileData from "../components/Form/CreateProfileForm/ProfileData/ProfileData";
import DiscountData from "../components/Form/CreateProfileForm/DiscountData/DiscountData";
import Documents from "../components/Form/CreateProfileForm/Documents/Documents";
import { RootState } from "../store/store";
import { CompletedStep, EntityType } from "../api/generated";
import RequestApproval from "../components/Form/CreateProfileForm/Documents/RequestApproval";
import CgnLogo from "../components/Logo/CgnLogo";

// eslint-disable-next-line sonarjs/cognitive-complexity
const CreateProfile = () => {
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<number>(agreement.completedSteps.length);
  const [completedSteps, setCompletedSteps] = useState<Array<string>>(
    agreement.completedSteps
  );
  const [showRequireApproval, setShowRequireApproval] = useState(false);

  const entityType = agreement.entityType;

  const handleNext = (step: number, key?: string) => {
    if (key && !completedSteps.includes(key)) {
      setCompletedSteps([...completedSteps, key]);
    }
    setStep(step);
  };

  const onUpdate = () => {
    setCompletedSteps([...completedSteps.filter(step => step !== "Document")]);
  };

  useEffect(() => {
    if (entityType) {
      if (agreement.state === "RejectedAgreement") {
        setStep(1);
        setCompletedSteps([...completedSteps, "Guide"]);
      } else if (agreement.completedSteps.includes(CompletedStep.Profile)) {
        setCompletedSteps([...completedSteps, "Guide"]);
        if (entityType === EntityType.Private && step < 3) {
          setStep(step + 1);
        }
        if (entityType === EntityType.PublicAdministration && step < 2) {
          setStep(step + 1);
        }
      }
      setLoading(false);
    }
  }, [entityType]);

  const selectedTab = () => {
    if (step === 0) {
      return (
        <Documentation
          isCompleted={completedSteps.includes("Guide")}
          handleNext={() => handleNext(1, "Guide")}
        />
      );
    } else if (step === 1) {
      return (
        <ProfileData
          isCompleted={completedSteps.includes("Profile")}
          handleNext={() => handleNext(2, "Profile")}
          handleBack={() => setStep(0)}
          onUpdate={onUpdate}
        />
      );
    } else if (entityType === EntityType.Private && step === 2) {
      // public administration entity type does not have discount wizard step
      return (
        <DiscountData
          isCompleted={completedSteps.includes("Discount")}
          handleNext={() => handleNext(3, "Discount")}
          handleBack={() => setStep(1)}
          onUpdate={onUpdate}
        />
      );
    } else if (
      (entityType === EntityType.Private && step === 3) ||
      (entityType === EntityType.PublicAdministration && step === 2)
    ) {
      return (
        <Documents
          isCompleted={completedSteps.includes("Document")}
          handleBack={() => setStep(2)}
          setShowRequireApproval={setShowRequireApproval}
        />
      );
    }
  };

  if (showRequireApproval) {
    return <RequestApproval />;
  }

  return !loading && entityType ? (
    <Layout hasHeaderBorder>
      <div className="bg-white">
        <div className="container p-10">
          <div className="row">
            <div className="col-9">
              <h1 className="h5 text-gray">Carta Giovani Nazionale</h1>
              <h2 className="h2 text-dark-blue font-weight-bold">
                Portale Operatori
              </h2>
            </div>
            <div className="col-3 d-flex justify-content-end">
              <CgnLogo />
            </div>
          </div>
        </div>
        <Stepper
          activeStep={step}
          completedSteps={completedSteps}
          handleChangeStep={setStep}
          steps={getSteps(entityType)}
        ></Stepper>
      </div>
      {selectedTab()}
    </Layout>
  ) : null;
};

export default CreateProfile;

function getSteps(entityType: EntityType) {
  const guideStep = {
    key: "Guide",
    label: "Documentazione"
  };
  const profileStep = {
    key: "Profile",
    label: "Dati operatore"
  };
  const discountStep = {
    key: "Discount",
    label: "Dati agevolazione"
  };
  const documentStep = {
    key: "Document",
    label: "Documenti"
  };
  switch (entityType) {
    case EntityType.Private:
      return [guideStep, profileStep, discountStep, documentStep];
    case EntityType.PublicAdministration:
      return [guideStep, profileStep, documentStep];
    default:
      return [];
  }
}
