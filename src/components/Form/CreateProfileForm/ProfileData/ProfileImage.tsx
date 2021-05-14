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

  const uploadImage = async (image: any) =>
    await tryCatch(
      () => Api.Agreement.uploadImage(agreement.id, image[0]),
      toError
    )
      .map(response => response.data)
      .fold(
        () => setLoading(false),
        response => {
          if (response?.imageUrl) {
            dispatch(
              setImage(`${process.env.BASE_IMAGE_PATH}/${response.imageUrl}`)
            );
          } else {
            triggerTooltip({
              severity: Severity.DANGER,
              text:
                "Errore durante il caricamento dell'immagine, riprovare in seguito o cambiare immagine"
            });
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
                  src={agreement.imageUrl}
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
