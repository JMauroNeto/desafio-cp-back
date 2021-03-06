import {createBookSchema, deleteBookSchema} from '../model/Book.js'
import { BookDatabase } from '../data/BookDatabase.js';
import { v4 } from 'uuid';
const bookDatabase = new BookDatabase;

export class BookController{
    async createBook(req, res){
        try {
            const validate = createBookSchema.validate(req.body)

            if(validate.error){
                throw new Error(validate.error.details[0].message)
            }

            validate.value.id = v4();

            await bookDatabase.createBook(validate.value);

            res.sendStatus(200);
        } catch (error) {
            res.status(400).send({message: error.message});
        }
    }

    async getBooks(req, res){
        try {
            let books;

            if(req.query.title){
                books = await bookDatabase.searchByTitle(req.query.title);
            }

            else{
                books = await bookDatabase.getAllBooks();
            }

            res.status(200).send({books});
        } catch (error) {
            res.status(400).send({message: error.message});
        }
    }

    async deleteBook(req, res){
        try {
            const validate = deleteBookSchema.validate(req.params);

            if(validate.error){
                throw new Error(validate.error.details[0].message)
            }

            await bookDatabase.deleteBook(validate.value.id);

            res.sendStatus(200);
        } catch (error) {
            res.status(400).send({message: error.message});
        }
    }
}

