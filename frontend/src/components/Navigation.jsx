
const pages = ["browse", "add", "register", "login"];
const labels = {
    browse: "Browse books",
    add: "Add a book",
    register: "Register",
    login: "Login",
};

export default function Navigation({ page, navigate, onLogout }) {
    return (
        <header className="topbar">
            <nav className="main-nav" aria-label="Main navigation">
                {pages
                    .filter((item) => item !== "login" && item !== "register")
                    .map((item) => (
                        <button
                            className={
                                page === item ? "nav-link active" : "nav-link"
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
                onClick={onLogout}
            >
                Log out
            </button>
        </header>
    );
}
