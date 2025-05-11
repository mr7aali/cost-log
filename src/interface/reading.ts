// export type IReading = {
//   user_id: string;
//   value: number;
//   u_id: number;
//   date: { day: number; month: number; year: number };
// };

export type IReading = {
  _id: string;
  r_id: number;
  user_id: string;
  value: number;
  u_id: number;
  unit: number;
  date: {
    day: number;
    month: number;
    year: number;
  };
  prepaidAmmount: number;
  createdAt: string; // or Date if you parse it
  updatedAt: string; // or Date if you parse it
  __v: number;
};
