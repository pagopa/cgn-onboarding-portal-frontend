import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AxiosError } from "axios";
import { Severity, useTooltip } from "../../../../context/tooltip";
import CenteredLoading from "../../../CenteredLoading/CenteredLoading";
import FormSection from "../../FormSection";
import { setImage } from "../../../../store/agreement/agreementSlice";
import PlusIcon from "../../../../assets/icons/plus.svg?react";
import { RootState } from "../../../../store/store";
import { remoteData } from "../../../../api/common";

const FooterDescription = (
  <div>
    <p className="text-base fw-normal text-gray mb-0">
      Il file deve avere le seguenti caratteristiche:
    </p>
    <ul className="ps-4 text-base fw-normal text-gray">
      <li>Dimensione dell’immagine: minimo 800x600px</li>
      <li>Dimensione del file: massimo 5Mb</li>
      <li>Formato del file: JPG, PNG</li>
    </ul>
  </div>
);

const ProfileImage = () => {
  const dispatch = useDispatch();
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const imageInput = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const { triggerTooltip } = useTooltip();

  useEffect(() => {
    if (
      agreement.imageUrl &&
      !agreement.imageUrl.includes(import.meta.env.CGN_IMAGE_BASE_URL)
    ) {
      dispatch(
        setImage(`${import.meta.env.CGN_IMAGE_BASE_URL}/${agreement.imageUrl}`)
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

  const uploadImage = async (image: FileList | null | undefined) => {
    if (!image || image.length === 0) {
      throw new Error();
    }
    try {
      setLoading(true);
      const data = await remoteData.Index.Agreement.uploadImage.method({
        agreementId: agreement.id,
        image: image?.[0]
      });
      if (data.imageUrl) {
        dispatch(
          setImage(`${import.meta.env.CGN_IMAGE_BASE_URL}/${data.imageUrl}`)
        );
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
      description="Carica un'immagine che rappresenti i beni o i servizi trattati dall'operatore"
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
                      void uploadImage(imageInput.current?.files);
                    }}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="profileImage"
                    className="ms-4 mb-0 text-primary text-decoration-underline cursor-pointer form-label"
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
                      void uploadImage(imageInput.current?.files);
                    }}
                  />
                  <label htmlFor="profileImage" className="form-label">
                    <PlusIcon className="icon icon-sm" />
                    <span>Carica foto</span>
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
