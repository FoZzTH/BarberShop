export interface ITelCtx {
  message_id: number;
  from: {
    id: number;
    is_bot: boolean;
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
  entities: Array<Object>;
}
