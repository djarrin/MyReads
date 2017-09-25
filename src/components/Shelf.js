import React from 'react';
import PropTypes from 'prop-types';
import Book from './Book'

const Shelf = function (props) {

    let handleBookShelfChange = (book, shelf) => {
        props.onBookShelfChange(book, shelf);
    }

    return (
        <div className="bookshelf">
            <h2 className="bookshelf-title">{props.title}</h2>
            <div className="bookshelf-books">
                <ol className="books-grid">
                    {props.books.map((book) => (
                        <li key={book.id}>
                            <Book
                                book={book}
                                booksShelfChange={handleBookShelfChange}
                            />
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    )

}

Shelf.propTypes = {
    books: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired
}
export default Shelf