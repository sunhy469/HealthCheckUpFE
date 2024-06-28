import { createRouter, createWebHistory } from 'vue-router'
const SigninView = () => import('../views/SigninView.vue')

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
        }
    ]
})

router.beforeEach((to, from, next) => {
    const currentUserString = sessionStorage.getItem('currentUser')
    if (to.name !== 'signin' && currentUserString == null) next({ path: '/signin' })
    else next()
    document.title = String(to.meta.title);
})

export default router