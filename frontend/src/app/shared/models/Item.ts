export class Item{
  id!: string;
  type!: boolean;
  name!: string;
  img!: string;
  imgName!: string;
  characteristic!: string;
  loc!: string;
  date!: string;
  more_info!: string;
  status!: boolean;
  pin?: number | undefined | null;

  poster_id!: string;
  poster_email!: string;
  poster_name!: string;
  poster_contactinfo!: string;

  retriever_id!: string;
  retriever_email!: string;
  retriever_name!: string;
  retriever_contactinfo!: string;
  retriever_date!: string;

  returned_id!: string;
  returned_email!: string;
  returned_name!: string;
  returned_contactinfo!: string;
  returned_date!: string;
}
