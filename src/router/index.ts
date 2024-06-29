import { createRouter, createWebHistory } from 'vue-router'
const SigninView = () => import('../views/SigninView.vue')
const MainView = () => import('../views/MainView.vue')
const UserInfo = () => import('../components/UserInfo.vue')

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/signin',
            alias: ['/', '/login'],
            name: 'signin',
            component: SigninView,
            meta: {
                title: '登录'
            }
        },
        {
            path: '/main',
            alias: '/main',
            name: 'main',
            component: MainView,
            meta: {
                title: '主页'
            },
            children: [
                {
                    path: 'userinfo',
                    name: 'userinfo',
                    alias: '/userinfo',
                    component: UserInfo,
                    meta: {
                        title: '个人信息'
                    }
                }
            ]
        }
    ]
})

router.beforeEach((to, from, next) => {
    const currentUserString = sessionStorage.getItem('currentUser')
    if (to.name !== 'main' && currentUserString == null) next({ path: '/main' })
    else next()
    document.title = String(to.meta.title);
})

export default router