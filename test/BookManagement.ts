import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("BookManagement", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Book = await ethers.getContractFactory("BookManagement");
    const book = await Book.deploy();

    return { book, owner, otherAccount };
  }

  it("should add a new book", async function () {
    const isbn = 123456;
    const title = "Sample Book";
    const author = "Sample Author";
    const genre = "Sample Genre";
    const publishDate = 2023;

    const { book, owner } = await loadFixture(deployFixture);
    await book.connect(owner).addBook(isbn, title, author, genre, publishDate);

    const buku = await book.getBook(isbn)

    expect(buku.title).to.equal(title);
    expect(buku.author).to.equal(author);
    expect(buku.genre).to.equal(genre);
    expect(buku.publishDate).to.equal(publishDate);
  });

  it("should update an existing book", async function () {
    const isbn = 123456;

    const title = "Sample Book";
    const author = "Sample Author";
    const genre = "Sample Genre";
    const publishDate = 2023;

    const { book, owner } = await loadFixture(deployFixture);

    await book.connect(owner).addBook(isbn, title, author, genre, publishDate);

    const newTitle = "Updated Book Title";
    const newAuthor = "Updated Author";
    const newGenre = "Updated Genre";
    const newPublishDate = 2024;

    await book.connect(owner).updateBook(isbn, newTitle, newAuthor, newGenre, newPublishDate);

    const buku = await book.getBook(isbn)

    expect(buku.title).to.equal(newTitle);
    expect(buku.author).to.equal(newAuthor);
    expect(buku.genre).to.equal(newGenre);
    expect(buku.publishDate).to.equal(newPublishDate);
  });

  it("should delete an existing book", async function () {
    const isbn = 123456;
    const title = "Sample Book";
    const author = "Sample Author";
    const genre = "Sample Genre";
    const publishDate = 2023;

    const { book, owner } = await loadFixture(deployFixture);

    await book.connect(owner).addBook(isbn, title, author, genre, publishDate);
    await book.connect(owner).deleteBook(isbn);

    const buku = await book.getBook(isbn)

    expect(buku.title).to.equal("");
    expect(buku.author).to.equal("");
    expect(buku.genre).to.equal("");
    expect(buku.publishDate).to.equal(0);
  });

  it("should not update because isbn does not exists", async function () {
    const isbn = 123456;
    const newTitle = "Updated Book Title";
    const newAuthor = "Updated Author";
    const newGenre = "Updated Genre";
    const newPublishDate = 2024;

    const { book, owner } = await loadFixture(deployFixture);

    await expect(book.connect(owner).updateBook(isbn, newTitle, newAuthor, newGenre, newPublishDate)).to.be.revertedWith("book does not exists");
  });

  it("should not delete because isbn does not exists", async function () {
    const isbn = 123456;

    const { book, owner } = await loadFixture(deployFixture);

    await expect(book.connect(owner).deleteBook(isbn)).to.be.revertedWith("book does not exists");
  });
});
