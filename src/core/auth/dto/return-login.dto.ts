export class ReturnLoginDto {
  token: string;
  client: ReturnLoginCLientDto
}

class ReturnLoginCLientDto {
  id: string;
  name: string;
  email:string;
  phoneNumber: string;
  photoUrl: string;
}