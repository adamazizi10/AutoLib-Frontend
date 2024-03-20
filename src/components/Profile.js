import React, { useState, useEffect } from 'react';

const Profile = ({ userInfo }) => {
  const [userBooks, setUserBooks] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/user/books/${userInfo.user_id}`)
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
    fetch(`http://localhost:3001/renew/${bookId}`, {
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
        return fetch(`http://localhost:3001/user/books/${userInfo.user_id}`);
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
    fetch(`http://localhost:3001/return/${bookId}`, {
      method: 'PUT'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to return book');
        }
        // Refresh user's borrowed books after returning
        return fetch(`http://localhost:3001/user/books/${userInfo.user_id}`);
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
      <div>Username: {userInfo.username}</div>
      <div>
        <h2>User's Borrowed Books:</h2>
        <ul>
          {userBooks.map(book => (
            <li key={book.id}>
              <strong>Title:</strong> {book.title}, <strong>Author:</strong> {book.author}, <strong>Expires:</strong> {book.expires}
              <button onClick={() => renewBook(book.id)}>Renew</button>
              <button onClick={() => returnBook(book.id)}>Return</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
