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
          console.log('filtered books in home', filteredBooks)
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

      {(!filteredBooks || !filteredBooks.length) ?
        ('') : (
          <div>
            <h1 className='mt-4' style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>Recommended Books Based on your Borrow History</h1>
            <div className='mt-4' style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', maxWidth: '1280px', padding: '0' }}>
                {filteredBooks.map((book, index) => (
                  <div className="card" style={{ width: "18rem" }} key={book.id}>
                    <img
                      height={200}
                      width={200}
                      src={`${process.env.PUBLIC_URL}/Images/book${(index % 8) + 1}.jpg`}// Dynamically generate image source
                      className="card-img-top"
                      alt={`book${(index % 8) + 1}.jpg`} />
                    <div className="card-body">
                      <h5 className="card-title">{book.title}</h5>
                      <h6 className="card-title">Author: {book.author}</h6>
                      <h6 className="card-title">Status: {book.borrowed_by && book.borrowed_by_username ? book.borrowed_by_username : 'Available'}</h6>
                      <h6 className="card-title">Expires: {book.expires ? new Date(book.expires).toLocaleDateString() + ', ' + new Date(book.expires).toLocaleTimeString() : 'Not set'}</h6>
                      {userInfo && !book.borrowed_by && (
                        <button className="btn btn-primary" onClick={() => handleBorrow(book.id)}>Borrow</button>
                      )}
                    </div>
                  </div>
                ))}
                {filteredBooks.length > 4 && Array((4 - (filteredBooks.length - 4) % 4) % 4).fill(0).map((_, index) => (
                  <div key={`empty-${index}`} style={{ width: '18rem' }}></div>
                ))}
              </div>
            </div>
          </div>
        )}


      <div>
        <h1 className='mt-4' style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>Other Books</h1>
        <div className='mt-4' style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', maxWidth: '1280px', padding: '0' }}>
            {restOfTheBooks.map((book, index) => (
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
                  <h6 className="card-title">Status: {book.borrowed_by && book.borrowed_by_username ? book.borrowed_by_username : 'Available'}</h6>
                  <h6 className="card-title">Expires: {book.expires ? new Date(book.expires).toLocaleDateString() + ', ' + new Date(book.expires).toLocaleTimeString() : 'Not set'}</h6>
                  {userInfo && !book.borrowed_by && (
                    <button className="btn btn-primary" onClick={() => handleBorrow(book.id)}>Borrow</button>
                  )}
                </div>
              </div>
            ))}
            {restOfTheBooks.length > 4 && Array((4 - (filteredBooks.length - 4) % 4) % 4).fill(0).map((_, index) => (
              <div key={`empty-${index}`} style={{ width: '18rem' }}></div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
