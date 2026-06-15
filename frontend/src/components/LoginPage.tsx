import { useState, type FormEvent } from 'react';
import { Alert, Button, Card, Container, Form, Spinner, Stack } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';

type AuthMode = 'login' | 'register';

/**
 * Full-page login / register form with Email/Password and Google Sign-In.
 */
export function LoginPage() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Authentication failed';
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Google sign-in failed';
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh' }}
    >
      <Card style={{ width: '100%', maxWidth: 420 }} className="shadow">
        <Card.Body className="p-4">
          <h2 className="text-center mb-4">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="auth-email" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </Form.Group>

            <Form.Group controlId="auth-password" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </Form.Group>

            <Stack gap={2}>
              <Button type="submit" variant="primary" disabled={busy}>
                {busy ? (
                  <Spinner size="sm" animation="border" className="me-2" />
                ) : null}
                {mode === 'login' ? 'Sign In' : 'Register'}
              </Button>

              <div className="position-relative my-2">
                <hr />
                <span
                  className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted"
                  style={{ fontSize: '0.85rem' }}
                >
                  or
                </span>
              </div>

              <Button
                variant="outline-dark"
                onClick={handleGoogle}
                disabled={busy}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 48 48"
                  className="me-2"
                  style={{ verticalAlign: 'text-bottom' }}
                >
                  <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 33.4 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 5.9 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.2-2.7-.4-3.9z" />
                  <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.5 15.5 18.8 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 5.9 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.8 13.4-5.2l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.2 0-9.6-2.6-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
                  <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.7 39.4 44 34 44 24c0-1.3-.2-2.7-.4-3.9z" />
                </svg>
                Continue with Google
              </Button>
            </Stack>
          </Form>

          <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: '0.9rem' }}>
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                  }}
                >
                  Register
                </Button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                >
                  Sign In
                </Button>
              </>
            )}
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
