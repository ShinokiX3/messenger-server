import { Test, TestingModule } from '@nestjs/testing';
import { MessegesGateway } from './messeges.gateway';
import { MessegesService } from './messeges.service';

describe('MessegesGateway', () => {
    let gateway: MessegesGateway;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MessegesGateway, MessegesService],
        }).compile();

        gateway = module.get<MessegesGateway>(MessegesGateway);
    });

    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });
});
