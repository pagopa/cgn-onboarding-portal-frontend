import { Form, Formik, Field } from "formik";
import { Button } from "design-react-kit";
import { useHistory } from "react-router-dom";
import { useRef } from "react";
import { ADMIN_PANEL_ACCESSI_CREA } from "../../navigation/routes";
import { GetOrgsParams } from "./OperatorActivations";

type FilterFormValues = {
  searchQuery: string | undefined;
  page: number;
};

const ActivationsFilter = ({
  refForm,
  getActivations
}: {
  refForm: any;
  getActivations: (params: GetOrgsParams) => void;
}) => {
  const history = useHistory();

  const timeoutRef = useRef<number | null>(null);

  const initialValues: FilterFormValues = {
    searchQuery: "",
    page: 0
  };

  return (
    <Formik
      innerRef={refForm}
      initialValues={initialValues}
      onSubmit={values => {
        const params = {
          ...values,
          searchQuery: values.searchQuery || undefined
        };
        getActivations(params);
      }}
    >
      {({ submitForm, setFieldValue, resetForm, dirty }) => (
        <Form>
          <div className="d-flex justify-content-between">
            {dirty ? (
              <h2 className="h4 fw-bold text-dark-blue">
                Risultati della ricerca
                <span
                  className="primary-color ms-2 text-sm fw-regular cursor-pointer"
                  onClick={() => {
                    resetForm();
                    void submitForm();
                  }}
                >
                  Esci
                </span>
              </h2>
            ) : (
              <h2 className="h4 fw-bold text-dark-blue">
                Impostazioni di accesso
              </h2>
            )}

            <div
              className="d-flex justify-content-end flex-grow-1 flex-wrap"
              style={{ gap: "12px" }}
            >
              <Field
                id="searchQuery"
                name="searchQuery"
                type="text"
                placeholder="Cerca Operatore"
                onChange={(e: { target: { value: string } }) => {
                  void setFieldValue("searchQuery", e.target.value);
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                  }
                  timeoutRef.current = window.setTimeout(() => {
                    void setFieldValue("page", 0);
                    void submitForm();
                  }, 1000);
                }}
                style={{ maxWidth: "275px" }}
              />
              <Button
                className="ms-5 btn-sm"
                color="primary"
                tag="button"
                onClick={() => history.push(ADMIN_PANEL_ACCESSI_CREA)}
              >
                <span>Aggiungi operatore</span>
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ActivationsFilter;
