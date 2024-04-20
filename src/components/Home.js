import React, { useState, useEffect } from 'react';
import book1Image from '../Images/book1.jpg';
import book2Image from '../Images/book2.jpg';
import book3Image from '../Images/book3.jpg';
import book4Image from '../Images/book4.jpg';
import book5Image from '../Images/book5.jpg';
import book6Image from '../Images/book6.jpg';
import book7Image from '../Images/book7.jpg';
import book8Image from '../Images/book8.jpg';

const REACT_APP_USER_BOOKS = process.env.REACT_APP_USER_BOOKS;
const REACT_APP_BOOKS = process.env.REACT_APP_BOOKS;
const REACT_APP_BORROW = process.env.REACT_APP_BORROW;

const bookImages = [
  book1Image,
  book2Image,
  book3Image,
  book4Image,
  book5Image,
  book6Image,
  book7Image,
  book8Image,
];
const Home = ({ userInfo }) => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [restOfTheBooks, setRestOfTheBooks] = useState([])

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await fetch(`${REACT_APP_USER_BOOKS}${userInfo.user_id}`);
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
        const response = await fetch(`${REACT_APP_BOOKS}`);
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
      const response = await fetch(`${REACT_APP_BORROW}${bookId}`, {
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


      <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
        <ol class="carousel-indicators">
          <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
        </ol>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img
              height={700}
              class="d-block w-100"
              src={`${process.env.PUBLIC_URL}/HomePics/HomePic3.jpg`}
              alt="First slide" />
          </div>
          <div class="carousel-item ">
            <img
              height={700}
              class="d-block w-100"
              src={`${process.env.PUBLIC_URL}/HomePics/HomePic2.jpg`}
              alt="First slide" />
          </div>
          <div class="carousel-item ">
            <img
              height={700}
              class="d-block w-100"
              src={`${process.env.PUBLIC_URL}/HomePics/HomePic1.jpg`}
              alt="First slide" />
          </div>
        </div>
        <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a>
      </div>



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
                      src={bookImages[index % bookImages.length]} // Loop through bookImages array
                      className="card-img-top"
                      alt={`book${(index % bookImages.length) + 1}.jpg`} />
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
                  src={bookImages[index % bookImages.length]} // Loop through bookImages array
                  className="card-img-top"
                  alt={`book${(index % bookImages.length) + 1}.jpg`}
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
      <div style={{ height: '20px' }}></div>
    </div>
  );
};

export default Home;
