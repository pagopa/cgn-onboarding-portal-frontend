import React, { useState } from "react";
import { useSelector } from "react-redux";
import FormSection from "../../FormSection";
import PlusIcon from "../../../../assets/icons/plus.svg";
import { RootState } from "../../../../store/store";

const FooterDescription = (
  <p className="text-base font-weight-normal text-gray">
    Il file deve avere le seguenti caratteristiche:
    <br />
    Dimensione del file: minimo 800x600px
    <br />
    Formato del file: JPG, PNG
  </p>
);

const ProfileImage = () => {
  const [image, setImage] = useState<any>();
  const agreement = useSelector((state: RootState) => state.agreement.value);

  return (
    <FormSection
      hasIntroduction
      title="Immagine operatore"
      description="Caricare un'immagine che rappresenti i beni o i servizi trattati dall'Operatore"
      footerDescription={FooterDescription}
      isVisible
    >
      <ul className="upload-pictures-wall">
        <li>
          <input
            type="file"
            name="profileImage"
            id="profileImage"
            className="upload pictures-wall"
            onChange={uploadImage}
          />
          <label htmlFor="profileImage">
            <PlusIcon className="icon icon-sm" />
            <span>Add photo</span>
          </label>
        </li>
      </ul>
    </FormSection>
  );
};

export default ProfileImage;
