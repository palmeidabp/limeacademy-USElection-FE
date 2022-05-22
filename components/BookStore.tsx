import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import useBookStoreContract from "../hooks/useBookStoreContract";
import type { BookStruct } from "../contracts/types/BookStore";
import Loader from "../components/loader";
import Book from "../components/book";
import { getContractAddress } from "../util";

type BookStoreContract = {
  chainId: number;
};

interface Book {
  title: string;
  id: number;
  copies: number;
  borrowed: number;
}

const BookStoreLibrary = ({ chainId }: BookStoreContract) => {
  const { account, library } = useWeb3React<Web3Provider>();
  const bookStoreContract = useBookStoreContract(getContractAddress(chainId));
  const [books, setBooks] = useState<Book[]>([]);
  const [txPendingLoader, setTxPendingLoader] = useState<boolean | false>();
  const [txPendingHash, setTxPendingHash] = useState<string | "">();
  const [title, setTitle] = useState<string>("");
  const [id, setId] = useState<number>(0);
  const [copies, setCopies] = useState<number>(0);
  const [errorMessages, setErrorMessages] = useState<String[]>([]);

  useEffect(() => {
    getBooks();
  }, []);

  const getCurrentNetwork = () => {
    return library.getNetwork();
  };

  const titleInput = (input) => {
    setTitle(input.target.value);
  };
  const idInput = (input) => {
    setId(input.target.value);
  };
  const copiesInput = (input) => {
    setCopies(input.target.value);
  };

  const getBooks = async () => {
    const _books = await bookStoreContract.GetBooks();
    var _newBooks: Book[] = [];
    _books.map((book) => {
      let b: Book = {
        title: book.title,
        id: book.id.toNumber(),
        copies: book.copies.toNumber(),
        borrowed: book.borrowed.toNumber(),
      };
      _newBooks.push(b);
    });
    setBooks(_newBooks);
  };

  const showTxPendingLoader = (hash) => {
    updateTxPendingHash(hash);
    setTxPendingLoader(true);
  };

  const hideTxPendinfLoader = () => {
    setTxPendingLoader(false);
  };
  const updateTxPendingHash = (hash) => {
    setTxPendingHash(hash);
  };
  const submitNewBook = async () => {
    try {
      const tx = await bookStoreContract.AddBook(title, id, copies);
      showTxPendingLoader(tx.hash);
      await tx.wait();
      hideTxPendinfLoader();
    } catch (err) {
      handleError("NewBook", err);
      console.log(err);
    }
    //  resetForm();
  };

  const borrowBook = async (id) => {
    try {
      const tx = await bookStoreContract.Borrow(id);
      showTxPendingLoader(tx.hash);
      await tx.wait();
      hideTxPendinfLoader();
    } catch (err) {
      handleError("Borrow Book", err);
      console.log(err);
    }
  };

  const returnBook = async (id) => {
    try {
      const tx = await bookStoreContract.ReturnBook(id);
      showTxPendingLoader(tx.hash);
      await tx.wait();
      hideTxPendinfLoader();
    } catch (err) {
      handleError("Return Book", err);
      console.log(err);
    }
  };

  const handleError = (context, err) => {
    if (err == undefined) {
      return;
    }
    if (err.data != undefined) {
      addMessage(context, err.data.message);
      return;
    }
    if (err.message != undefined) {
      addMessage(context, err.message);
      return;
    }
  };

  const resetForm = async () => {
    setTitle("");
    setId(0);
    setCopies(0);
  };

  bookStoreContract.on("NewBook", (title, int, copies) => {
    getBooks();
  });

  bookStoreContract.on("BookBorrowed", (id) => {
    getBooks();
  });
  bookStoreContract.on("BookReturned", (id) => {
    getBooks();
  });

  const deleteMessage = (i) => {
    var array = [...errorMessages];
    array.splice(i, 1);
    setErrorMessages(array);
  };

  const addMessage = (context, message) => {
    var array = [...errorMessages];
    array.push(context + " -> " + message);
    setErrorMessages(array);
  };

  return (
    <>
      {txPendingLoader ? (
        <Loader hash={txPendingHash} />
      ) : (
        <div>
          <h1>Books</h1>
          <div className="wrapper">
            {books.map((book) => (
              <Book
                key={book.id}
                book={book}
                borrowAction={borrowBook}
                returnAction={returnBook}
              />
            ))}
          </div>
          <hr />
          <h1>Add new Book</h1>
          <form>
            <label>
              title:
              <input
                onChange={titleInput}
                value={title}
                type="text"
                name="title"
              />
            </label>
            <label>
              id:
              <input onChange={idInput} value={id} type="text" name="id" />
            </label>
            <label>
              copies:
              <input
                onChange={copiesInput}
                value={copies}
                type="text"
                name="copies"
              />
            </label>
            {/* <input type="submit" value="Submit" /> */}
          </form>
          <div className="button-wrapper">
            <button onClick={submitNewBook}>Submit New Book</button>
          </div>
          <hr />
          <div className="errorMessageWrapper">
            <ul>
              {errorMessages.map((message, i) => (
                <li key={id}>
                  {" "}
                  {message} <button onClick={() => deleteMessage(i)}>X</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default BookStoreLibrary;
