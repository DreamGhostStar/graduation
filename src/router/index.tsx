import My from "pages/my";
import Home from "../pages/home";
import Login from "../pages/login";

interface router {
    path: string;
    component: any;
    children?: Array<router>;
}

const routers: Array<router> = [
    {
        path: '/home/:type',
        component: <Home />
    },
    {
        path: '/home/:type/:id',
        component: <Home />
    },
    {
        // TODO: 默认未匹配到则到/login/register
        path: '/login/:type',
        component: <Login />
    },
    {
        path: '/user/:id',
        component: <My />
    }
]
export default routers

