import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AxiosError } from "axios";
import { Severity, useTooltip } from "../../../../context/tooltip";
import CenteredLoading from "../../../CenteredLoading/CenteredLoading";
import FormSection from "../../FormSection";
import { setImage } from "../../../../store/agreement/agreementSlice";
import PlusIcon from "../../../../assets/icons/plus.svg";
import { RootState } from "../../../../store/store";
import { remoteData } from "../../../../api/common";

const FooterDescription = (
  <div>
    <p className="text-base font-weight-normal text-gray mb-0">
      Il file deve avere le seguenti caratteristiche:
    </p>
    <ul className="pl-4 text-base font-weight-normal text-gray">
      <li>Dimensione dell’immagine: minimo 800x600px</li>
      <li>Dimensione del file: massimo 5Mb</li>
      <li>Formato del file: JPG, PNG</li>
    </ul>
  </div>
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
  }, [agreement.imageUrl, dispatch]);

  const getImageErrorCodeDescription = (imageErrorCode: unknown) => {
    switch (imageErrorCode) {
      case "IMAGE_NAME_OR_EXTENSION_NOT_VALID":
        return "Il formato dell'immagine non è valido. Carica un'immagine JPG o PNG e riprova.";
      case "IMAGE_DIMENSION_NOT_VALID":
        return "L'immagine ha dimensioni non valide. Ridimensiona l'immagine e riprova.";
      default:
        return "Errore durante il caricamento dell'immagine, riprovare in seguito o cambiare immagine";
    }
  };

  const uploadImage = async (image: any) => {
    try {
      setLoading(true);
      const data = await remoteData.Index.Agreement.uploadImage.method({
        agreementId: agreement.id,
        image: image[0]
      });
      if (data.imageUrl) {
        dispatch(setImage(`${process.env.BASE_IMAGE_PATH}/${data.imageUrl}`));
      }
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.status === 400
      ) {
        triggerTooltip({
          severity: Severity.DANGER,
          text: getImageErrorCodeDescription(error.response.data)
        });
      } else {
        triggerTooltip({
          severity: Severity.DANGER,
          text: getImageErrorCodeDescription(undefined)
        });
      }
    } finally {
      setLoading(false);
      setImageRefreshTimestamp(Date.now());
    }
  };

  const [imageRefreshTimestamp, setImageRefreshTimestamp] = useState(
    Date.now()
  );
  return (
    <FormSection
      title="Immagine operatore"
      description="Carica un'immagine che rappresenti i beni o i servizi trattati dall'Operatore"
      footerDescription={FooterDescription}
      isVisible
      required
    >
      <ul className="upload-pictures-wall">
        <li>
          {loading ? (
            <CenteredLoading />
          ) : (
            <>
              {agreement.imageUrl ? (
                <div className="d-flex flex-row align-items-end">
                  <img
                    src={`${agreement.imageUrl}?${imageRefreshTimestamp}`}
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
                    accept="image/png, image/jpeg"
                    onChange={() => {
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
              ) : (
                <>
                  <input
                    type="file"
                    name="profileImage"
                    id="profileImage"
                    className="upload pictures-wall"
                    ref={imageInput}
                    accept="image/png, image/jpeg"
                    onChange={() => {
                      void uploadImage(imageInput.current.files);
                    }}
                  />
                  <label htmlFor="profileImage">
                    <PlusIcon className="icon icon-sm" />
                    <span>Add photo</span>
                  </label>
                </>
              )}
            </>
          )}
        </li>
      </ul>
    </FormSection>
  );
};

export default ProfileImage;
