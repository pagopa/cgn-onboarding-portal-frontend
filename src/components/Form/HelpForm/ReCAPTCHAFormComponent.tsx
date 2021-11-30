import ReCAPTCHA from "react-google-recaptcha";
import React, { useEffect, useRef } from "react";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { Severity, useTooltip } from "../../../context/tooltip";

type Props = {
  setFieldValue: any;
};

const ReCAPTCHAFormComponent = ({ setFieldValue }: Props) => {
  const recaptchaRef = useRef<any>();
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
    void executeRecaptcha();
  }, [setFieldValue]);

  return (
    <div className="mt-10">
      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey={
          process.env.RECAPTCHA_API_KEY ? process.env.RECAPTCHA_API_KEY : ""
        }
      />
    </div>
  );
};

export default ReCAPTCHAFormComponent;
