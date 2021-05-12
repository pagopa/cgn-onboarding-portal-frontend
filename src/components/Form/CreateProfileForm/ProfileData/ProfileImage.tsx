import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import FormSection from "../../FormSection";
import PlusIcon from "../../../../assets/icons/plus.svg";
import { RootState } from "../../../../store/store";
import Api from "../../../../api/index";

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
  const imageInput = useRef<any>();

  const handleImage = () => {
    imageInput.current.click();
  };

  const uploadImage = async (image: any) =>
    await tryCatch(
      () => Api.Agreement.uploadImage(agreement.id, image[0]),
      toError
    )
      .map(response => response.data.imageUrl)
      .fold(
        () => void 0,
        newImage => setImage(`${process.env.BASE_IMAGE_PATH}/${newImage}`)
      )
      .run();

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
          {!image && (
            <>
              <input
                type="file"
                name="profileImage"
                id="profileImage"
                className="upload pictures-wall"
                ref={imageInput}
                onChange={() => uploadImage(imageInput.current.files)}
              />
              <label htmlFor="profileImage">
                <PlusIcon className="icon icon-sm" />
                <span>Add photo</span>
              </label>
            </>
          )}
          {image && (
            <>
              <div className="d-flex flex-row align-items-end">
                <img
                  src={image}
                  style={{
                    width: "128px",
                    height: "128px",
                    objectFit: "cover"
                  }}
                />
                <input
                  type="file"
                  name="profileImage"
                  id="profileImage"
                  ref={imageInput}
                  onChange={() => uploadImage(imageInput.current.files)}
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="profileImage"
                  className="ml-4 mb-0 text-primary underline"
                >
                  Cambia immagine
                </label>
              </div>
            </>
          )}
        </li>
      </ul>
    </FormSection>
  );
};

export default ProfileImage;
