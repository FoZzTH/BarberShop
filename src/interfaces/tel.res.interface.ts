export interface ITelRes {
  message_id: number;
  from: {
    id: number;
    isBot: boolean;
    first_name: string;
    last_name: string;
    language_code: string;
  };
  chat: {
    id: number;
    first_name: string;
    last_name: string;
    type: string;
  };
  date: number;
  text: string;
  entities?: [{ offset: number; length: number; type: string }];
}
