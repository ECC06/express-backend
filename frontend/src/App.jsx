import { useEffect, useState } from "react";
import AddBookPage from "./components/AddBookPage";
import { LoginPage, RegisterPage } from "./components/AuthPage";
import BrowsePage from "./components/BrowsePage";
import Navigation from "./components/Navigation";

const configuredApiUrl = import.meta.env.VITE_API_URL;

const API_URL = configuredApiUrl.replace(/\/+$/, "").replace(/\/books$/, "");

const pages = ["browse", "add", "register", "login"];

async function request(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || data.errors?.[0]?.msg || "Request failed",
        );
    }

    return data;
}

function getPage(isAuthenticated) {
    const requested = window.location.hash.replace("#", "");
    const page = pages.includes(requested) ? requested : "login";
    if (!isAuthenticated && (page === "browse" || page === "add")) {
        return "login";
    }
    return page;
}

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        () => localStorage.getItem("bookcase-authenticated") === "true",
    );
    const [page, setPage] = useState(() => getPage(isAuthenticated));
    const [notice, setNotice] = useState(null);

    useEffect(() => {
        const onHashChange = () => setPage(getPage(isAuthenticated));
        window.addEventListener("hashchange", onHashChange);
        return () => window.removeEventListener("hashchange", onHashChange);
    }, [isAuthenticated]);

    const navigate = (nextPage) => {
        if (!isAuthenticated && (nextPage === "browse" || nextPage === "add")) {
            nextPage = "login";
        }
        window.location.hash = nextPage;
        setNotice(null);
    };

    const showNotice = (type, text) => setNotice({ type, text });

    const handleLogout = () => {
        localStorage.removeItem("bookcase-authenticated");
        setIsAuthenticated(false);
        setPage("login");
        window.history.replaceState(null, "", "#login");
    };

    return (
        <div
            className={
                page === "login" || page === "register"
                    ? "app-shell auth-shell"
                    : "app-shell"
            }
        >
            {page !== "login" && page !== "register" && (
                <Navigation
                    page={page}
                    navigate={navigate}
                    onLogout={handleLogout}
                />
            )}

            <main
                className={
                    page === "login" || page === "register"
                        ? "auth-page"
                        : "page"
                }
            >
                {notice && (
                    <div className={`notice ${notice.type}`} role="alert">
                        {notice.text}
                    </div>
                )}
                {page === "browse" && isAuthenticated && (
                    <BrowsePage showNotice={showNotice} request={request} />
                )}
                {page === "add" && isAuthenticated && (
                    <AddBookPage showNotice={showNotice} request={request} />
                )}
                {page === "register" && (
                    <RegisterPage showNotice={showNotice} request={request} />
                )}
                {page === "login" && (
                    <LoginPage
                        showNotice={showNotice}
                        request={request}
                        onLogin={() => {
                            localStorage.setItem(
                                "bookcase-authenticated",
                                "true",
                            );
                            setIsAuthenticated(true);
                            setPage("browse");
                            window.history.replaceState(null, "", "#browse");
                        }}
                    />
                )}
            </main>
            <footer>Bookcase · A simple library for curious readers</footer>
        </div>
    );
}
