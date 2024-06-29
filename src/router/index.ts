import { createRouter, createWebHistory } from 'vue-router'

const SigninView = () => import('../views/SigninView.vue')
const MainView = () => import('../views/MainView.vue')
const RegisterView = () => import('../views/RegisterView.vue')

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
            name: 'main',
            component: MainView,
            meta: {
                title: '主页面'
            }
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
    const currentUserString = sessionStorage.getItem('currentUser')
    if (to.name !== 'signin' && to.name !== 'register' && currentUserString == null) {
        next({ path: '/signin' })
    } else {
        next()
    }
    document.title = String(to.meta.title);
})

export default router
