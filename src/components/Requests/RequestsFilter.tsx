import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button, Icon, Badge, Chip, ChipLabel } from "design-react-kit";
import { Form, Formik, Field } from "formik";

const RequestsFilter = () => {
  return (
    <Formik
      initialValues={{}}
      onSubmit={values => {
        console.log(values);
      }}
    >
      {() => (
        <Form>
          <div className="d-flex justify-content-between">
            <h2 className="h4 font-weight-bold text-dark-blue">
              Richieste di convenzione
            </h2>
            <div className="d-flex">
              <div className="chip chip-lg">
                <span className="chip-label">Label</span>
                <button>
                  <Icon color="" icon="it-close" size="" />
                  <span className="sr-only">Elimina label</span>
                </button>
              </div>
              <div className="chip chip-lg">
                <span className="chip-label">Label</span>
                <button>
                  <Icon color="" icon="it-close" size="" />
                  <span className="sr-only">Elimina label</span>
                </button>
              </div>
              <Field id="search" name="search" type="text" placeholder="Cerca Richiesta" />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RequestsFilter;
