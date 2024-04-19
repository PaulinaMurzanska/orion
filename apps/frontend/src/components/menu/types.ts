import { ReactNode } from 'react';

export interface MenuElement {
  id?: string;
  name?: string;
  onClick?: () => void;
  icon?: ReactNode;
  separator?: boolean;
  route?: string;
  dropdown?: {
    header: string;
    items: { name: string; onClick: () => void }[];
    columns: any[];
  };
}

export interface MenuConfig {
  items: MenuElement[];
}
