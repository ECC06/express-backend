import { useState } from "react";
import { PageIntro } from "./UI";

export function RegisterPage({ showNotice, request }) {
    return (
        <AuthPage type="register" showNotice={showNotice} request={request} />
    );
}

export function LoginPage({ showNotice, onLogin, request }) {
    return (
        <AuthPage
            type="login"
            showNotice={showNotice}
            onLogin={onLogin}
            request={request}
        />
    );
}

function AuthPage({ type, showNotice, onLogin, request }) {
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isRegister = type === "register";

    const submit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            const result = await request(`/${type}`, {
                method: "POST",
                body: JSON.stringify(credentials),
            });
            showNotice("success", result.message);
            setCredentials({ username: "", password: "" });
            if (type === "login") {
                onLogin();
            }
        } catch (error) {
            showNotice("error", error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-content">
            <PageIntro
                eyebrow={isRegister ? "Join the community" : "Welcome back"}
                title={
                    isRegister ? "Create your account" : "Log in to Bookcase"
                }
                description={
                    isRegister
                        ? "Save your place in the reading community."
                        : "Sign in to continue managing your library."
                }
            />
            <section className="form-panel narrow auth-panel">
                <form onSubmit={submit}>
                    <label>
                        Username
                        <input
                            required
                            minLength="3"
                            maxLength="20"
                            value={credentials.username}
                            onChange={(e) =>
                                setCredentials({
                                    ...credentials,
                                    username: e.target.value,
                                })
                            }
                            placeholder="your username"
                        />
                    </label>
                    <label>
                        Password
                        <input
                            required
                            minLength="6"
                            type="password"
                            value={credentials.password}
                            onChange={(e) =>
                                setCredentials({
                                    ...credentials,
                                    password: e.target.value,
                                })
                            }
                            placeholder="At least 6 characters"
                        />
                    </label>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting
                            ? "Connecting..."
                            : isRegister
                              ? "Create account"
                              : "Log in"}
                    </button>
                </form>
                <p className="auth-switch">
                    {isRegister
                        ? "Already registered? "
                        : "Don't have an account? "}
                    <button
                        className="text-link"
                        type="button"
                        onClick={() => {
                            window.location.hash = isRegister
                                ? "login"
                                : "register";
                        }}
                    >
                        {isRegister ? "Log in" : "Register"}
                    </button>
                </p>
            </section>
        </div>
    );
}
