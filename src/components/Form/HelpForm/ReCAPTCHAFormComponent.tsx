/* eslint-disable functional/immutable-data */
import { useCallback, useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Severity, useTooltip } from "../../../context/tooltip";
import { Lens } from "@hookform/lenses";
import { useController } from "react-hook-form";

type Props = {
  formLens: Lens<string | null>;
};

const ReCAPTCHAFormComponent = ({ formLens }: Props) => {
  const controller = useController(formLens.interop());
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [canRenderRecaptcha, setCanRenderRecaptcha] = useState(false);
  const { triggerTooltip } = useTooltip();

  const executeRecaptcha = useCallback(async () => {
    try {
      if (!recaptchaRef.current) {
        throw new Error();
      }
      const response = await recaptchaRef.current.executeAsync();
      void controller.field.onChange(response);
    } catch {
      triggerTooltip({
        severity: Severity.DANGER,
        text: "C'è stato un errore durante la verifica del recaptcha"
      });
    }
  }, [triggerTooltip]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.recaptchaOptions = {
      useRecaptchaNet: true
    };
    setCanRenderRecaptcha(true);
    void executeRecaptcha();
  }, [executeRecaptcha]);

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
