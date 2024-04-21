import React, { useState, useEffect } from 'react';
import book1Image from '../Images/book1.jpg';
import book2Image from '../Images/book2.jpg';
import book3Image from '../Images/book3.jpg';
import book4Image from '../Images/book4.jpg';
import book5Image from '../Images/book5.jpg';
import book6Image from '../Images/book6.jpg';
import book7Image from '../Images/book7.jpg';
import book8Image from '../Images/book8.jpg';

const BACKEND_URL = process.env.REACT_APP_API_BASE_URL
const REACT_APP_USER_BOOKS = `${BACKEND_URL}/user/books/`;
const REACT_APP_RENEW = `${BACKEND_URL}/renew/`;
const REACT_APP_RETURN = `${BACKEND_URL}/return/`;

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

const Profile = ({ userInfo }) => {
  const [userBooks, setUserBooks] = useState([]);

  useEffect(() => {
    fetch(`${REACT_APP_USER_BOOKS}${userInfo.user_id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user books');
        }
        return response.json();
      })
      .then(data => {
        setUserBooks(data);
      })
      .catch(error => {
        console.error('Error fetching user books:', error);
      });
  }, [userInfo.user_id]);

  const renewBook = (bookId) => {
    // Implement renew book functionality
    fetch(`${REACT_APP_RENEW}${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: userInfo.user_id })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to renew book');
        }
        // Refresh user's borrowed books after renewing
        return fetch(`${REACT_APP_USER_BOOKS}${userInfo.user_id}`);
      })
      .then(response => response.json())
      .then(data => {
        setUserBooks(data);
      })
      .catch(error => {
        console.error('Error renewing book:', error);
      });
  };

  const returnBook = (bookId) => {
    // Implement return book functionality
    fetch(`${REACT_APP_RETURN}${bookId}`, {
      method: 'PUT'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to return book');
        }
        // Refresh user's borrowed books after returning
        return fetch(`${REACT_APP_USER_BOOKS}${userInfo.user_id}`);
      })
      .then(response => response.json())
      .then(data => {
        setUserBooks(data);
      })
      .catch(error => {
        console.error('Error returning book:', error);
      });
  };

  return (
    <div>
      <h1 className='mt-4' style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>Your Current Books</h1>
      <div className='mt-4' style={{ display: 'flex', justifyContent: 'center' }}>
        {userBooks.length === 0 ? (
          <h6 style={{ maxWidth: '1280px', textAlign: 'center' }}>You have not borrowed any books recently.</h6>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', maxWidth: '1280px', padding: '0' }}>
            {userBooks.map((book, index) => (
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
                  <h6 className="card-title">Expires: {book.expires ? new Date(book.expires).toLocaleDateString() + ', ' + new Date(book.expires).toLocaleTimeString() : 'Not set'}</h6>

                  <div className="row">
                    <div className="col-6 pr-1">
                      <button href="#" className="btn btn-primary btn-md btn-block" onClick={() => renewBook(book.id)}>Renew</button>
                    </div>
                    <div className="col-6 pl-1">
                      <button href="#" className="btn btn-primary btn-md btn-block" onClick={() => returnBook(book.id)}>Return</button>
                    </div>
                  </div>
                </div>


              </div>
            ))}
            {userBooks.length > 4 && Array((4 - (userBooks.length - 4) % 4) % 4).fill(0).map((_, index) => (
              <div key={`empty-${index}`} style={{ width: '18rem' }}></div>
            ))}
          </div>
        )}
      </div>
      <div style={{ height: '150px' }}></div>
    </div>
  );
};

export default Profile;
