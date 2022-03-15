/* eslint-disable functional/immutable-data */
import React, { useEffect, useRef, useState } from "react";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import ReCAPTCHA from "react-google-recaptcha";
import { Severity, useTooltip } from "../../../context/tooltip";

type Props = {
  setFieldValue: any;
};

const ReCAPTCHAFormComponent = ({ setFieldValue }: Props) => {
  const recaptchaRef = useRef<any>();
  const [canRenderRecaptcha, setCanRenderRecaptcha] = useState(false);
  const { triggerTooltip } = useTooltip();

  const onErrorTooltip = () =>
    triggerTooltip({
      severity: Severity.DANGER,
      text: "C'è stato un errore durante la verifica del recaptcha"
    });

  const executeRecaptcha = async () =>
    await tryCatch(() => recaptchaRef.current.executeAsync(), toError)
      .fold(onErrorTooltip, response =>
        setFieldValue("recaptchaToken", response)
      )
      .run();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.recaptchaOptions = {
      useRecaptchaNet: true
    };
    setCanRenderRecaptcha(true);
    void executeRecaptcha();
  }, [setFieldValue]);

  return (
    <div className="mt-10">
      {canRenderRecaptcha && (
        <ReCAPTCHA
          ref={recaptchaRef}
          size="invisible"
          sitekey={
            process.env.RECAPTCHA_API_KEY
              ? process.env.RECAPTCHA_API_KEY
              : "6Le93sseAAAAAGXS34PkpfmkTThwMhUdklkNtIM5"
          }
        />
      )}
    </div>
  );
};

export default ReCAPTCHAFormComponent;
