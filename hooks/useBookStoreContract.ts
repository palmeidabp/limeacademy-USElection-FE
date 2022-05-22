import BOOK_STORE_ABI from "../contracts/BookStore.json";
import type { BookStore } from "../contracts/types";
import useContract from "./useContract";

export default function useBookStoreContract(contractAddress?: string) {
  return useContract<BookStore>(contractAddress, BOOK_STORE_ABI);
}
