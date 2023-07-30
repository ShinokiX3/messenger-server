import { Test, TestingModule } from '@nestjs/testing';
import { MessegesService } from './messeges.service';

describe('MessegesService', () => {
    let service: MessegesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MessegesService],
        }).compile();

        service = module.get<MessegesService>(MessegesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
