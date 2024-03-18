import React, { useState } from 'react';

import { Input } from '@orionsuite/shared-components';

const InputDemo = () => {
  const [search, setSearch] = useState<any>('');
  const [search2, setSearch2] = useState<any | null>(null);
  return (
    <div
      className="flex flex-col gap-4
    "
    >
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Input text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-30"
          type="text"
        />
        <p>Input type text value: {search && search}</p>
      </div>
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Input number"
          value={search2}
          onChange={(e) => setSearch2(e.target.value)}
          className="w-30"
          type="number"
        />
        <p>Input type number value: {search2 && search2}</p>
      </div>
    </div>
  );
};

export { InputDemo };
