export interface Category {
  id: number;
  title: string;
  svgIcon: string;
  children: Category[];
  parent?: Category;
}