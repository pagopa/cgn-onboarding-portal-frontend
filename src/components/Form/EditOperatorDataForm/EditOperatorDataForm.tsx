import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { useHistory } from "react-router-dom";
import CenteredLoading from "../../CenteredLoading/CenteredLoading";
import Api from "../../../api";
import { RootState } from "../../../store/store";
import ProfileInfo from "../CreateProfileForm/ProfileData/ProfileInfo";
import ReferentData from "../CreateProfileForm/ProfileData/ReferentData";
import ProfileImage from "../CreateProfileForm/ProfileData/ProfileImage";
import ProfileDescription from "../CreateProfileForm/ProfileData/ProfileDescription";
import SalesChannels from "../CreateProfileForm/ProfileData/SalesChannels";
import { DASHBOARD } from "../../../navigation/routes";

const defaultSalesChannel = {
  channelType: "",
  websiteUrl: "",
  discountCodeType: "",
  addresses: [{ street: "", zipCode: "", city: "", district: "" }]
};

const defaultInitialValues = {
  fullName: "",
  hasDifferentFullName: false,
  name: "",
  pecAddress: "",
  taxCodeOrVat: "",
  legalOffice: "",
  telephoneNumber: "",
  legalRepresentativeFullName: "",
  legalRepresentativeTaxCode: "",
  referent: {
    firstName: "",
    lastName: "",
    role: "",
    emailAddress: "",
    telephoneNumber: ""
  },
  description: "",
  salesChannel: defaultSalesChannel
};

const validationSchema = Yup.object().shape({
  hasDifferentName: Yup.boolean(),
  name: Yup.string().when(["hasDifferentName"], {
    is: true,
    then: Yup.string().required("Campo obbligatorio")
  }),
  pecAddress: Yup.string()
    .email("Deve essere una email")
    .required("Campo obbligatorio"),
  legalOffice: Yup.string().required("Campo obbligatorio"),
  telephoneNumber: Yup.string()
    .phone("IT", false, "Numero di telefono non valido")
    .required("Campo obbligatorio"),
  legalRepresentativeFullName: Yup.string().required(),
  legalRepresentativeTaxCode: Yup.string()
    .min(16, "Deve essere di 16 caratteri")
    .max(16, "Deve essere di 16 caratteri")
    .required("Campo obbligatorio"),
  referent: Yup.object().shape({
    firstName: Yup.string().required("Campo obbligatorio"),
    lastName: Yup.string().required("Campo obbligatorio"),
    role: Yup.string().required("Campo obbligatorio"),
    emailAddress: Yup.string()
      .email("Deve essere una email")
      .required("Campo obbligatorio"),
    telephoneNumber: Yup.string()
      .max(15, "Massimo 15 caratteri")
      .required("Campo obbligatorio")
  }),
  description: Yup.string().required("Campo obbligatorio"),
  salesChannel: Yup.object().shape({
    channelType: Yup.mixed().oneOf([
      "OnlineChannel",
      "OfflineChannel",
      "BothChannels"
    ]),
    websiteUrl: Yup.string().when("channelType", {
      is: "OnlineChannel" || "BothChannels",
      then: Yup.string().required("Campo obbligatorio")
    }),
    discountCodeType: Yup.string().when("channelType", {
      is: "OnlineChannel" || "BothChannels",
      then: Yup.string().required("Campo obbligatorio")
    }),
    addresses: Yup.array().when("channelType", {
      is: "OfflineChannel" || "BothChannels",
      then: Yup.array().of(
        Yup.object().shape({
          street: Yup.string().required("Campo obbligatorio"),
          zipCode: Yup.string().required("Campo obbligatorio"),
          city: Yup.string().required("Campo obbligatorio"),
          district: Yup.string().required("Campo obbligatorio")
        })
      )
    })
  })
});

const EditOperatorDataForm = () => {
  const history = useHistory();
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const user = useSelector((state: RootState) => state.user.data);
  const [initialValues, setInitialValues] = useState<any>(defaultInitialValues);
  const [loading, setLoading] = useState(true);

  const updateProfile = async (discount: any) => {
    if (agreement) {
      await tryCatch(
        () => Api.Profile.updateProfile(agreement.id, discount),
        toError
      )
        .fold(
          () => void 0,
          () => history.push(DASHBOARD)
        )
        .run();
    }
  };

  const getProfile = async (agreementId: string) =>
    await tryCatch(() => Api.Profile.getProfile(agreementId), toError)
      .map(response => response.data)
      .fold(
        () => setLoading(false),
        profile => {
          setInitialValues({
            ...profile,
            hasDifferentFullName: !!profile.name
          });
          setLoading(false);
        }
      )
      .run();

  useEffect(() => {
    setLoading(true);
    void getProfile(agreement.id);
  }, []);

  if (loading) {
    return <CenteredLoading />;
  }

  return (
    <Formik
      initialValues={{
        ...initialValues,
        salesChannel: {
          ...defaultSalesChannel,
          ...initialValues.salesChannel
        },
        fullName: user.company?.organization_name || "",
        taxCodeOrVat:
          user.company?.organization_fiscal_code || user.fiscal_number || ""
      }}
      validationSchema={validationSchema}
      onSubmit={values => {
        const { hasDifferentFullName, ...discount } = values;
        if (discount.salesChannel?.channelType === "OnlineChannel") {
          const newSalesChannel = discount.salesChannel;
          const { addresses, ...salesChannel } = newSalesChannel;
          void updateProfile({ ...discount, salesChannel });
        } else {
          const newSalesChannel = discount.salesChannel;
          const {
            websiteUrl,
            discountCodeType,
            ...salesChannel
          } = newSalesChannel;
          void updateProfile({ ...discount, salesChannel });
        }
      }}
    >
      {({ values, isValid }) => (
        <Form autoComplete="off">
          <ProfileInfo formValues={values} />
          <ReferentData />
          <ProfileImage />
          <ProfileDescription />
          <SalesChannels
            handleBack={() => history.push(DASHBOARD)}
            formValues={values}
            isValid={isValid}
          />
        </Form>
      )}
    </Formik>
  );
};

export default EditOperatorDataForm;
