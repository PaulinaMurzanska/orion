import {
  ClipboardSignatureIcon,
  SaveIcon,
  UserCircle2Icon,
} from 'lucide-react';
import { MenuElement } from './types';
import { NavigateFunction } from 'react-router-dom';
import { groupBy } from 'lodash';
import { setColumns } from '../../views/records/recordsSlice';

export const DEFAULT_GROUP = '_default';

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

  const parsedViews = tableViews.map((view) => {
    try {
      return {
        ...view,
        json: JSON.parse(view.custrecord_orion_view_json),
      };
    } catch (e: any) {
      throw new Error(`Error parsing view: ${e.toString()}`);
    }
  });

  const groups = groupBy(parsedViews, (view) => view?.json?.view_group);

  const sortedGroups = Object.values(groups).sort((a, b) => {
    return (
      a[0].custrecord_orion_smarttable_position -
      b[0].custrecord_orion_smarttable_position
    );
  });

  const onClick = (view: any, group: any, index: number) => {
    const columns = view.json?.columns ?? [];

    dispatch(
      setColumns(
        columns.map((col: any) => ({
          ...col,
          header: col.label,
        }))
      )
    );
    navigate(`/records/${group[index].scriptid}`);
  };

  sortedGroups.forEach((group, index) => {
    if (group[index]?.json?.id === DEFAULT_GROUP) {
      group.forEach((view, index) => {
        elements.push({
          route: `/records/${group[index].scriptid}`,
          id: group[index].id,
          onClick: () => onClick(view, group, index),
          icon: (
            <img
              src={`${import.meta.env.VITE_API_ASSETS_URL}/${
                group[index].custrecord_orion_smarttable_icon_url
              }`}
              alt=""
            />
          ),
        });
      });
    } else {
      elements.push({
        route: `/records/${group[0].scriptid}`,
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
          header: group[0].json?.view_group ?? 'Uncategorized',
          columns: [],
          items: group.map((view) => ({
            name: view.custrecord_orion_smarttable_view_title,
            id: view.id,
            onClick: () => onClick(view, group, 0),
          })),
        },
      });
    }
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
