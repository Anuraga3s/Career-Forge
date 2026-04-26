import { useEffect, useEffectEvent, useRef, useState } from "react";
import api from "../services/api";

const GOOGLE_SCRIPT_ID = "google-identity-service";
const GOOGLE_HANDLER_KEY = "__careerForgeGoogleHandler";
const GOOGLE_INIT_KEY = "__careerForgeGoogleInitializedFor";

function loadGoogleScript() {
  if (document.getElementById(GOOGLE_SCRIPT_ID)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () =>
      reject(new Error("Failed to load Google Identity Services."));
    document.head.appendChild(script);
  });
}

export default function GoogleAuthButton({ label = "Continue with Google", onSuccess }) {
  const buttonRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const handleAuthSuccess = useEffectEvent(async (response) => {
    try {
      setStatus("loading");
      const res = await api.post("/auth/google", {
        credential: response.credential,
      });
      setStatus("idle");
      onSuccess?.(res.data);
    } catch (error) {
      setStatus("error");
      alert(
        error.response?.data?.message ||
          error.message ||
          "Google authentication failed"
      );
    }
  });

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      setStatus("missing-client-id");
      return undefined;
    }

    let cancelled = false;

    const initializeGoogle = async () => {
      try {
        await loadGoogleScript();

        if (cancelled || !window.google?.accounts?.id || !buttonRef.current) {
          return;
        }

        window[GOOGLE_HANDLER_KEY] = handleAuthSuccess;

        if (window[GOOGLE_INIT_KEY] !== clientId) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => {
              window[GOOGLE_HANDLER_KEY]?.(response);
            },
          });
          window[GOOGLE_INIT_KEY] = clientId;
        }

        buttonRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: label === "Sign up with Google" ? "signup_with" : "continue_with",
          shape: "pill",
          width: buttonRef.current.offsetWidth || 320,
          logo_alignment: "left",
        });
      } catch (error) {
        setStatus("error");
      }
    };

    initializeGoogle();

    return () => {
      cancelled = true;
    };
  }, [handleAuthSuccess, label]);

  if (status === "missing-client-id") {
    return (
      <p style={hintStyle}>
        Add <code>VITE_GOOGLE_CLIENT_ID</code> to enable Google sign-in.
      </p>
    );
  }

  return (
    <div style={{ display: "grid", gap: "10px" }}>
      <div ref={buttonRef} style={{ minHeight: "44px", width: "100%" }} />
      {status === "loading" ? (
        <p style={hintStyle}>Connecting your Google account…</p>
      ) : null}
      {status === "error" ? (
        <p style={errorStyle}>Google sign-in is unavailable right now.</p>
      ) : null}
    </div>
  );
}

const hintStyle = {
  margin: 0,
  fontSize: "13px",
  color: "#cbd5e1",
  textAlign: "center",
};

const errorStyle = {
  ...hintStyle,
  color: "#fca5a5",
};
