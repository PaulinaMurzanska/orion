import { Button } from '@orionsuite/shared-components';

const ButtonDemo = () => {
  const handleBtn = () => {
    alert('Action on click');
  };
  return (
    <div className="flex flex-row gap-3">
      <Button className="w-28" onClick={handleBtn}>
        Button Default
      </Button>
      <Button className="w-28" variant={'secondary'} onClick={handleBtn}>
        Secondary{' '}
      </Button>
      <Button className="w-28" variant={'link'}>
        Link{' '}
      </Button>
      <Button className="w-28 bg-red-600 " onClick={handleBtn}>
        Custom red{' '}
      </Button>
      <Button className="w-40 bg-green-700" onClick={handleBtn}>
        Custom green{' '}
      </Button>
    </div>
  );
};

export { ButtonDemo };
