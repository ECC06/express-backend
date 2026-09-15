import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
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

function App() {
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

    return (
        <div
            className={
                page === "login" || page === "register"
                    ? "app-shell auth-shell"
                    : "app-shell"
            }
        >
            {page !== "login" && page !== "register" && (
                <header className="topbar">
                    <nav className="main-nav" aria-label="Main navigation">
                        {pages
                            .filter(
                                (item) =>
                                    item !== "login" && item !== "register",
                            )
                            .map((item) => (
                                <button
                                    className={
                                        page === item
                                            ? "nav-link active"
                                            : "nav-link"
                                    }
                                    key={item}
                                    onClick={() => navigate(item)}
                                >
                                    {labels[item]}
                                </button>
                            ))}
                    </nav>
                    <button
                        className="nav-link logout-button"
                        type="button"
                        onClick={() => {
                            localStorage.removeItem("bookcase-authenticated");
                            setIsAuthenticated(false);
                            setPage("login");
                            window.history.replaceState(null, "", "#login");
                        }}
                    >
                        Log out
                    </button>
                </header>
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
                    <BrowsePage showNotice={showNotice} />
                )}
                {page === "add" && isAuthenticated && (
                    <AddBookPage showNotice={showNotice} />
                )}
                {page === "register" && (
                    <RegisterPage showNotice={showNotice} />
                )}
                {page === "login" && (
                    <LoginPage
                        showNotice={showNotice}
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

const labels = {
    browse: "Browse books",
    add: "Add a book",
    register: "Register",
    login: "Login",
};

function getPage(isAuthenticated) {
    const requested = window.location.hash.replace("#", "");
    const page = pages.includes(requested) ? requested : "login";
    if (!isAuthenticated && (page === "browse" || page === "add")) {
        return "login";
    }
    return page;
}

function BrowsePage({ showNotice }) {
    const [books, setBooks] = useState([]);
    const [author, setAuthor] = useState("");
    const [loaded, setLoaded] = useState(false);

    const loadBooks = async (
        path = "/books",
        message = "Library refreshed.",
    ) => {
        try {
            setBooks(await request(path));
            setLoaded(true);
            showNotice("success", message);
        } catch (error) {
            showNotice("error", error.message);
        }
    };

    return (
        <>
            <PageIntro
                eyebrow="Your collection"
                title="Browse the library"
                description="Discover something new or find books by your favorite author."
            />
            <section className="toolbar">
                <button onClick={() => loadBooks()}>Refresh library</button>
                <form
                    className="search-form"
                    onSubmit={(event) => {
                        event.preventDefault();
                        if (author.trim()) {
                            loadBooks(
                                `/books/author/${encodeURIComponent(author.trim())}`,
                                `Showing books by ${author.trim()}.`,
                            );
                        }
                    }}
                >
                    <input
                        value={author}
                        onChange={(event) => setAuthor(event.target.value)}
                        placeholder="Search by author"
                        aria-label="Search by author"
                    />
                    <button
                        type="submit"
                        className="button-secondary"
                        disabled={!author.trim()}
                    >
                        Search
                    </button>
                </form>
            </section>
            {!loaded ? (
                <EmptyState
                    title="Your library is waiting"
                    text="Refresh the library to see all available books."
                />
            ) : books.length === 0 ? (
                <EmptyState
                    title="No books found"
                    text="Try another author or add the first book to your collection."
                />
            ) : (
                <div className="book-grid">
                    {books.map((book) => (
                        <article className="book-card" key={book._id}>
                            <div className="book-cover">
                                {book.title.slice(0, 1).toUpperCase()}
                            </div>
                            <div>
                                <h2>{book.title}</h2>
                                <p className="book-author">{book.author}</p>
                                <p className="book-description">
                                    {book.description ||
                                        "No description provided."}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </>
    );
}

function AddBookPage({ showNotice }) {
    const [book, setBook] = useState({
        title: "",
        author: "",
        description: "",
    });
    const submit = async (event) => {
        event.preventDefault();
        try {
            await request("/books", {
                method: "POST",
                body: JSON.stringify(book),
            });
            setBook({ title: "", author: "", description: "" });
            showNotice("success", "Your book was added to the library.");
        } catch (error) {
            showNotice("error", error.message);
        }
    };

    return (
        <>
            <PageIntro
                eyebrow="Grow your collection"
                title="Add a book"
                description="Share a favorite title with your library."
            />
            <section className="form-panel narrow">
                <form onSubmit={submit}>
                    <label>
                        Title
                        <input
                            required
                            value={book.title}
                            onChange={(e) =>
                                setBook({ ...book, title: e.target.value })
                            }
                            placeholder="The Great Gatsby"
                        />
                    </label>
                    <label>
                        Author
                        <input
                            required
                            value={book.author}
                            onChange={(e) =>
                                setBook({ ...book, author: e.target.value })
                            }
                            placeholder="F. Scott Fitzgerald"
                        />
                    </label>
                    <label>
                        Description
                        <textarea
                            value={book.description}
                            onChange={(e) =>
                                setBook({
                                    ...book,
                                    description: e.target.value,
                                })
                            }
                            placeholder="What makes this book special?"
                        />
                    </label>
                    <button type="submit">Add to library</button>
                </form>
            </section>
        </>
    );
}

function RegisterPage({ showNotice }) {
    return <AuthPage type="register" showNotice={showNotice} />;
}

function LoginPage({ showNotice, onLogin }) {
    return <AuthPage type="login" showNotice={showNotice} onLogin={onLogin} />;
}

function AuthPage({ type, showNotice, onLogin }) {
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

function PageIntro({ eyebrow, title, description }) {
    return (
        <div className="page-intro">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{description}</p>
        </div>
    );
}

function EmptyState({ title, text }) {
    return (
        <div className="empty-state">
            <span className="empty-icon">✦</span>
            <h2>{title}</h2>
            <p>{text}</p>
        </div>
    );
}

export default App;
