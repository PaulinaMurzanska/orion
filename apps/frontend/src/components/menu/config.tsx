import {
  ClipboardSignatureIcon,
  SaveIcon,
  UserCircle2Icon,
} from 'lucide-react';
import { MenuElement } from './types';
import { NavigateFunction } from 'react-router-dom';
import { groupBy } from 'lodash';
import { setColumns } from '../../views/records/recordsSlice';

export const config = ({
  navigate,
  tableViews,
  dispatch,
  updateRecord,
}: {
  navigate: NavigateFunction;
  dispatch: (x: any) => void;
  tableViews: any[];
  updateRecord: any;
}): MenuElement[] => {
  const elements: MenuElement[] = [];
  const groups = groupBy(
    tableViews,
    (view) => JSON.parse(view.custrecord_orion_view_json)?.view_group
  );
  const sortedGroups = Object.values(groups).sort((a, b) => {
    return (
      a[0].custrecord_orion_smarttable_position -
      b[0].custrecord_orion_smarttable_position
    );
  });

  sortedGroups.forEach((group, index) => {
    elements.push({
      route: 'records',
      id: group[0].id,
      icon: (
        <img
          src={`${import.meta.env.VITE_API_ASSETS_URL}/${
            group[0].custrecord_orion_smarttable_icon_url
          }`}
          alt=""
        />
      ),
      dropdown: {
        header:
          JSON.parse(group[0].custrecord_orion_view_json)?.view_group ??
          'Uncategorized',
        columns: [],
        items: group.map((view) => ({
          name: view.custrecord_orion_smarttable_view_title,
          id: view.id,
          onClick: () => {
            console.log('JSON', JSON.parse(view.custrecord_orion_view_json));
            const columns =
              JSON.parse(view.custrecord_orion_view_json)?.columns ?? [];

            dispatch(
              setColumns(
                columns.map((col: any) => ({
                  ...col,
                  header: col.label,
                }))
              )
            );
            navigate(`/records/${group[0].scriptid}`);
          },
        })),
      },
    });
    elements.push({ separator: true });
  });

  return [
    ...elements,
    {
      name: 'Components Library',
      onClick: () => {
        navigate('/components');
      },
      route: 'components',
      icon: <ClipboardSignatureIcon width="20px" height="20px" />,
    },
    { separator: true },
    {
      name: 'Settings',
      onClick: () => {},
      icon: <UserCircle2Icon width="20px" height="20px" />,
    },
    {
      name: 'Save',
      onClick: () => {
        updateRecord({});
      },
      icon: <SaveIcon width="20px" height="20px" />,
    },
  ];
};
