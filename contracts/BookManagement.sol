// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BookManagement is Ownable {
  struct Book {
    uint256 isbn;
    string title;
    string author;
    string genre;
    uint256 publishDate;
  }

  mapping(uint256 => Book) private _bookList;
  mapping(uint256 => bool) private _bookExists;

  constructor() {
    
  }

  function bookExists(uint256 _isbn) public view returns (bool) {
    return _bookExists[_isbn];
  }

  function getBook(uint256 _isbn) external view returns (Book memory) {
    return _bookList[_isbn];
  }

  function addBook(
    uint256 _isbn, 
    string memory _title, 
    string memory _author, 
    string memory _genre, 
    uint256 _publishDate) public onlyOwner returns (Book memory) {
    require(bookExists(_isbn) == false, "book already exists");

    _bookList[_isbn] = Book(
        _isbn,
        _title,
        _author,
        _genre,
        _publishDate
    );
    _bookExists[_isbn] = true;

    return _bookList[_isbn];
  }

  function updateBook(
    uint256 _isbn, 
    string memory _title, 
    string memory _author, 
    string memory _genre, 
    uint256 _publishDate) public onlyOwner returns (Book memory) {
    require(bookExists(_isbn), "book does not exists");

    _bookList[_isbn].title = _title;
    _bookList[_isbn].author = _author;
    _bookList[_isbn].genre = _genre;
    _bookList[_isbn].publishDate = _publishDate;
    
    return _bookList[_isbn];
  }

  function deleteBook(uint256 _isbn) public onlyOwner {
    require(bookExists(_isbn), "book does not exists");
    
    delete _bookExists[_isbn];
    delete _bookList[_isbn];
  }
}

