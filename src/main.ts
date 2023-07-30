/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const start = async () => {
    try {
        const PORT = process.env.PORT || 3000;
        const app = await NestFactory.create(AppModule);
        app.enableCors({
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            preflightContinue: false,
            optionsSuccessStatus: 204,
        });

        await app.listen(PORT, () => console.log(`Started on PORT ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

start();
