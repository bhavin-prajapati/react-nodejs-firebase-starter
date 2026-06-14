import { Container, Form, Navbar } from 'react-bootstrap';
import { ItemsPage } from './components/ItemsPage';
import { useUiStore } from './store/uiStore';

export default function App() {
  const compact = useUiStore((s) => s.compact);
  const toggleCompact = useUiStore((s) => s.toggleCompact);

  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand>RNF Starter</Navbar.Brand>
          <Form.Check
            type="switch"
            id="compact-switch"
            label="Compact"
            className="text-light"
            checked={compact}
            onChange={toggleCompact}
          />
        </Container>
      </Navbar>
      <Container className={compact ? 'pb-2' : 'pb-4'}>
        <h1 className={compact ? 'h4' : 'h2'}>Items</h1>
        <p className="text-muted">
          Data is served by the API and stored in Firestore.
        </p>
        <ItemsPage />
      </Container>
    </>
  );
}
