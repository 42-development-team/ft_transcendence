import { PartialType } from '@nestjs/swagger';
import { CreateChatroomDto } from './create-chatroom.dto';

// The extends PartialType() used in your class definition is a utility that makes all properties of a base class optional.
// This is particularly useful when creating Data Transfer Objects (DTOs) for update operations, 
// where you may want to update only some fields of an object but not all.
export class UpdateChatroomDto extends PartialType(CreateChatroomDto) {}
