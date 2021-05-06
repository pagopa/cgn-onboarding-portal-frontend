import React from "react";
import { useDispatch } from "react-redux";
import { Button } from "design-react-kit";
import * as Yup from "yup";
import { Form, Field, Formik } from "formik";
import { setAdmin } from "../store/user/userSlice";
import Layout from "../components/Layout/Layout";
import Container from "../components/Container/Container";
import Spid from "../assets/icons/spid.svg";
import FormField from "../components/Form/FormField";

const initialValues = {
  email: "",
  password: ""
};

const validationSchema = Yup.object().shape({
  email: Yup.string().required(),
  password: Yup.string().required()
});

const Login = () => {
  const dispatch = useDispatch();
  return (
    <Layout>
      <Container>
        <Container className="mt-20 mb-20">
          <div className="col-10 offset-1">
            <section className="px-20 py-28 bg-white">
              <h1 className="h2 font-weight-bold text-dark-blue">
                Benvenuto su &lt;portale&gt; Carta Giovani Nazionale
              </h1>
              <p className="text-gray">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse quis dictum mi. Morbi auctor nibh ante, eget
                interdum urna malesuada in. Styles Code
              </p>
              <div className="mt-14 row variable-gutters">
                <div className="col">
                  <h2 className="h3 text-dark-blue">Sei un operatore?</h2>
                  <span className="text-sm font-weight-normal text-dark-blue text-uppercase">
                    Accedi con spid
                  </span>
                  <div className="mt-10">
                    <Spid />
                    <p>
                      SPID è il sistema unico di accesso ai servizi online della
                      Pubblica Amministrazione. Se hai già un&apos;identità
                      digitale SPID, accedi con le tue credenziali. Se non hai
                      ancora SPID, richiedilo ad uno dei gestori.
                    </p>
                  </div>
                  <Button
                    type="button"
                    color="primary"
                    className="mt-10"
                    style={{ width: "100%" }}
                    onClick={() =>
                      // eslint-disable-next-line functional/immutable-data
                      (window.location.href =
                        "http://api.cgn-dev.caravan-azure.bitrock.it/spid/v1/login/?entityID=xx_testenv2&authLevel=SpidL2")
                    }
                  >
                    Entra con SPID
                  </Button>
                </div>
                <div className="col">
                  <h2 className="h3 text-dark-blue">Sei un amministratore?</h2>
                  <span className="text-sm font-weight-normal text-dark-blue text-uppercase">
                    Accedi con le tue credenziali
                  </span>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={values => {
                      dispatch(setAdmin({ ...values, type: "ADMIN" }));
                    }}
                  >
                    {({ isValid }) => (
                      <Form>
                        <FormField htmlFor="email" title="Indirizzo e-mail">
                          <Field
                            id="email"
                            name="email"
                            type="text"
                            placeholder="Inserisci l'indirizzo e-mail"
                          />
                        </FormField>
                        <FormField htmlFor="password" title="Password">
                          <Field
                            id="password"
                            name="password"
                            type="password"
                          />
                        </FormField>
                        <Button
                          className="mt-10"
                          type="submit"
                          color="secondary"
                          outline
                          disabled={!isValid}
                        >
                          Continua
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </section>
          </div>
        </Container>
      </Container>
    </Layout>
  );
};

export default Login;
