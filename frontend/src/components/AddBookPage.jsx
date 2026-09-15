import React, { useState } from "react";
import { PageIntro } from "./UI";

export default function AddBookPage({ showNotice, request }) {
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
        <React.Fragment>
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
        </React.Fragment>
    );
}
