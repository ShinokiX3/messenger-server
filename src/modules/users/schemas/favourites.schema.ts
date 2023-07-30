/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FavouritesDocument = Favourites & Document;

@Schema()
export class Favourites {
    @Prop()
    products: string[];
}

export const FavouritesSchema = SchemaFactory.createForClass(Favourites);
