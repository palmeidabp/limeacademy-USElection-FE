import React from "react";

import { LoaderContainer } from "./styles";

export default function Book(props) {
  return (
    <div className="book" key={props.book.id}>
      <h3>Book : {props.book.id}</h3>
      <p>
        <span>Title : {props.book.title}</span>
        <br />
        <span>
          Copies : {props.book.copies}
          <button
            disabled={props.book.borrowed > 0}
            onClick={() => props.borrowAction(props.book.id)}
          >
            Borrow
          </button>
        </span>
        <br />
        <span>
          Borrowed Copies : {props.book.borrowed}
          <button
            disabled={props.book.borrowed == 0}
            onClick={() => props.returnAction(props.book.id)}
          >
            Return
          </button>
        </span>
      </p>
    </div>
  );
}
