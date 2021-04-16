import React from "react";
import { LinkList, LinkListItem, Icon } from "design-react-kit";

const ProfileDocuments = () => (
  <section className="mt-4 px-8 py-10 bg-white">
    <h2 className="h4 font-weight-bold text-dark-blue">Documenti</h2>
    <LinkList tag="div">
      <LinkListItem
        active
        className="d-flex flex-row align-items-center"
        tag="div"
      >
        <Icon icon="it-file" color="primary" className="mr-4" />
        <div>
          <span className="text-sm font-weight-semibold text-blue">
            Convenzione
          </span>
          <p className="text-sm font-weight-light text-dark-blue">
            Approvato il 24/04/2021, 15:17
          </p>
        </div>
      </LinkListItem>
      <LinkListItem divider tag="a" />
      <LinkListItem tag="div" className="d-flex flex-row align-items-center">
        <Icon icon="it-file" color="primary" className="mr-4" />
        <div className="flex flex-row justify-items-start">
          <span className="text-sm font-weight-semibold text-blue">
            Allegato 1 - Manifestazione di interesse
          </span>
          <p className="text-sm font-weight-light text-dark-blue">
            Approvato il 24/04/2021, 15:17
          </p>
        </div>
      </LinkListItem>
      <LinkListItem divider tag="a" />
      <LinkListItem tag="div" className="d-flex flex-row align-items-center">
        <Icon icon="it-file" color="primary" className="mr-4" />
        <div>
          <span className="text-sm font-weight-semibold text-blue">
            Documentazione tecnica
          </span>
        </div>
      </LinkListItem>
    </LinkList>
  </section>
);

export default ProfileDocuments;
