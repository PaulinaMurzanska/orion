import { ReactNode } from 'react';

export interface MenuElement {
  name?: string;
  onClick?: () => void;
  icon?: ReactNode;
  separator?: boolean;
  route?: string;
  dropdown?: {
    header: string;
    items: { name: string; onClick: () => void }[];
  };
}

export interface MenuConfig {
  items: MenuElement[];
}
