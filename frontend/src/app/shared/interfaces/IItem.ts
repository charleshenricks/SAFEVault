export interface IItem{
  item_type: string,
  type: boolean;
  name: string;
  characteristic: string;
  loc: string;
  date: string;
  more_info: string;
  status: boolean;
  pin?: number | undefined | null;
  poster_id: string;
  poster_email: string;
  poster_name: string;
  poster_contactinfo: string;

}
