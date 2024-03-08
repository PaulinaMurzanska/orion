export interface MenuElement {
  name: string;
  onClick: () => void;
  icon: any;
}

export interface MenuConfig {
  items: MenuElement[];
}
