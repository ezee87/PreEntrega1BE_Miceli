import express from 'express';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler.js';
import {__dirname} from './path.js';
import productsRouter from './routes/productsRouter.js'
import cartRouter from './routes/cartRouter.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));
app.use(errorHandler);

app.use('/products', productsRouter);

app.use('/carts', cartRouter);

app.listen(8084, ()=>{
    console.log('🚀 Server listening on port 8084');
});