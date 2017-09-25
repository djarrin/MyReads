import React , { Component } from 'react';
import { Link } from 'react-router-dom'
import * as BooksAPI from '../BooksAPI'
import PropTypes from 'prop-types';
import Book from './Book'
import { Debounce } from 'react-throttle';

class Search extends Component {
    state = {
        booksQuery: []
    }

    static propType = {
        bsBooks: PropTypes.array.isRequired,
        onBookShelfChange: PropTypes.func.isRequired
    }

    //got this function from https://stackoverflow.com/questions/16227197/compute-intersection-of-two-arrays-in-javascript
    intersect = (a, b) => {
        let t;
        if (b.length > a.length) {
            t = b;
            b = a;
            a = t; // indexOf to loop over shorter
        }
        return a.filter(function (e) {
            return b.indexOf(e) > -1;
        });
    }

    updateQuery = (query) => {

        //if query is empty set the booksQuery state
        //to empty and return so as not to make an unnecessary
        //request
        if(query === '') {
            this.setState({
                booksQuery: []
            })

            return
        }

        BooksAPI.search(query, 20).then((books) => {

            this.updateBookSearchState(books);

            //if call returns empty/error set booksQuery prop to empty
            if (books !== undefined && books.error !== "empty query") {

                this.setState({
                    booksQuery: books
                })
            } else {
                this.setState({
                    booksQuery: []
                })
            }

        })


    }

    updateBookSearchState = (books) => {

        if(books !== undefined && books.error !== "empty query") {
            // since the search method does not return proper shelf we need to iterate over our current
            // states and the new search terms to find what the current shelf state is for each book
            let bookIds = books.map(book => book.id);
            // let currentlyReadingIntersect = this.intersect(bookIds, this.state.currentlyReading.map( cr => cr.id));
            let currentlyReadingIntersect = this.intersect(bookIds, this.props.bsBooks.filter((cr) => cr.shelf === 'currentlyReading').map(b => b.id));
            let readIntersects = this.intersect(bookIds, this.props.bsBooks.filter(r => r.shelf === 'read').map((b) => b.id));
            let wantToReadIntersects = this.intersect(bookIds, this.props.bsBooks.filter((wr) => wr.shelf === 'wantToRead').map((b) => b.id));

            for (let i = 0; i < books.length; i++) {
                if (currentlyReadingIntersect.includes(books[i].id)) {
                    books[i].shelf = 'currentlyReading';
                }
                if (readIntersects.includes(books[i].id)) {
                    books[i].shelf = 'read';
                }
                if (wantToReadIntersects.includes(books[i].id)) {
                    books[i].shelf = 'wantToRead';
                }
            }
        }
    }

    //used to clear query and state on search page exit
    clearQuery = () => {
        this.setState({
            query: '',
            booksQuery: []
        })
    }

    handleBookShelfChange = (book, shelf) => {
        this.props.onBookShelfChange(book, shelf);
    }

    render() {

        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link
                        to="/"
                        className="close-search"
                        onClick={this.clearQuery}
                    >Close</Link>
                    <div className="search-books-input-wrapper">
                        {/*Have the Debouce method here to prevent quick type errors*/}
                        <Debounce time="200" handler="onChange">
                            <input
                                type="text"
                                placeholder="Search by title or author"
                                onChange={(event) => this.updateQuery(event.target.value)}
                            />
                        </Debounce>

                    </div>
                </div>
                <div className="search-books-results">
                    <ol className="books-grid">
                        {this.state.booksQuery.map(book => (
                            <li key={book.id}>
                                <Book
                                    book={book}
                                    booksShelfChange={this.handleBookShelfChange}
                                />
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        )
    }
}

export default Search