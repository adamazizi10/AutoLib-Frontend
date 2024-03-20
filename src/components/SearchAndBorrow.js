import React, { useEffect, useState } from 'react';

const SearchAndBorrow = ({ userInfo, books, setBooks }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const filterBooks = () => {
      if (searchTerm.trim() === '') {
        setFilteredBooks(books);
      } else {
        const filtered = books.filter(book =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBooks(filtered);
      }
    };

    filterBooks();
  }, [searchTerm, books]);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:3001/books');
      if (response.ok) {
        const data = await response.json();
        console.log('data from fetch books in SEARCHANDBORROW: ', data)
        setBooks(data);
        setFilteredBooks(data);
      } else {
        console.error('Failed to fetch books');
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      const response = await fetch(`http://localhost:3001/borrow/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userInfo.user_id })
      });
      if (response.ok) {
        const data = await response.json();
        // Update local state to reflect the borrowed book
        const updatedBooks = filteredBooks.map(book => {
          if (book.id === bookId) {
            return { ...book, borrowed_by: userInfo.user_id, borrowed_by_username: data.borrowed_by_username, expires: data.expires };
          }
          return book;
        });
        setFilteredBooks(updatedBooks);
      } else {
        console.error('Failed to borrow book');
      }
    } catch (error) {
      console.error('Error borrowing book:', error);
    }
  };


  return (
    <div>
      <h2>SearchAndBorrow</h2>
      <input
        type="text"
        placeholder="Search by title or author"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {Array.isArray(filteredBooks) && filteredBooks.length > 0 ? (
        <div>
          <h3>All Books</h3>
          <ul>
            {filteredBooks.map((book) => (
              <li key={book.id}>
                <strong>Title:</strong> {book.title}, <strong>Author:</strong> {book.author},
                {book.borrowed_by && book.borrowed_by_username ? (
                  book.borrowed_by_username === userInfo.username ? (
                    <span>
                      <strong>Status: </strong>Borrowed by {book.borrowed_by_username}
                    </span>
                  ) : (
                    <span>
                      <strong>Status: </strong>Borrowed by Another User
                    </span>
                  )
                ) : (
                  <span>
                    <strong>Status:</strong> {'Available'}
                  </span>
                )}
                , <strong>Expires:</strong> {book.expires ? new Date(book.expires).toLocaleDateString() + ', ' + new Date(book.expires).toLocaleTimeString() : 'Not set'}
                {userInfo && !book.borrowed_by && (
                  <button onClick={() => handleBorrow(book.id)}>Borrow</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No books available</p>
      )}
    </div>
  );

};

export default SearchAndBorrow;
