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
export interface BookDto {
  id: string;
  title: string;
  description?: string | null;
  genre: string;
  publishedDate: string;
  authorId: string;
  authorName: string;
  isbn: string;
  pageCount: number;
  publisher: string;
  isAvailable: boolean;
}
