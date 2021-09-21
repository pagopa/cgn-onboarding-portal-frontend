import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

const PrivacyModal = ({ isOpen, toggle }: any) => {
  const [markdown, setMarkdown] = useState<string>("");
  useEffect(() => {
    void import("./Privacy.md").then(res => setMarkdown(res));
  }, []);

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle} />
      <ModalBody className="text-center">
        <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
          {markdown}
        </ReactMarkdown>
      </ModalBody>
    </Modal>
  );
};

export default PrivacyModal;
