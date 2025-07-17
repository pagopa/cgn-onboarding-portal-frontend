import { useMutation, useQuery } from "@tanstack/react-query";
import { Fragment, useMemo } from "react";
import z from "zod/v4";
import { Lens } from "@hookform/lenses";
import {
  Field,
  FormErrorMessage,
  useStandardForm
} from "./react-hook-form-helpers";

// this code is here as a replacement for the generated code

type Data = {
  fullName: string;
  job: JobData;
};

type JobData = {
  title: string;
  description: string;
};

function useDataQuery() {
  return useQuery({
    queryKey: ["formData"],
    queryFn: async (): Promise<Data> => ({
      fullName: "Mario Rossi",
      job: { title: "Software Engineer", description: "Develops software" }
    })
  });
}

type Request = {
  name: string;
  surname: string;
  jobDescription: string;
  jobTitle: string;
};

function useDataMutation() {
  return useMutation({
    async mutationFn(variables: Request) {}
  });
}

// form schema validation file

const formSchema = z.object({
  name: z.string().trim().nonempty(),
  surname: z.string().trim().nonempty(),
  job: z.object({
    title: z.string().trim().nonempty(),
    description: z.string().trim().nonempty()
  })
});

type FormValues = z.infer<typeof formSchema>;

// form utils file

const emptyFormValues: FormValues = {
  name: "",
  surname: "",
  job: {
    title: "",
    description: ""
  }
};

function dataToFormValues(data: Data): FormValues {
  const [name, surname] = data.fullName.split(" ");
  return {
    name: name || "",
    surname: surname || "",
    job: {
      title: data.job.title,
      description: data.job.description
    }
  };
}

function formValuesToRequest(values: FormValues): Request {
  return {
    name: values.name,
    surname: values.surname,
    jobDescription: values.job.description,
    jobTitle: values.job.title
  };
}

// actual form file

function MyExample() {
  const dataQuery = useDataQuery();
  const dataMutation = useDataMutation();
  const values = useMemo(
    () => (dataQuery.data ? dataToFormValues(dataQuery.data) : emptyFormValues),
    [dataQuery.data]
  );
  const form = useStandardForm({
    values,
    zodSchemaFactory: () => formSchema
  });
  return (
    <form
      onSubmit={form.handleSubmit(async data => {
        await dataMutation.mutateAsync(formValuesToRequest(data));
      })}
    >
      <Field
        formLens={form.lens.focus("name")}
        id="name"
        type="text"
        placeholder="name"
      />
      <FormErrorMessage formLens={form.lens.focus("name")} />
      <FormSectionA formLens={form.lens} />
      <FormSectionB formLens={form.lens.focus("job")} />
    </form>
  );
}

// another form section file

function FormSectionA({ formLens }: { formLens: Lens<FormValues> }) {
  return (
    <Fragment>
      <Field formLens={formLens.focus("surname")} />
      <FormErrorMessage formLens={formLens.focus("surname")} />
    </Fragment>
  );
}

// another form section file

function FormSectionB({ formLens }: { formLens: Lens<FormValues["job"]> }) {
  return (
    <Fragment>
      <Field formLens={formLens.focus("title")} />
      <FormErrorMessage formLens={formLens.focus("title")} />
      <Field formLens={formLens.focus("description")} />
      <FormErrorMessage formLens={formLens.focus("description")} />
    </Fragment>
  );
}
