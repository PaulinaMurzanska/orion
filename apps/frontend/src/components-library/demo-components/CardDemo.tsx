import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@orionsuite/shared-components';

const CardDemo = () => {
  return (
    <div>
      <Card className="p-4">
        <CardTitle>Card title</CardTitle>
        <CardDescription>CardDescription</CardDescription>
        <CardHeader>Card Header</CardHeader>
        <CardContent>
          Card Content Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          Repudiandae, corporis ad molestias optio dicta soluta laborum vitae
          delectus aperiam facere enim libero asperiores laboriosam. Animi
          deserunt nesciunt voluptas reiciendis architecto?
        </CardContent>
        <CardFooter>Card Footer</CardFooter>
      </Card>
    </div>
  );
};

export { CardDemo };
