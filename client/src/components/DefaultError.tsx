import { useRouter } from "@tanstack/react-router";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message || "Unknown runtime error.";
  }
  if (typeof error === "string") {
    return error;
  }
  return "Unknown runtime error.";
}

export function DefaultErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  const router = useRouter();
  const errorMessage = getErrorMessage(error);

  return (
    <div className="app-error-screen">
      <div className="app-error-card">
        <div className="app-error-icon" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="34"
            height="34"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>

        <h1>Something went wrong</h1>
        <p>An unexpected runtime error occurred. Please retry.</p>

        {import.meta.env.DEV ? <pre className="app-error-message">{errorMessage}</pre> : null}

        <div className="app-error-actions">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="action-btn action-btn-primary"
          >
            Try again
          </button>
          <a href="/" className="action-btn">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
