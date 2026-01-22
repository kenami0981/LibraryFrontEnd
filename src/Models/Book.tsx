import { Author } from "../Models/Author"
export enum BookGenre
{
    Fiction,
    NonFiction,
    ScienceFiction,
    Biography,
    Mystery,
    Romance,
    Fantasy,
    History,
    Thriller,
    SelfHelp
}
export interface Book {
  id: string;
  title: string;
  description?: string;
  genre: BookGenre;
  authorId: string;
  author: Author;
  publishedDate: string;
  isbn: string;
  pageCount: number;
  publisher: string;
  isAvailable: boolean;
}