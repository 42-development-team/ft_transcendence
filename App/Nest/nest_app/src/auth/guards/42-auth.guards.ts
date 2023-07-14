import { Injectable } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';

// authguard 42 c'est de la magie, ca appelle la strategy 42 que j'ai créé
@Injectable()
export class FortyTwoAuthGuards extends AuthGuard('42') {}