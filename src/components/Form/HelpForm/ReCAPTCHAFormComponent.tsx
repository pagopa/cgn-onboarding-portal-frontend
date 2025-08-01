/* eslint-disable functional/immutable-data */
import { useCallback, useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { FormikHelpers } from "formik";
import { Severity, useTooltip } from "../../../context/tooltip";

type Props = {
  setFieldValue: FormikHelpers<{ recaptchaToken: string }>["setFieldValue"];
};

const ReCAPTCHAFormComponent = ({ setFieldValue }: Props) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [canRenderRecaptcha, setCanRenderRecaptcha] = useState(false);
  const { triggerTooltip } = useTooltip();

  const executeRecaptcha = useCallback(async () => {
    try {
      if (!recaptchaRef.current) {
        throw new Error();
      }
      const response = await recaptchaRef.current.executeAsync();
      void setFieldValue("recaptchaToken", response);
    } catch {
      triggerTooltip({
        severity: Severity.DANGER,
        text: "C'è stato un errore durante la verifica del recaptcha"
      });
    }
  }, [setFieldValue, triggerTooltip]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.recaptchaOptions = {
      useRecaptchaNet: true
    };
    setCanRenderRecaptcha(true);
    void executeRecaptcha();
  }, [executeRecaptcha, setFieldValue]);

  return (
    <div className="mt-10">
      {canRenderRecaptcha && (
        <ReCAPTCHA
          ref={recaptchaRef}
          size="invisible"
          sitekey={import.meta.env.CGN_RECAPTCHA_API_KEY}
        />
      )}
    </div>
  );
};

export default ReCAPTCHAFormComponent;
