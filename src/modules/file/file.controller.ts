/* eslint-disable prettier/prettier */
import { FileService } from './file.service';
import { Controller, Get, Param, Res } from '@nestjs/common';

@Controller('/files')
export class FilesController {
    constructor(private fileService: FileService) {}

    @Get('/:filename')
    async getFile(@Param('filename') filename: string, @Res() res: any) {
        res.sendFile(filename, { root: 'static/image' });
    }
}
