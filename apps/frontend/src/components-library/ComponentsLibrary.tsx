import {
  ButtonDemo,
  CardDemo,
  CheckboxDemo,
  DatepickerDemo,
  EditableTableDemo,
  InputDemo,
  SelectDemo,
} from './demo-components';

import ComponentCard from './ComponentCard';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  padding: 20px;
  overflow-y: auto;
  width: 100%;
  padding-bottom: 500px;
`;

const ComponentsLibrary = () => {
  const componentsList = [
    {
      title: 'DatePicker Demo',
      component: <DatepickerDemo />,
    },
    {
      title: 'Checkbox Demo',
      component: <CheckboxDemo />,
    },
    {
      title: 'Filter Select Demo',
      component: <SelectDemo />,
    },
    {
      title: 'Buttons Demo',
      component: <ButtonDemo />,
    },
    {
      title: 'Custom Input Demo',
      component: <InputDemo />,
    },
    {
      title: 'Card Demo',
      component: <CardDemo />,
    },
    {
      title: 'Editable Table Demo - With Various Input Types',
      component: <EditableTableDemo />,
    },
  ];
  return (
    <StyledWrapper>
      <div className="text-xl font-bold mb-6">ComponentsLibrary</div>
      {componentsList.map((item, i) => (
        <ComponentCard
          key={i}
          demoComponent={item.component}
          demoTitle={item.title}
        />
      ))}
    </StyledWrapper>
  );
};

export default ComponentsLibrary;
