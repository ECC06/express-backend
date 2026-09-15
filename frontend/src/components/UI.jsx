
export function PageIntro({ eyebrow, title, description }) {
    return (
        <div className="page-intro">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{description}</p>
        </div>
    );
}

export function EmptyState({ title, text }) {
    return (
        <div className="empty-state">
            <span className="empty-icon">✦</span>
            <h2>{title}</h2>
            <p>{text}</p>
        </div>
    );
}
