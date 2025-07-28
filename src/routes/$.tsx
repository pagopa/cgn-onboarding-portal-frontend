import { href, Link } from "react-router";
import Layout from "../components/Layout/Layout";
import Container from "../components/Container/Container";

export default function Component() {
  return (
    <Layout>
      <Container>
        <div className="col-12 bg-white my-20 p-10 d-flex flex-column align-items-center">
          <h1 className="h2 fw-bold text-dark-blue mb-4">Pagina non trovata</h1>
          <Link to={href("/")}>Torna alla pagina principale</Link>
        </div>
      </Container>
    </Layout>
  );
}
