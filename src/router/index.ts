import { createRouter, createWebHistory } from 'vue-router'

const SigninView = () => import('../views/SigninView.vue')
const MainView = () => import('../views/MainView.vue')
const RegisterView = () => import('../views/RegisterView.vue')
const UserInfo = () => import('../components/UserInfo.vue')
const UserManage = () => import('../components/UserManage.vue')

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
                    },
                },
                {
                    path: 'usermanage',
                    name: 'usermanage',
                    alias: '/usermanage',
                    component: UserManage,
                    meta: {
                        title: '用户管理'
                    },
                }
            ]
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView,
            meta: {
                title: '注册'
            }
        }
    ]
})

router.beforeEach((to, from, next) => {
    const currentUserString = localStorage.getItem('roleid')
    console.log(currentUserString)
    if (to.name !== 'signin' && to.name !== 'register' && currentUserString == null) {
        next({ path: '/signin' })
    } else {
        next()
    }
    document.title = String(to.meta.title);
})

export default router
