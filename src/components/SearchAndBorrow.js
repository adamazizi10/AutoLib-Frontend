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
        if (Array.isArray(data)) { // Check if the response is an array
          setBooks(data);
          setFilteredBooks(data);
        } else {
          console.error('Received unexpected response:', data);
        }
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
    <>
      <div>
        <div className="input-group mb-3 mt-3" style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-default">Search</span>
          </div>
          <input type="text"
            className="form-control"
            placeholder="Search by title or author"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default" />
        </div>
        {Array.isArray(filteredBooks) && filteredBooks.length > 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', maxWidth: '1280px', padding: '0' }}>
              {filteredBooks.map((book, index) => (
                <div className="card" style={{ width: "18rem" }} key={book.id}>
                  <img
                  height={200}
                  width={200}
                   src={`${process.env.PUBLIC_URL}/Images/book${(index % 8) + 1}.jpg`}// Dynamically generate image source
                    className="card-img-top"
                    alt={`book${(index % 8) + 1}.jpg`}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{book.title}</h5>
                    <h6 className="card-title">Author: {book.author}</h6>
                    <h6 className="card-title">Status: {book.borrowed_by && book.borrowed_by_username ? (
                      book.borrowed_by_username === userInfo.username ? (
                        <span>Borrowed by {book.borrowed_by_username}</span>
                      ) : (
                        <span>Borrowed by Another User</span>
                      )
                    ) : (
                      <span>Available</span>
                    )}</h6>
                    <h6 className="card-title">Expires: {book.expires ? new Date(book.expires).toLocaleDateString() + ', ' + new Date(book.expires).toLocaleTimeString() : 'Not set'}</h6>
                    {userInfo && !book.borrowed_by && (
                      <button href="#" className="btn btn-primary" onClick={() => handleBorrow(book.id)}>Borrow</button>
                    )}
                  </div>
                </div>
              ))}



              {filteredBooks.length > 4 && Array((4 - (filteredBooks.length - 4) % 4) % 4).fill(0).map((_, index) => (
                <div key={`empty-${index}`} style={{ width: '18rem' }}></div>
              ))}
            </div>
          </div>
        ) : (
          <p style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center', color: 'red' }}>No book or author found by that name</p>
        )}
      </div>
    </>
  );


};

export default SearchAndBorrow;