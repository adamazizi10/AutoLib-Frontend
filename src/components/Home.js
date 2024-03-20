import React, { useState, useEffect } from 'react';

const Home = ({ userInfo }) => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [restOfTheBooks, setRestOfTheBooks] = useState([])

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await fetch(`http://localhost:3001/user/books/${userInfo.user_id}`);
        if (response.ok) {
          const data = await response.json();
          setBorrowedBooks(data);
        } else {
          console.error('Failed to fetch borrowed books');
        }
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
      }
    };

    fetchBorrowedBooks();
  }, [userInfo.user_id]);

  useEffect(() => {
    const fetchFilteredBooks = async () => {
      try {
        const authorNames = borrowedBooks.map(book => book.author);
        const response = await fetch('http://localhost:3001/books');
        if (response.ok) {
          const data = await response.json();
          const filtered = data.filter(book => !(book.borrowed_by && book.borrowed_by_username) && authorNames.includes(book.author));
          setFilteredBooks(filtered);
          const theRest = data.filter(book => !filtered.some(filteredBook => filteredBook.id === book.id) && !(book.borrowed_by && book.borrowed_by_username));
          setRestOfTheBooks(theRest);
        } else {
          console.error('Failed to fetch filtered books');
        }
      } catch (error) {
        console.error('Error fetching filtered books:', error);
      }
    };

    fetchFilteredBooks();
  }, [borrowedBooks]);

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
        const updatedFilteredBooks = filteredBooks.map(book => {
          if (book.id === bookId) {
            return { ...book, borrowed_by: userInfo.user_id, borrowed_by_username: data.borrowed_by_username, expires: data.expires };
          }
          return book;
        });
        setFilteredBooks(updatedFilteredBooks);

        const updatedRestOfTheBooks = restOfTheBooks.map(book => {
          if (book.id === bookId) {
            return { ...book, borrowed_by: userInfo.user_id, borrowed_by_username: data.borrowed_by_username, expires: data.expires };
          }
          return book;
        });
        setRestOfTheBooks(updatedRestOfTheBooks);
      } else {
        console.error('Failed to borrow book');
      }
    } catch (error) {
      console.error('Error borrowing book:', error);
    }
  };


  return (
    <div>
      <h2>Home</h2>
      <div>
        <h3>Books by Authors You've Borrowed</h3>
        <ul>
          {filteredBooks.map(book => (
            <li key={book.id}>
              <strong>Title:</strong> {book.title}, <strong>Author:</strong> {book.author}, <strong>Borrowed By:</strong> {book.borrowed_by && book.borrowed_by_username ? book.borrowed_by_username : 'Available'}, <strong>Expires:</strong> {book.expires ? new Date(book.expires).toLocaleDateString() + ', ' + new Date(book.expires).toLocaleTimeString() : 'Not set'}
              {userInfo && !book.borrowed_by && (
                <button onClick={() => handleBorrow(book.id)}>Borrow</button>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Other Books</h3>
        <ul>
          {restOfTheBooks.map(book => (
            <li key={book.id}>
              <strong>Title:</strong> {book.title}, <strong>Author:</strong> {book.author}, <strong>Borrowed By:</strong> {book.borrowed_by && book.borrowed_by_username ? book.borrowed_by_username : 'Available'}, <strong>Expires:</strong> {book.expires ? new Date(book.expires).toLocaleDateString() + ', ' + new Date(book.expires).toLocaleTimeString() : 'Not set'}
              {userInfo && !book.borrowed_by && (
                <button onClick={() => handleBorrow(book.id)}>Borrow</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
