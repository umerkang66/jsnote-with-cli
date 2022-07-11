export type CellTypes = 'code' | 'text';
export interface CellInterface {
  id: string;
  type: CellTypes;
  content: string;
}
