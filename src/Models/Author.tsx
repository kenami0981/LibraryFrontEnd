
import { Book } from "./Book";

export interface Author {
  id: string; 
  fullName: string
  biography?: string;
  nationality?: string;
  dateOfBirth?: string; 
  books: Book[]; 
}

