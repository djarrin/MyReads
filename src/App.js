import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import { Route, Link } from 'react-router-dom'
import Shelf from './components/Shelf'

class BooksApp extends React.Component {
  state = {
      currentlyReading: [],
      read: [],
      wantToRead: []
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
      console.log(this.state);
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
                  />
                  <Shelf
                      title="Want to Read"
                      cat="wantToRead"
                      books={this.state.wantToRead}
                  />
                  <Shelf
                      title="Read"
                      cat="read"
                      books={this.state.read}
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
                >Close</Link>
                <div className="search-books-input-wrapper">
                    {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                  <input type="text" placeholder="Search by title or author"/>

                </div>
              </div>
              <div className="search-books-results">
                <ol className="books-grid"></ol>
              </div>
            </div>
        )}

        />


      </div>
    )
  }
}

export default BooksApp
