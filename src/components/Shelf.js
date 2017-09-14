import React , { Component } from 'react';
import PropTypes from 'prop-types';
import Book from './Book'

class Shelf extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        cat: PropTypes.string.isRequired,
        books: PropTypes.array.isRequired
    };

    render() {


        return (
            <div className="bookshelf">
                <h2 className="bookshelf-title">{this.props.title}</h2>
                <div className="bookshelf-books">
                    <ol className="books-grid">
                        {this.props.books.map((book) => (
                            <li key={book.id}>
                                <Book
                                    title={book.title}
                                    author={book.author}
                                    bookImage={book.imageLinks.thumbnail}
                                />
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        )
    }
}

Shelf.propTypes = {
    title: PropTypes.string.isRequired,
    cat: PropTypes.string.isRequired,
    books: PropTypes.array.isRequired
};

export default Shelf