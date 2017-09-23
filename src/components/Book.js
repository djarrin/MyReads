import React , { Component } from 'react';
import PropTypes from 'prop-types';

class Book extends Component {
    static propTypes = {
        book: PropTypes.object.isRequired,
        booksShelfChange: PropTypes.func.isRequired
    }

    handleShelfChange = (e) => {
        let newValue = e.target.value;
        this.props.booksShelfChange(this, newValue)
    }

    render() {
        const { title } = this.props.book;

        if(this.props.book.authors !== undefined && Array.isArray(this.props.book.authors) && this.props.book.authors.length > 1) {
            this.props.book.authors = this.props.book.authors.join(' and ');
        } else if (this.props.book.authors !== undefined && Array.isArray(this.props.book.authors)) {
            this.props.book.authors = this.props.book.authors[0];
        } else if(this.props.book.authors === undefined) {
            this.props.book.authors = '';
        }

        if(this.props.book.shelf === undefined) {
            this.props.book.shelf = 'none';
        }

        if(this.props.book.imageLinks === undefined ) {
            this.props.book.imageLinks = ['thumbnail'];
            this.props.book.imageLinks.thumbnail = 'https://library.britishcouncil.org.in/static-content/isbn/noimage.jpg';
        }

        return (
            <div className="book">
                <div className="book-top">
                    <div className="book-cover" style={{ width: 128, height: 193 }}>
                        <img alt="" src={this.props.book.imageLinks.thumbnail} style={{ width: 128, height: 193 }}/>
                    </div>
                    <div className="book-shelf-changer">
                        <select onChange={this.handleShelfChange} defaultValue={this.props.book.shelf}>
                            <option value="none" disabled>Move to...</option>
                            <option value="currentlyReading" >Currently Reading</option>
                            <option value="wantToRead" >Want to Read</option>
                            <option value="read" >Read</option>
                            <option value="none" >None</option>
                        </select>
                    </div>
                </div>
                <div className="book-title">{title}</div>
                <div className="book-authors">{this.props.book.authors}</div>
            </div>
        )
    }
}


export default Book