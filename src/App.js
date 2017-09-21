import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import { Route, Link } from 'react-router-dom'
import Shelf from './components/Shelf'
import Book from "./components/Book";

class BooksApp extends React.Component {
  state = {
      currentlyReading: [],
      read: [],
      wantToRead: [],
      searchBooks: []
  };

  //will get our initial state of the page by getting all books
  //then filtering them out by their respective states
  componentDidMount() {
    BooksAPI.getAll().then((books) => {

      let currentReading = books.filter( book => book.shelf === 'currentlyReading');
      let wantToRead = books.filter( book => book.shelf === 'wantToRead');
      let read = books.filter( book => book.shelf === 'read');
      this.setState({
          currentlyReading: currentReading,
          wantToRead: wantToRead,
          read: read
      });

    })
  }

  moveBookShelf = (book, newValue) => {

      // this switch will remove from one of the states
      switch (book.props.book.shelf) {
          case 'currentlyReading':
              this.setState( (state) => ({
                  currentlyReading: state.currentlyReading.filter( (b) => b.id !== book.props.book.id)
              }));
              break;
          case 'wantToRead':
              this.setState( (state) => ({
                  wantToRead: state.wantToRead.filter( (b) => b.id !== book.props.book.id)
              }));
              break;
          case 'read':
              this.setState( (state) => ({
                  read: state.read.filter( (b) => b.id !== book.props.book.id)
              }));
              break;
          default:
      }

      //this switch will add the book to its new shelf
      switch (newValue) {
          case 'currentlyReading':
              book.props.book.shelf = newValue;

              this.setState( (state) => ({
                  currentlyReading: state.currentlyReading.concat([book.props.book])
              }));
              break;
          case 'wantToRead':
              book.props.book.shelf = newValue;
              this.setState( (state) => ({
                  wantToRead: state.wantToRead.concat([book.props.book])
              }));
              break;
          case 'read':
              book.props.book.shelf = newValue;
              this.setState( (state) => ({
                  read: state.read.concat([book.props.book])
              }));
              break;
          default:
      }

      BooksAPI.update(book.props.book, newValue);

  }

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

      //if query is empty set the searchBooks state
      //to empty and return so as not to make an unnecessary
      //request
      if(query === '') {
          this.setState({
              searchBooks: []
          })

          return
      }

      BooksAPI.search(query, 20).then((books) => {

          //since the search method does not return proper shelf we need to iterate over our current
          //states and the new search terms to find what the current shelf state is for each book
          let bookIds = books.map( book => book.id);
          let currentlyReadingIntersect = this.intersect(bookIds, this.state.currentlyReading.map( cr => cr.id));
          let readIntersects = this.intersect(bookIds, this.state.read.map( r => r.id));
          let wantToReadIntersects = this.intersect(bookIds, this.state.wantToRead.map( wr => wr.id));

         for(let i = 0; i < books.length; i++) {
             if(currentlyReadingIntersect.includes(books[i].id)) {
                 books[i].shelf = 'currentlyReading';
             }
             if(readIntersects.includes(books[i].id)) {
                 books[i].shelf = 'read';
             }
             if(wantToReadIntersects.includes(books[i].id)) {
                 books[i].shelf = 'wantToRead';
             }
         }

          //if call returns empty/error set searchBooks prop to empty
          if (books !== undefined && books.error !== "empty query") {

              this.setState({
                  searchBooks: books
              })
          } else {
              this.setState({
                  searchBooks: []
              })
          }

      })


  }

  //used to clear query and state on search page exit
  clearQuery = () => {
      this.setState({
          query: '',
          searchBooks: []
      })
  }

  render() {
    return (
      <div className="app">
        <Route exact path="/" render={() => (
            <div className="list-books">
              <div className="list-books-title">
                <h1>MyReads</h1>
              </div>
              <div className="list-books-content">
                <div>
                  <Shelf
                    title="Currently Reading"
                    cat="currentlyReading"
                    books={this.state.currentlyReading}
                    onBookShelfChange={this.moveBookShelf}
                  />
                  <Shelf
                      title="Want to Read"
                      cat="wantToRead"
                      books={this.state.wantToRead}
                      onBookShelfChange={this.moveBookShelf}
                  />
                  <Shelf
                      title="Read"
                      cat="read"
                      books={this.state.read}
                      onBookShelfChange={this.moveBookShelf}
                  />
                </div>
              </div>
              <div className="open-search">
                <Link
                  to="/search"
                >Add a book</Link>
              </div>
            </div>
        )}
        />

        <Route path="/search" render={() => (
            <div className="search-books">
              <div className="search-books-bar">
                <Link
                  to="/"
                  className="close-search"
                  onClick={this.clearQuery}
                >Close</Link>
                <div className="search-books-input-wrapper">
                  <input
                      type="text"
                      placeholder="Search by title or author"
                      onChange={(event) => this.updateQuery(event.target.value)}
                  />

                </div>
              </div>
              <div className="search-books-results">
                <ol className="books-grid">
                    {this.state.searchBooks.map(book => (
                        <li key={book.id}>
                            <Book
                                book={book}
                                booksShelfChange={this.moveBookShelf}
                            />
                        </li>
                    ))}
                </ol>
              </div>
            </div>
        )}

        />


      </div>
    )
  }
}

export default BooksApp
