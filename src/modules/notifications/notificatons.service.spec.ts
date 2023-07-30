import { Test, TestingModule } from '@nestjs/testing';
import { NotificatonsService } from '../notificatons/notificatons.service';

describe('NotificatonsService', () => {
    let service: NotificatonsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [NotificatonsService],
        }).compile();

        service = module.get<NotificatonsService>(NotificatonsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
