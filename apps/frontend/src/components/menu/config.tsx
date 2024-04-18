import {
  BadgeDollarSignIcon,
  ClipboardListIcon,
  ClipboardSignatureIcon,
  LandmarkIcon,
  LayersIcon,
  SaveIcon,
  TruckIcon,
  UserCircle2Icon,
} from 'lucide-react';
import { MenuElement } from './types';
import { NavigateFunction } from 'react-router-dom';

export const config = ({
  navigate,
  tableViews,
}: {
  navigate: NavigateFunction;
  tableViews: any[];
}): MenuElement[] => {
  console.log('tableViews', tableViews);

  return [
    ...tableViews.map((view) => ({
      name: view.custrecord_orion_smarttable_view_title,
      columns: JSON.parse(view.custrecord_orion_view_json)?.columns ?? [],
      icon: (
        <img
          src={`/assets${view.custrecord_orion_smarttable_icon_url}`}
          alt={view.custrecord_orion_smarttable_view_title}
        />
      ),
      onClick: () => {
        navigate('/bom');
      },
    })),
    // {
    //   name: 'Records',
    //   icon: <BadgeDollarSignIcon width="20px" height="20px" />,
    //   route: 'bom',
    //   dropdown: {
    //     header: 'Quick views',
    //     items: [
    //       {
    //         name: 'Pricing',
    //         onClick: () => {
    //           navigate('/bom');
    //         },
    //       },
    //       {
    //         name: 'PO/ACK',
    //         onClick: () => {
    //           navigate('/bom');
    //         },
    //       },
    //       {
    //         name: 'Operations',
    //         onClick: () => {
    //           navigate('/bom');
    //         },
    //       },
    //       {
    //         name: 'Punch',
    //         onClick: () => {
    //           navigate('/bom');
    //         },
    //       },
    //       {
    //         name: 'Accounting',
    //         onClick: () => {
    //           navigate('/bom');
    //         },
    //       },
    //       {
    //         name: 'Backlog',
    //         onClick: () => {
    //           navigate('/bom');
    //         },
    //       },
    //     ],
    //   },
    // },
    // {
    //   name: 'Components Library',
    //   onClick: () => {
    //     navigate('/components');
    //   },
    //   route: 'components',
    //   icon: <ClipboardSignatureIcon width="20px" height="20px" />,
    // },
    // {
    //   name: 'Components Library',
    //   onClick: () => {
    //     navigate('/bom-import');
    //   },
    //   icon: <TruckIcon width="20px" height="20px" />,
    // },
    // {
    //   name: 'BOM Tool',
    //   onClick: () => {
    //     navigate('/orders');
    //   },
    //   icon: <ClipboardListIcon width="20px" height="20px" />,
    // },
    // {
    //   name: 'BOM list',
    //   onClick: () => {
    //     navigate('/bom');
    //   },
    //   icon: <LandmarkIcon width="20px" height="20px" />,
    // },
    // {
    //   separator: true,
    // },
    // {
    //   name: 'Summary',
    //   icon: <LayersIcon width="20px" height="20px" />,
    //   dropdown: {
    //     header: 'Summary views',
    //     items: [
    //       {
    //         name: 'Pricing summary',
    //         onClick: () => {},
    //       },
    //     ],
    //   },
    // },
    // {
    //   separator: true,
    // },
    // {
    //   name: 'Settings',
    //   onClick: () => {},
    //   icon: <UserCircle2Icon width="20px" height="20px" />,
    // },
    // {
    //   name: 'Save',
    //   onClick: () => {},
    //   icon: <SaveIcon width="20px" height="20px" />,
    // },
  ];
};
