import { ApiProperty } from '@nestjs/swagger';

export class SubjectResponseDto {
  @ApiProperty({
    example: '8d9f61c7-05eb-4f2a-a8b3-3b3f5963a6b3',
    description: 'The ID of the subject in uuid format',
  })
  id: string;

  @ApiProperty({
    example: 'Computer science',
    description: 'The name of the subject',
  })
  name: string;
}
