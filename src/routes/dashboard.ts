import { Hono } from 'hono';
import { styles } from '../ui/index';

const dashboardRoute = new Hono();

dashboardRoute.get('/', (c) => {
  return c.html(styles);
});

export default dashboardRoute;
