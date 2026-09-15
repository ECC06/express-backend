import React, { useState } from "react";
import { EmptyState, PageIntro } from "./UI";

export default function BrowsePage({ showNotice, request }) {
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
        <React.Fragment>
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
        </React.Fragment>
    );
}
