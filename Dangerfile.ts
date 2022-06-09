import customRules from "@pagopa/danger-plugin";
import { RecordScope } from "@pagopa/danger-plugin/dist/types";

const recordScope: RecordScope = {
  projectToScope: {
    PE: "Portale Esercenti"
  },
  tagToScope: {}
};

customRules(recordScope);
