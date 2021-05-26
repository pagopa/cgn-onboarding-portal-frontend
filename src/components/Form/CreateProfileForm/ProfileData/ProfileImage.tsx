import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { useTooltip, Severity } from "../../../../context/tooltip";
import CenteredLoading from "../../../CenteredLoading/CenteredLoading";
import FormSection from "../../FormSection";
import { setImage } from "../../../../store/agreement/agreementSlice";
import PlusIcon from "../../../../assets/icons/plus.svg";
import { RootState } from "../../../../store/store";
import Api from "../../../../api/index";
import { ImageErrorCode } from "../../../../api/generated";
import chainAxios from "../../../../utils/chainAxios";

const FooterDescription = (
  <p className="text-base font-weight-normal text-gray">
    Il file deve avere le seguenti caratteristiche:
    <br />
    Dimensione del file: minimo 800x600px
    <br />
    Formato del file: JPG, PNG
  </p>
);

// eslint-disable-next-line sonarjs/cognitive-complexity
const ProfileImage = () => {
  const dispatch = useDispatch();
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const imageInput = useRef<any>();
  const [loading, setLoading] = useState(false);
  const { triggerTooltip } = useTooltip();

  useEffect(() => {
    if (
      agreement.imageUrl &&
      !agreement.imageUrl.includes(process.env.BASE_IMAGE_PATH as string)
    ) {
      dispatch(
        setImage(`${process.env.BASE_IMAGE_PATH}/${agreement.imageUrl}`)
      );
    }
  }, []);

  const getImageErrorCodeDescription = (imageErrorCode: string) => {
    switch (imageErrorCode) {
      case ImageErrorCode.ImageSizeExceeded:
        return "La dimensione dell'immagine non è valida. L'immagine deve pesare al massimo 5mb. ";
      case ImageErrorCode.InvalidDimension:
        return "Le dimensioni dell'immagine non sono valide. L'immagine dev'essere minimo 800x600px.";
      case ImageErrorCode.InvalidImageType:
        return "Il formato dell'immagine non è valido. L'immagine dev'essere di formato JPG o PNG.";
      default:
        return "Errore durante il caricamento dell'immagine, riprovare in seguito o cambiare immagine";
    }
  };

  const uploadImage = async (image: any) =>
    await tryCatch(
      () => Api.Agreement.uploadImage(agreement.id, image[0]),
      toError
    )
      .chain(chainAxios)
      .map(response => response.data)
      .fold(
        response => {
          triggerTooltip({
            severity: Severity.DANGER,
            text: getImageErrorCodeDescription(response.message)
          });
          setLoading(false);
        },
        response => {
          if (response?.imageUrl) {
            dispatch(
              setImage(`${process.env.BASE_IMAGE_PATH}/${response.imageUrl}`)
            );
          }
          setLoading(false);
        }
      )
      .run();

  return (
    <FormSection
      hasIntroduction
      title="Immagine operatore"
      description="Caricare un'immagine che rappresenti i beni o i servizi trattati dall'Operatore"
      footerDescription={FooterDescription}
      isVisible
      required
    >
      <ul className="upload-pictures-wall">
        <li>
          {!agreement.imageUrl && (
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
          {loading ? (
            <CenteredLoading />
          ) : (
            agreement.imageUrl && (
              <div className="d-flex flex-row align-items-end">
                <img
                  src={`${agreement.imageUrl}?${Date.now()}`}
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
                  onChange={() => {
                    setLoading(true);
                    void uploadImage(imageInput.current.files);
                  }}
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="profileImage"
                  className="ml-4 mb-0 text-primary underline cursor-pointer"
                >
                  Cambia immagine
                </label>
              </div>
            )
          )}
        </li>
      </ul>
    </FormSection>
  );
};

export default ProfileImage;
