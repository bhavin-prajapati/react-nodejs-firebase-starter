import { Container, Form, Navbar, Button, Spinner } from 'react-bootstrap';
import { ItemsPage } from './components/ItemsPage';
import { LoginPage } from './components/LoginPage';
import { useAuth } from './hooks/useAuth';
import { useUiStore } from './store/uiStore';

export default function App() {
  const { user, loading, signOut } = useAuth();
  const compact = useUiStore((s) => s.compact);
  const toggleCompact = useUiStore((s) => s.toggleCompact);

  // Show a centered spinner while the initial auth state loads.
  if (loading) {
    return (
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: '100vh' }}
      >
        <Spinner animation="border" role="status" aria-label="Loading" />
      </Container>
    );
  }

  // If no user is signed in, show the login page.
  if (!user) {
    return <LoginPage />;
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand>RNF Starter</Navbar.Brand>
          <div className="d-flex align-items-center gap-3">
            <Form.Check
              type="switch"
              id="compact-switch"
              label="Compact"
              className="text-light"
              checked={compact}
              onChange={toggleCompact}
            />
            <Navbar.Text className="text-light small">
              {user.email ?? 'User'}
            </Navbar.Text>
            <Button
              variant="outline-light"
              size="sm"
              onClick={() => void signOut()}
            >
              Sign Out
            </Button>
          </div>
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
