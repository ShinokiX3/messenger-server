/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrdersDocument = Orders & Document;

// TODO: need to calculate price at backend but i so tired for diploma

interface IOrderProduct {
    id: string;
    cost: number;
    total: number;
    quantity: number;
}

interface IOrderDelivery {
    title: string;
    ref: string;
}

@Schema()
export class Orders {
    @Prop()
    name: string;

    @Prop()
    lastname: string;

    @Prop()
    tel: string;

    @Prop({ type: Object })
    city: IOrderDelivery;

    @Prop({ type: Object })
    deliveryDepartment: IOrderDelivery;

    @Prop()
    total: number;

    @Prop()
    products: IOrderProduct[];

    @Prop()
    status: string;

    @Prop()
    date: Date;

    @Prop()
    user?: string;
}

export const OrdersSchema = SchemaFactory.createForClass(Orders);
